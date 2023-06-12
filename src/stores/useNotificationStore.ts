import { defineStore } from 'pinia';
import type Notification from '../models/notification';
import { computed, ref } from 'vue';

interface NotificationState {
  notifications: Notification[];
}

export const useNotificationStore = defineStore('notification', () => {
  const state = ref({ notifications: [] } as NotificationState);

  const notifications = computed<Notification[]>(() => {
    return state.value.notifications;
  });

  function pushNotification(notification: Notification) {
    notification.id = Math.floor(Math.random() * 100000);
    state.value.notifications.push(notification);
  }

  function removeNotification(id: number) {
    const removePosition = state.value.notifications.map((item) => item.id).indexOf(id);
    state.value.notifications.splice(removePosition, 1);
  }

  return {
    notifications,
    removeNotification,
    pushNotification
  };
});
