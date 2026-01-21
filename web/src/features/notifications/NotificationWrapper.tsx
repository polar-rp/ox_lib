import React from 'react';
import { Box, Group, Stack, Text, ThemeIcon, Paper, Progress, rem } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const progressShrink = `
  @keyframes progress-shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

const Notifications: React.FC = () => {
  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;
    
    let position = data.position || 'top-right';
    if (position === 'top') position = 'top-center';
    if (position === 'bottom') position = 'bottom-center';

    const types = { error: 'red.6', success: 'teal.6', warning: 'yellow.6' };
    const iconColor = data.iconColor ? tinycolor(data.iconColor).toRgbString() : (types[data.type as keyof typeof types] || 'blue.6');
    const finalIcon = (data.icon || (data.type === 'error' ? 'circle-xmark' : data.type === 'success' ? 'circle-check' : 'circle-info')) as IconProp;

    toast.custom(
      (t) => (
        <Paper
          withBorder
          shadow="md"
          style={{
            opacity: t.visible ? 1 : 0,
            transform: t.visible 
              ? 'translateY(0)' 
              : position.includes('top') ? 'translateY(-20px)' : 'translateY(20px)',
            transition: 'all 0.2s ease-in-out',
            width: rem(340),
            overflow: 'hidden',
            position: 'relative',
            pointerEvents: 'all',

          }}
        >
          <style>{progressShrink}</style>
          
          <Group p="sm" align="start" wrap="nowrap" gap="md">
            <ThemeIcon 
              color={iconColor} 
              variant="light" 
              size={38} 
              radius="md"
            >
              <LibIcon icon={finalIcon} size="lg" />
            </ThemeIcon>

            <Stack gap={2} style={{ flex: 1 }}>
              {data.title && (
                <Text fw={700} size="sm" c="white" lh="sm">
                  {data.title}
                </Text>
              )}
              {data.description && (
                <Box style={{ 
                  fontSize: data.title ? rem(13) : rem(14), 
                  color: 'var(--mantine-color-gray-4)',
                  lineHeight: 1.4 
                }}>
                  <ReactMarkdown components={MarkdownComponents}>
                    {data.description}
                  </ReactMarkdown>
                </Box>
              )}
            </Stack>
          </Group>

          {data.showDuration !== false && (
            <Progress
              value={100}
              color={iconColor}
              size={3}
              radius={0}
              styles={{
                section: {
                  animation: `progress-shrink ${duration}ms linear forwards`,
                },
                root: {
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                }
              }}
            />
          )}
        </Paper>
      ),
      { id: toastId, duration: duration, position: position as any }
    );
  });

  return <Toaster />;
};

export default Notifications;