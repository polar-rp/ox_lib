import { ToastPosition } from 'react-hot-toast';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react'; 
import { IconAnimation } from '../components/LibIcon';

export interface NotificationProps {
  style?: React.CSSProperties;
  description?: string;
  title?: string;
  duration?: number;
  showDuration?: boolean;
  icon?: IconProp | string;
  iconColor?: string;
  iconAnimation?: IconAnimation;
  position?: ToastPosition | 'top' | 'bottom';
  id?: number | string;
  type?: 'error' | 'success' | 'warning' | 'info' | string;
  alignIcon?: 'top' | 'center';
  itemImage?: string;
}