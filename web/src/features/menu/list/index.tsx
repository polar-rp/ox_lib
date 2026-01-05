import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, Tooltip, useMantineTheme, rem } from '@mantine/core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import ListItem from './ListItem';
import Header from './Header';
import FocusTrap from 'focus-trap-react';
import { fetchNui } from '../../../utils/fetchNui';
import type { MenuPosition, MenuSettings } from '../../../typings';
import LibIcon from '../../../components/LibIcon';

const ListMenu: React.FC = () => {
  const theme = useMantineTheme();
  const [menu, setMenu] = useState<MenuSettings>({
    position: 'top-left',
    title: '',
    items: [],
  });
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [indexStates, setIndexStates] = useState<Record<number, number>>({});
  const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});
  const listRefs = useRef<Array<HTMLDivElement | null>>([]);
  const firstRenderRef = useRef(false);

  const getContainerStyles = (): React.CSSProperties => {
    const isTop = menu.position?.startsWith('top');
    const isBottom = menu.position?.startsWith('bottom');
    const isLeft = menu.position?.endsWith('left');
    const isRight = menu.position?.endsWith('right');

    return {
      position: 'absolute',
      pointerEvents: 'none',
      marginTop: isTop ? rem(5) : 0,
      marginBottom: isBottom ? rem(5) : 0,
      marginLeft: isLeft ? rem(5) : 0,
      marginRight: isRight ? rem(5) : 0,
      right: isRight ? rem(1) : undefined,
      left: isLeft ? rem(1) : undefined,
      bottom: isBottom ? rem(1) : undefined,
      fontFamily: 'Roboto, sans-serif',
      width: rem(384),
    };
  };

  const closeMenu = (ignoreFetch?: boolean, keyPressed?: string, forceClose?: boolean) => {
    if (menu.canClose === false && !forceClose) return;
    setVisible(false);
    if (!ignoreFetch) fetchNui('closeMenu', keyPressed);
  };

  const moveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (firstRenderRef.current) firstRenderRef.current = false;
    switch (e.code) {
      case 'ArrowDown':
        setSelected((prev) => (prev >= menu.items.length - 1 ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        setSelected((prev) => (prev <= 0 ? menu.items.length - 1 : prev - 1));
        break;
      case 'ArrowRight':
        if (Array.isArray(menu.items[selected].values)) {
          const max = menu.items[selected].values?.length! - 1;
          setIndexStates(prev => ({ ...prev, [selected]: prev[selected] + 1 <= max ? prev[selected] + 1 : 0 }));
        }
        break;
      case 'ArrowLeft':
        if (Array.isArray(menu.items[selected].values)) {
          const max = menu.items[selected].values?.length! - 1;
          setIndexStates(prev => ({ ...prev, [selected]: prev[selected] - 1 >= 0 ? prev[selected] - 1 : max }));
        }
        break;
      case 'Enter':
        if (!menu.items[selected]) return;
        if (menu.items[selected].checked !== undefined && !menu.items[selected].values) {
          return setCheckedStates(prev => ({ ...prev, [selected]: !prev[selected] }));
        }
        fetchNui('confirmSelected', [selected, indexStates[selected]]).catch();
        if (menu.items[selected].close === undefined || menu.items[selected].close) setVisible(false);
        break;
    }
  };

  useEffect(() => {
    if (menu.items[selected]?.checked === undefined || firstRenderRef.current) return;
    const timer = setTimeout(() => fetchNui('changeChecked', [selected, checkedStates[selected]]), 100);
    return () => clearTimeout(timer);
  }, [checkedStates]);

  useEffect(() => {
    if (!menu.items[selected]?.values || firstRenderRef.current) return;
    const timer = setTimeout(() => fetchNui('changeIndex', [selected, indexStates[selected]]), 100);
    return () => clearTimeout(timer);
  }, [indexStates]);

  useEffect(() => {
    if (!menu.items[selected]) return;
    listRefs.current[selected]?.scrollIntoView({ block: 'nearest', inline: 'start' });
    listRefs.current[selected]?.focus({ preventScroll: true });
    const timer = setTimeout(() => {
      fetchNui('changeSelected', [
        selected,
        menu.items[selected].values ? indexStates[selected] : menu.items[selected].checked ? checkedStates[selected] : null,
        menu.items[selected].values ? 'isScroll' : menu.items[selected].checked ? 'isCheck' : null,
      ]);
    }, 100);
    return () => clearTimeout(timer);
  }, [selected, menu, indexStates, checkedStates]);

  useEffect(() => {
    if (!visible) return;
    const keyHandler = (e: KeyboardEvent) => { if (['Escape', 'Backspace'].includes(e.code)) closeMenu(false, e.code); };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible, menu.canClose]);

  const isValuesObject = useCallback((values?: Array<any>) => 
    Array.isArray(values) && typeof values[indexStates[selected]] === 'object', [indexStates, selected]
  );

  useNuiEvent('closeMenu', () => closeMenu(true, undefined, true));

  useNuiEvent('setMenu', (data: MenuSettings) => {
    firstRenderRef.current = true;
    const startIndex = Math.max(0, Math.min(data.startItemIndex || 0, data.items.length - 1));
    setSelected(startIndex);
    if (!data.position) data.position = 'top-left';
    listRefs.current = [];
    setMenu(data);
    setVisible(true);

    const arrayIndexes: Record<number, number> = {};
    const checkedIndexes: Record<number, boolean> = {};
    data.items.forEach((item, i) => {
      if (Array.isArray(item.values)) arrayIndexes[i] = (item.defaultIndex || 1) - 1;
      else if (item.checked !== undefined) checkedIndexes[i] = item.checked || false;
    });
    setIndexStates(arrayIndexes);
    setCheckedStates(checkedIndexes);
  });

  const currentItem = menu.items[selected];
  const tooltipLabel = isValuesObject(currentItem?.values) 
    ? (currentItem.values as any)[indexStates[selected]]?.description 
    : currentItem?.description;

  return (
    <>
      {visible && currentItem && (
        <Tooltip
          label={tooltipLabel}
          opened={!!tooltipLabel}
          transitionProps={{ duration: 0 }}
          styles={{
            tooltip: {
              backgroundColor: theme.colors.dark[6],
              color: theme.colors.dark[2],
              borderRadius: theme.radius.sm,
              maxWidth: rem(350),
              whiteSpace: 'normal',
            }
          }}
        >
          <Box style={getContainerStyles()}>
            <Header title={menu.title} />
            <Box 
              onKeyDown={moveMenu}
              style={{
                height: 'fit-content',
                maxHeight: rem(415),
                overflow: 'hidden',
                borderRadius: (menu.items.length <= 6 || selected === menu.items.length - 1) ? theme.radius.md : undefined,
                backgroundColor: theme.colors.dark[8],
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            >
              <FocusTrap active={visible}>
                <Stack 
                  gap={8} 
                  p={8} 
                  style={{ overflowY: 'scroll', pointerEvents: 'all' }}
                >
                  {menu.items.map((item, index) => (
                    item.label && (
                      <ListItem
                        key={`menu-item-${index}`}
                        index={index}
                        item={item}
                        scrollIndex={indexStates[index]}
                        checked={checkedStates[index]}
                        ref={listRefs}
                      />
                    )
                  ))}
                </Stack>
              </FocusTrap>
            </Box>
            
            {menu.items.length > 6 && selected !== menu.items.length - 1 && (
              <Box 
                style={{
                  backgroundColor: theme.colors.dark[8],
                  textAlign: 'center',
                  borderBottomLeftRadius: theme.radius.md,
                  borderBottomRightRadius: theme.radius.md,
                  height: rem(25),
                }}
              >
                <LibIcon 
                  icon="chevron-down" 
                  style={{ color: theme.colors.dark[2], fontSize: rem(20) }} 
                />
              </Box>
            )}
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default ListMenu;