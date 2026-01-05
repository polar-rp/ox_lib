import React, { useState, useEffect } from 'react';
import { Box, RingProgress, Stack, Text, useMantineTheme, rem } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

const circleKeyframes = `
  @keyframes progress-circle-run {
    0% { stroke-dasharray: 0, 210.48; }
    100% { stroke-dasharray: 210.48, 0; }
  }
`;

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [progressDuration, setProgressDuration] = useState(0);
  const [position, setPosition] = useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = useState(0);
  const [label, setLabel] = useState('');
  const theme = useMantineTheme();

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');

    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        if (newValue >= 100) {
          clearInterval(updateProgress);
        }
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
      <style>{circleKeyframes}</style>
      <Box
        style={{
          width: '100%',
          height: position === 'middle' ? '100%' : '20%',
          bottom: 0,
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Stack 
            gap={0} 
            align="center" 
            style={{ marginTop: position === 'middle' ? rem(25) : undefined }}
          >
            <RingProgress
              size={90}
              thickness={7}
              sections={[{ value: 100, color: theme.primaryColor }]}
              onAnimationEnd={() => setVisible(false)}
              label={
                <Text
                  ta="center"
                  style={{
                    fontFamily: 'Roboto Mono, monospace',
                    textShadow: theme.shadows.sm,
                    color: theme.colors.gray[3],
                  }}
                >
                  {value}%
                </Text>
              }
              styles={{
                root: {
                  '& circle:first-of-type': {
                    stroke: theme.colors.dark[5],
                  },
                },
                curve: {
                  transition: 'none',
                  animation: `progress-circle-run ${progressDuration}ms linear forwards`,
                },
              }}
            />
            
            {label && (
              <Text
                ta="center"
                h={25}
                style={{
                  textShadow: theme.shadows.sm,
                  color: theme.colors.gray[3],
                }}
              >
                {label}
              </Text>
            )}
          </Stack>
        </ScaleFade>
      </Box>
    </>
  );
};

export default CircleProgressbar;