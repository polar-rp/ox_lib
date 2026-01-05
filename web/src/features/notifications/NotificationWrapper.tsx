import React, { useState } from 'react';
import { Box, Center, Group, RingProgress, Stack, Text, ThemeIcon, useMantineTheme, rem } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const durationCircleAnimation = `
  @keyframes duration-circle {
    0% { stroke-dasharray: 0, 95; }
    100% { stroke-dasharray: 95, 0; }
  }
`;

const Notifications: React.FC = () => {
  const theme = useMantineTheme();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;
    let position = data.position || 'top-right';

    const types = { error: 'circle-xmark', success: 'circle-check', warning: 'circle-exclamation' };
    const finalIcon = (data.icon || types[data.type as keyof typeof types] || 'circle-info') as IconProp;

    let iconColor: string;
    if (!data.iconColor) {
      const colors = { error: 'red.6', success: 'teal.6', warning: 'yellow.6' };
      iconColor = colors[data.type as keyof typeof colors] || 'blue.6';
    } else {
      iconColor = tinycolor(data.iconColor).toRgbString();
    }

    if (toastId) setToastKey(prevKey => prevKey + 1);
    if (position === 'top') position = 'top-center';
    if (position === 'bottom') position = 'bottom-center';

    toast.custom(
      (t) => (
        <Box
          style={{
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'translateY(0)' : position.includes('top') ? 'translateY(-20px)' : 'translateY(20px)',
            transition: 'all 0.2s ease-in-out',
            width: rem(320),
            backgroundColor: theme.colors.dark[6],
            color: theme.colors.dark[0],
            padding: rem(12),
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.dark[4]}`,
            boxShadow: theme.shadows.md,
            fontFamily: 'Roboto, sans-serif',
            pointerEvents: 'all',
            ...data.style,
          }}
        >
          <style>{durationCircleAnimation}</style>
          <Group wrap="nowrap" gap={12} align={!data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start'}>
            {finalIcon && (
              <Box>
                {data.showDuration !== false ? (
                  <RingProgress
                    key={toastKey}
                    size={42}
                    thickness={3}
                    sections={[{ value: 100, color: iconColor }]}
                    styles={{
                      root: { margin: rem(-4) },
                      curve: {
                        animation: `duration-circle ${duration}ms linear forwards reverse`,
                      }
                    }}
                    label={
                      <Center>
                        <ThemeIcon
                          color={iconColor}
                          radius="xl"
                          size={32}
                          variant="light"
                        >
                          <LibIcon icon={finalIcon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                        </ThemeIcon>
                      </Center>
                    }
                  />
                ) : (
                  <ThemeIcon color={iconColor} radius="xl" size={36} variant="light">
                    <LibIcon icon={finalIcon} color={iconColor} animation={data.iconAnimation} />
                  </ThemeIcon>
                )}
              </Box>
            )}
            <Stack gap={2} style={{ flex: 1 }}>
              {data.title && (
                <Text fw={700} lh="xs" size="sm" c="polarCyan.4">
                  {data.title}
                </Text>
              )}
              {data.description && (
                <Box
                  style={{
                    fontSize: data.title ? rem(13) : rem(14),
                    color: theme.colors.gray[4],
                    lineHeight: 1.4,
                  }}
                >
                  <ReactMarkdown components={MarkdownComponents}>
                    {data.description}
                  </ReactMarkdown>
                </Box>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      { id: toastId, duration: duration, position: position as any }
    );
  });

  return <Toaster />;
};

export default Notifications;