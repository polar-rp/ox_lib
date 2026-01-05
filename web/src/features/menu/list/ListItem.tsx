import { Box, Group, Progress, Stack, Text, useMantineTheme, rem } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const theme = useMantineTheme();

  return (
    <Box
      tabIndex={index}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref && typeof ref !== 'function' && ref.current) {
          ref.current[index] = element;
        }
      }}
      bg="dark.6"
      h={60}
      p={2}
      style={{
        borderRadius: theme.radius.md,
        scrollMargin: rem(8),
        cursor: 'pointer',
        outline: 'none',
        display: 'block',
        '&:focus': {
          backgroundColor: theme.colors.dark[4],
        },
      }}
    >
      <Group 
        gap={15} 
        wrap="nowrap" 
        h="100%" 
        pl={5} 
        pr={12}
      >
        {item.icon && (
          <Box 
            display="flex" 
            style={{ alignItems: 'center', width: rem(32), height: rem(32) }}
          >
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img 
                src={item.icon} 
                alt="Icon" 
                style={{ maxWidth: rem(32) }} 
              />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                // @ts-ignore
                animation={item.iconAnimation}
                style={{
                  fontSize: rem(24),
                  color: item.iconColor || theme.colors.dark[2],
                }}
              />
            )}
          </Box>
        )}

        {Array.isArray(item.values) ? (
          <Group justify="space-between" w="100%" wrap="nowrap">
            <Stack gap={0} justify="space-between">
              <Text
                c="dark.2"
                tt="uppercase"
                size={rem(12)}
                style={{ verticalAlign: 'middle' }}
              >
                {item.label}
              </Text>
              <Text>
                {typeof item.values[scrollIndex] === 'object'
                  ? (item.values[scrollIndex] as any).label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            
            <Group gap={1} justify="center">
              <LibIcon 
                icon="chevron-left" 
                style={{ fontSize: rem(14), color: theme.colors.dark[2] }} 
              />
              <Text
                c="dark.2"
                tt="uppercase"
                size={rem(14)}
              >
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon 
                icon="chevron-right" 
                style={{ fontSize: rem(14), color: theme.colors.dark[2] }} 
              />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group justify="space-between" w="100%">
            <Text>{item.label}</Text>
            <CustomCheckbox checked={checked} />
          </Group>
        ) : item.progress !== undefined ? (
          <Stack w="100%" gap={0} pr={5}>
            <Text 
              size="sm" 
              mb={3} 
              style={{ verticalAlign: 'middle' }}
            >
              {item.label}
            </Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'dark.0'}
              styles={{
                root: { backgroundColor: theme.colors.dark[3] }
              }}
            />
          </Stack>
        ) : (
          <Text>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);