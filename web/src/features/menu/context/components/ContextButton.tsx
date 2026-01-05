import React from 'react';
import { Button, Group, HoverCard, Image, Progress, Stack, Text, useMantineTheme, rem } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const theme = useMantineTheme();

  const isReadOnly = button.readOnly;
  const isDisabled = button.disabled;

  return (
    <HoverCard
      position="right-start"
      disabled={isDisabled || !(button.metadata || button.image)}
      openDelay={200}
      shadow="md"
    >
      <HoverCard.Target>
        <Button
          variant="default"
          disabled={isDisabled}
          onClick={() =>
            !isDisabled && !isReadOnly
              ? button.menu
                ? openMenu(button.menu)
                : clickContext(buttonKey)
              : null
          }
          // Zaawansowane stylowanie v8
          styles={{
            root: {
              height: 'fit-content',
              width: '100%',
              padding: rem(10),
              // Obsługa stanów hover/active dla readOnly
              '&:hover': {
                backgroundColor: isReadOnly ? theme.colors.dark[6] : undefined,
                cursor: isReadOnly ? 'unset' : 'pointer',
              },
              '&:active': {
                transform: isReadOnly ? 'none' : undefined,
              },
            },
            inner: {
              justifyContent: 'flex-start',
            },
            label: {
              width: '100%',
              color: isDisabled ? theme.colors.dark[3] : theme.colors.dark[0],
              whiteSpace: 'pre-wrap',
            },
          }}
        >
          <Group justify="space-between" w="100%" wrap="nowrap" gap={4}>
            <Stack gap={4} style={{ flex: 1 }}>
              {(button.title || Number.isNaN(+buttonKey)) && (
                <Group wrap="nowrap" gap={4}>
                  {button?.icon && (
                    <Stack 
                      align="center" 
                      justify="center" 
                      style={{ width: rem(25), height: rem(25) }}
                    >
                      {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                        <img 
                          src={button.icon} 
                          style={{ maxWidth: rem(25) }} 
                          alt="Icon" 
                        />
                      ) : (
                        <LibIcon
                          icon={button.icon as IconProp}
                          fixedWidth
                          size="lg"
                          style={{ color: button.iconColor }}
                          // @ts-ignore - jeśli LibIcon wspiera animacje z v5
                          animation={button.iconAnimation}
                        />
                      )}
                    </Stack>
                  )}
                  <Text style={{ overflowWrap: 'break-word' }}>
                    <ReactMarkdown components={MarkdownComponents}>
                      {button.title || buttonKey}
                    </ReactMarkdown>
                  </Text>
                </Group>
              )}

              {button.description && (
                <Text 
                  size="xs" 
                  c={isDisabled ? 'dark.3' : 'dark.2'}
                >
                  <ReactMarkdown components={MarkdownComponents}>
                    {button.description}
                  </ReactMarkdown>
                </Text>
              )}

              {button.progress !== undefined && (
                <Progress 
                  value={button.progress} 
                  size="sm" 
                  color={button.colorScheme || 'dark.3'} 
                />
              )}
            </Stack>

            {(button.menu || button.arrow) && button.arrow !== false && (
              <Stack 
                align="center" 
                justify="center" 
                style={{ width: rem(25), height: rem(25) }}
              >
                <LibIcon icon="chevron-right" fixedWidth />
              </Stack>
            )}
          </Group>
        </Button>
      </HoverCard.Target>

      <HoverCard.Dropdown
        style={{
          padding: rem(10),
          color: theme.colors.dark[0],
          maxWidth: rem(256),
          width: 'fit-content',
          border: 'none',
        }}
      >
        {button.image && <Image src={button.image} radius="sm" />}
        
        <Stack gap={4} mt={button.image ? 8 : 0}>
          {Array.isArray(button.metadata) ? (
            button.metadata.map((metadata, index) => {
              const isString = typeof metadata === 'string';
              return (
                <React.Fragment key={`meta-${index}`}>
                  <Text size="sm">
                    {isString ? metadata : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {!isString && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'dark.3'}
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            typeof button.metadata === 'object' &&
            Object.entries(button.metadata).map(([key, value], index) => (
              <Text size="sm" key={`meta-obj-${index}`}>
                {key}: {String(value)}
              </Text>
            ))
          )}
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default ContextButton;