import { NotificationProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugCustomNotification = () => {
 debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'System Update',
        description: 'New firmware is available for your **Microchip** interface.',
        type: 'info',
        id: 'debug-1',
        duration: 5000,
        icon: 'microchip',
        iconAnimation: 'spin',
        style: {
          borderLeft: '4px solid #00b0c7',
        },
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Error',
        description: 'Notification description',
        type: 'error',
        position: "bottom"
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Custom icon success',
        description: 'Notification description',
        type: 'success',
        icon: 'microchip',
        showDuration: false,
      },
    },
  ]);
};
