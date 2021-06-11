import React from 'react';
import { Form, Input, Button, Typography } from 'antd';

import './login.css';
import openNotification from '../../core/helpers/notification';

const { Title } = Typography;
interface IProps {
  authenticateUser: (auth: boolean) => void;
}

const LoginApp: React.FC<IProps> = (props) => {
  const onFormSubmit = (values: any) => {
    const envUsername = process.env.USERNAME;
    const envPassword = process.env.PASSWORD;

    let isAuthenticated = false;

    if (envUsername && envPassword) {
      if (
        values['username'] === envUsername &&
        values['password'] === envPassword
      ) {
        isAuthenticated = true;
      }
    } else {
      if (values['username'] === 'admin' && values['password'] === 'admin') {
        isAuthenticated = true;
      }
    }

    if (isAuthenticated) {
      openNotification('success', 'Successfully Logged in!');
      props.authenticateUser(true);
    } else {
      openNotification('error', 'Please check your username / password');
      props.authenticateUser(false);
    }
  };

  return (
    <div className="login__container">
      <Title>SLO Tracker</Title>

      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFormSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
          style={{ marginBottom: '36px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          style={{ marginBottom: '42px' }}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button style={{ float: 'right' }} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginApp;
