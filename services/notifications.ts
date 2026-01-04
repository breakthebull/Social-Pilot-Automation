
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendNotification = (title: string, body: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670124.png'
  });
};
