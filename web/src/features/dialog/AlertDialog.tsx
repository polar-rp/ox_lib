import { Button, Group, Modal, Stack } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <Modal
      opened={opened}
      centered={dialogData.centered}
      size={dialogData.size || 'md'}
      closeOnClickOutside={false}
      onClose={() => {
        setOpened(false);
        closeAlert('cancel');
      }}
      withCloseButton={false}
      transitionProps={{ duration: 150, transition: 'fade' }}
      title={<ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>}
    >
      <Stack c="dark.2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            ...MarkdownComponents,
            img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
          }}
        >
          {dialogData.content}
        </ReactMarkdown>

        <Group justify="flex-end" gap={10}>
          {dialogData.cancel && (
            <Button  variant="default" onClick={() => closeAlert('cancel')} mr={3}>
              {dialogData.labels?.cancel || locale.ui.cancel}
            </Button>
          )}
          <Button
            variant={dialogData.cancel ? 'light' : 'default'}
            color={dialogData.cancel ? undefined : undefined}
            onClick={() => closeAlert('confirm')}
          >
            {dialogData.labels?.confirm || locale.ui.confirm}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AlertDialog;