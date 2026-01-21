import React, { useState } from 'react';
import { Box, Text, useMantineTheme, rem, Paper, Progress, Stack } from '@mantine/core';
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
          bottom: rem(40),
          position: 'absolute',
          pointerEvents: 'none',
        }}
      >
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Paper
            p="sm"
            withBorder
            shadow="xl"
            w={320}
          >
            <Stack gap={8}>
              <Text
                size="sm"
                fw={600}
                ta="center"
                style={{
                  letterSpacing: rem(1),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </Text>

              <Progress
                value={100}
                size="lg"
                onAnimationEnd={() => setVisible(false)}
                styles={{
                  section: {
                    animation: visible ? `progress-bar-fill ${duration}ms linear forwards` : 'none',
                  },
                }}
              />
            </Stack>
          </Paper>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;