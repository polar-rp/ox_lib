import { useRef, useState, useMemo } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Indicator from './indicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, useMantineTheme, rem } from '@mantine/core';
import type { GameDifficulty, SkillCheckProps } from '../../typings';

export const circleCircumference = 2 * 50 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 50,
  medium: 40,
  hard: 25,
};

const SkillCheck: React.FC = () => {
  const theme = useMantineTheme();
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });

  const skillAreaOffset = useMemo(() => {
    return circleCircumference - (Math.PI * 50 * skillCheck.difficultyOffset) / 180;
  }, [skillCheck.difficultyOffset]);

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';
    
    setSkillCheck({
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: gameData,
      keys: data.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });

    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    
    setSkillCheck((prev) => ({
      ...prev,
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      key: key.toLowerCase(),
    }));
  };

  const responsiveStyles = {
    '--sc-size': '500px',
    '--sc-r': '50',
    '--sc-sw': '8',
    '--sc-offset': skillAreaOffset,
    '--sc-circum': circleCircumference,
    
    '@media (min-height: 1440px)': {
      '--sc-r': '65',
      '--sc-sw': '10',
      '--sc-circum': 2 * 65 * Math.PI,
      '--sc-offset': 2 * 65 * Math.PI - (Math.PI * 65 * skillCheck.difficultyOffset) / 180,
    }
  } as any;

  return (
    <>
      {visible && (
        <Box style={{ position: 'relative', width: '100vw', height: '100vh', pointerEvents: 'none' }}>
          <svg
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: rem(500),
              height: rem(500),
              ...responsiveStyles
            }}
          >
            <circle
              cx="250"
              cy="250"
              fill="transparent"
              stroke={theme.colors.dark[5]}
              style={{
                r: 'var(--sc-r)',
                strokeWidth: 'var(--sc-sw)',
                strokeDasharray: 'var(--sc-circum)',
              }}
            />
            
            <circle
              cx="250"
              cy="250"
              fill="transparent"
              stroke={theme.colors[theme.primaryColor][6]}
              transform={`rotate(${skillCheck.angle}, 250, 250)`}
              style={{
                r: 'var(--sc-r)',
                strokeWidth: 'var(--sc-sw)',
                strokeDasharray: 'var(--sc-circum)',
                strokeDashoffset: 'var(--sc-offset)',
              }}
            />
            
            <Indicator
              angle={skillCheck.angle}
              offset={skillCheck.difficultyOffset}
              multiplier={
                skillCheck.difficulty === 'easy' ? 1 :
                skillCheck.difficulty === 'medium' ? 1.5 :
                skillCheck.difficulty === 'hard' ? 1.75 :
                (skillCheck.difficulty as any).speedMultiplier
              }
              handleComplete={handleComplete}
              skillCheck={skillCheck}
              style={{
                stroke: 'red',
                fill: 'transparent',
                r: 'var(--sc-r)',
                cx: '250',
                cy: '250',
                strokeWidth: 'calc(var(--sc-sw) * 2)',
                strokeDasharray: 'var(--sc-circum)',
                strokeDashoffset: 'calc(var(--sc-circum) - 3)',
              }}
            />
          </svg>

          <Box
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: theme.colors.dark[5],
              width: rem(25),
              height: rem(25),
              borderRadius: rem(5),
              fontSize: rem(16),
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.white,
              '@media (min-height: 1440px)': {
                width: rem(30),
                height: rem(30),
                fontSize: rem(22),
              }
            } as any}
          >
            {skillCheck.key.toUpperCase()}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SkillCheck;