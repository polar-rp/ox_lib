import { 
  ActionIcon, 
  Button, 
  Divider, 
  Drawer, 
  Stack, 
  Tooltip, 
  Text, 
  Group, 
  ScrollArea,
  rem 
} from '@mantine/core';
// DODAJ TEN IMPORT:
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { debugAlert } from './debug/alert';
import { debugContext } from './debug/context';
import { debugInput } from './debug/input';
import { debugMenu } from './debug/menu';
import { debugCustomNotification } from './debug/notification';
import { debugCircleProgressbar, debugProgressbar } from './debug/progress';
import { debugTextUI } from './debug/textui';
import { debugSkillCheck } from './debug/skillcheck';
import { useState } from 'react';
import { debugRadial } from './debug/radial';
import LibIcon from '../../components/LibIcon';

const Dev: React.FC = () => {
  const [opened, setOpened] = useState(false);

  const SectionTitle = ({ label, icon }: { label: string; icon: IconProp }) => (
    <Group gap={8} mb={5} mt={10}>
      <LibIcon icon={icon} fontSize={14} color="polarCyan.4" />
      <Text size="xs" fw={700} c="dimmed" tt="uppercase">
        {label}
      </Text>
    </Group>
  );

  return (
    <>
      <Tooltip label="Developer drawer" position="left" withArrow>
        <ActionIcon
          onClick={() => setOpened(true)}
          radius="xl"
          color="polarCyan"
          size={55}
          bottom={30}
          right={30}
          style={{ 
            position: 'absolute', 
            zIndex: 9999
          }}
        >
          <LibIcon icon={"wrench" as IconProp} fontSize={24} />
        </ActionIcon>
      </Tooltip>

      <Drawer 
        position="left" 
        onClose={() => setOpened(false)} 
        opened={opened} 
        title={<Text fw={700} size="lg" c="polarCyan">Polar Debug Menu</Text>}
        padding="md"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack gap="xs">
          <SectionTitle label="Dialogs" icon={"window-restore" as IconProp} />
          <Group grow>
            <Button variant="light" color="polarCyan" onClick={() => debugInput()} leftSection={<LibIcon icon={"keyboard" as IconProp} />}>
              Input
            </Button>
            <Button variant="light" color="polarCyan" onClick={() => debugAlert()} leftSection={<LibIcon icon={"circle-exclamation" as IconProp} />}>
              Alert
            </Button>
          </Group>

          <Divider my="sm" variant="dotted" />

          <SectionTitle label="Menus" icon={"bars" as IconProp} />
          <Button variant="light" color="polarCyan" fullWidth onClick={() => debugContext()} justify="flex-start" leftSection={<LibIcon icon={"mouse-pointer" as IconProp} />}>
            Context Menu
          </Button>
          <Button variant="light" color="polarCyan" fullWidth onClick={() => debugMenu()} justify="flex-start" leftSection={<LibIcon icon={"list" as IconProp} />}>
            List Menu
          </Button>
          <Button variant="light" color="polarCyan" fullWidth onClick={() => debugRadial()} justify="flex-start" leftSection={<LibIcon icon={"circle-dot" as IconProp} />}>
            Radial Menu
          </Button>

          <Divider my="sm" variant="dotted" />

          <SectionTitle label="Feedback" icon={"bell" as IconProp} />
          <Button variant="light" color="polarCyan" fullWidth onClick={() => debugCustomNotification()} leftSection={<LibIcon icon={"message" as IconProp} />}>
            Send Test Notification
          </Button>

          <Divider my="sm" variant="dotted" />

          <SectionTitle label="Progress & UI" icon={"spinner" as IconProp} />
          <Group grow>
            <Button variant="light" color="polarCyan" onClick={() => debugProgressbar()} size="xs">
              Linear Bar
            </Button>
            <Button variant="light" color="polarCyan" onClick={() => debugCircleProgressbar()} size="xs">
              Circle
            </Button>
          </Group>
          <Button variant="light" color="polarCyan" fullWidth onClick={() => debugTextUI()} mt={5} leftSection={<LibIcon icon={"font" as IconProp} />}>
            Toggle TextUI
          </Button>

          <Divider my="sm" variant="dotted" />

          <SectionTitle label="Mechanics" icon={"gamepad" as IconProp} />
          <Button 
            variant="filled" 
            color="polarCyan" 
            fullWidth 
            onClick={() => debugSkillCheck()}
            leftSection={<LibIcon icon={"stopwatch" as IconProp} />}
          >
            Run Skill Check
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default Dev;