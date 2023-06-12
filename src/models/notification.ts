import type { NotificationType } from '@/enums/notification';

export default interface Notification {
  id?: number;
  message: string;
  color: NotificationType;
}
