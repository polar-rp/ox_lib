import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, Flex, Stack, Text, useMantineTheme, rem } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const ContextMenu: React.FC = () => {
  const theme = useMantineTheme();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible, contextMenu.canClose]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Box
      style={{
        position: 'absolute',
        top: '15%',
        right: '25%',
        width: rem(320),
        height: rem(580),
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <ScaleFade visible={visible}>
        <Flex
          justify="center"
          align="center"
          mb={10}
          gap={6}
        >
          {contextMenu.menu && (
            <HeaderButton 
              leftSection="chevron-left"
              iconSize={16} 
              handleClick={() => openMenu(contextMenu.menu)} 
            />
          )}
          
          <Box
            style={{
              borderRadius: theme.radius.sm,
              flex: '1 85%',
              backgroundColor: theme.colors.dark[6],
            }}
          >
            <Text
              c="dark.0"
              p={6}
              ta="center"
            >
              <ReactMarkdown components={MarkdownComponents}>
                {contextMenu.title}
              </ReactMarkdown>
            </Text>
          </Box>

          <HeaderButton 
            leftSection="xmark" 
            canClose={contextMenu.canClose} 
            iconSize={18} 
            handleClick={closeContext} 
          />
        </Flex>

        <Box
          style={{
            height: rem(560),
            overflowY: 'auto',
          }}
        >
          <Stack gap={3}>
            {Object.entries(contextMenu.options).map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} />
            ))}
          </Stack>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ContextMenu;