import React, { useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, Group, useMantineTheme, rem } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const TextUI: React.FC = () => {
  const theme = useMantineTheme();
  const [data, setData] = useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = useState(false);

  useNuiEvent<TextUiProps>('textUi', (newData) => {
    const position = newData.position || 'right-center';
    setData({ ...newData, position });
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  const getFlexStyles = (pos?: TextUiPosition) => {
    switch (pos) {
      case 'top-center':
        return { alignItems: 'flex-start', justifyContent: 'center' };
      case 'bottom-center':
        return { alignItems: 'flex-end', justifyContent: 'center' };
      case 'left-center':
        return { alignItems: 'center', justifyContent: 'flex-start' };
      case 'right-center':
        return { alignItems: 'center', justifyContent: 'flex-end' };
      default:
        return { alignItems: 'center', justifyContent: 'center' };
    }
  };

  return (
    <Box
      style={{
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        pointerEvents: 'none',
        ...getFlexStyles(data.position),
      }}
    >
      <ScaleFade visible={visible}>
        <Box
          style={{
            fontSize: rem(16),
            padding: rem(12),
            margin: rem(8),
            backgroundColor: theme.colors.dark[6],
            color: theme.colors.dark[0],
            fontFamily: 'Roboto, sans-serif',
            borderRadius: theme.radius.sm,
            boxShadow: theme.shadows.sm,
            pointerEvents: 'all',
            ...data.style,
          }}
        >
          <Group gap={12} wrap="nowrap">
            {data.icon && (
              <LibIcon
                icon={data.icon}
                size="lg"
                animation={data.iconAnimation}
                style={{
                  color: data.iconColor,
                  alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                }}
              />
            )}
            <Box style={{ lineHeight: 1.4 }}>
              <ReactMarkdown 
                components={MarkdownComponents} 
                remarkPlugins={[remarkGfm]}
              >
                {data.text}
              </ReactMarkdown>
            </Box>
          </Group>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default TextUI;