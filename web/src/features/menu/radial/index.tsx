import React, { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

import classes from './RadialMenu.module.css';

const PAGE_ITEMS = 6;

const calculateFontSize = (text: string): number => {
  if (text.length > 20) return 10;
  if (text.length > 15) return 12;
  return 13;
};

const splitTextIntoLines = (text: string, maxCharPerLine: number = 15): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxCharPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  return lines;
};

const degToRad = (deg: number) => deg * (Math.PI / 180);

const RadialMenu: React.FC = () => {
  const { locale } = useLocales();
  const newDimension = 350 * 1.1025;
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{ items: RadialMenuItem[]; sub?: boolean; page: number }>({
    items: [],
    sub: false,
    page: 1,
  });

  const changePage = async (increment?: boolean) => {
    setVisible(false);
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setVisible(true);
    setMenu(prev => ({ ...prev, page: increment ? prev.page + 1 : prev.page - 1 }));
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = { icon: 'ellipsis-h', label: locale.ui.more, isMore: true };
    }
    setMenuItems(items);
  }, [menu.items, menu.page, locale]);

  useNuiEvent('openRadialMenu', async (data: { items: RadialMenuItem[]; sub?: boolean; option?: string } | false) => {
    if (!data) return setVisible(false);
    let initialPage = 1;
    if (data.option) {
      data.items.findIndex((item, index) => 
        item.menu === data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
      );
    }
    setMenu({ ...data, page: initialPage });
    setVisible(true);
  });

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu(prev => ({ ...prev, items: data }));
  });

  return (
    <Box 
      className={classes.wrapper}
      onContextMenu={async (e) => {
        e.preventDefault();
        if (menu.page > 1) await changePage();
        else if (menu.sub) fetchNui('radialBack');
      }}
    >
      <ScaleFade visible={visible}>
        <svg
          style={{ overflow: 'visible' }}
          width={`${newDimension}px`}
          height={`${newDimension}px`}
          viewBox="0 0 350 350"
          transform="rotate(90)"
        >
          <g transform="translate(175, 175)">
            <circle r={175} className={classes.backgroundCircle} />
          </g>

          {menuItems.map((item, index) => {
            const pieAngle = 360 / (menuItems.length < 3 ? 3 : menuItems.length);
            const angle = degToRad(pieAngle / 2 + 90);
            const gap = 1;
            const radius = 175 * 0.65 - gap;
            const sinAngle = Math.sin(angle);
            const cosAngle = Math.cos(angle);
            
            const lines = splitTextIntoLines(item.label, 15);
            const iconYOffset = lines.length > 3 ? 3 : 0;
            const iconX = 175 + sinAngle * radius;
            const iconY = 175 + cosAngle * radius + iconYOffset;

            return (
              <g
                key={`radial-item-${index}`}
                className={classes.sector}
                transform={`rotate(-${index * pieAngle} 175 175) translate(${sinAngle * gap}, ${cosAngle * gap})`}
                onClick={async () => {
                  const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                  if (!item.isMore) fetchNui('radialClick', clickIndex);
                  else await changePage(true);
                }}
              >
                <path
                  d={`M175.01,175.01 l${175 - gap},0 A175.01,175.01 0 0,0 ${
                    175 + (175 - gap) * Math.cos(-degToRad(pieAngle))
                  }, ${175 + (175 - gap) * Math.sin(-degToRad(pieAngle))} z`}
                />
                <g transform={`rotate(${index * pieAngle - 90} ${iconX} ${iconY})`} pointerEvents="none">
                  {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                    <image
                      href={item.icon}
                      width={item.iconWidth || 50}
                      height={item.iconHeight || 50}
                      x={iconX - (item.iconWidth || 50) / 2}
                      y={iconY - (item.iconHeight || 50) / 2 - (item.iconHeight || 50) / 4}
                    />
                  ) : (
                    <LibIcon
                      x={iconX - 14.5}
                      y={iconY - 17.5}
                      icon={item.icon as IconProp}
                      width={30}
                      height={30}
                      fixedWidth
                    />
                  )}
                  <text
                    className={classes.sectorText}
                    x={iconX}
                    y={iconY + (lines.length > 2 ? 15 : 28)}
                    textAnchor="middle"
                    fontSize={calculateFontSize(item.label)}
                  >
                    {lines.map((line, idx) => (
                      <tspan x={iconX} dy={idx === 0 ? 0 : '1.2em'} key={idx}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}

          <g
            transform="translate(175, 175)"
            className={classes.centerCircle}
            onClick={async () => {
              if (menu.page > 1) await changePage();
              else if (menu.sub) fetchNui('radialBack');
              else {
                setVisible(false);
                fetchNui('radialClose');
              }
            }}
          >
            <circle r={28} />
          </g>
        </svg>

        <div className={classes.centerIconContainer}>
          <LibIcon
            icon={!menu.sub && menu.page < 2 ? 'xmark' : 'arrow-rotate-left'}
            className={classes.centerIcon}
            size="2x"
          />
        </div>
      </ScaleFade>
    </Box>
  );
};

export default RadialMenu;