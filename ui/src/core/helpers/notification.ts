import { notification } from 'antd';

const openNotification = (type: 'success' | 'error', message: string) => {
  notification[type]({
    message,
  });
};

export default openNotification;
