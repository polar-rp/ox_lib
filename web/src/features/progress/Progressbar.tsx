import React, { useState } from 'react';
import { Box, Text, useMantineTheme, rem } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const progressBarAnimation = `
  @keyframes progress-bar-fill {
    from { width: 0%; }
    to { width: 100%; }
  }
`;

const Progressbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState(0);
  const theme = useMantineTheme();

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  return (
    <>
      <style>{progressBarAnimation}</style>
      <Box
        style={{
          width: '100%',
          height: '20%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 0,
          position: 'absolute',
          pointerEvents: 'none',
        }}
      >
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box
            bg="dark.5"
            style={{
              width: rem(350),
              height: rem(45),
              borderRadius: theme.radius.sm,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              onAnimationEnd={() => setVisible(false)}
              style={{
                height: '100%',
                backgroundColor: theme.colors[theme.primaryColor][6],
                animation: 'progress-bar-fill linear forwards',
                animationDuration: `${duration}ms`,
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  display: 'flex',
                  width: rem(350),
                  height: rem(45),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  c="gray.3"
                  style={{
                    maxWidth: rem(350),
                    padding: rem(8),
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontSize: rem(20),
                    textShadow: theme.shadows.sm,
                  }}
                >
                  {label}
                </Text>
              </Box>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;