import React from "react";
import ReactDOM from 'react-dom';
import "./app.css";
import App from './App';
import {
  Form,
  Input,
  Button,
  message,
  notification,
  Row,
  Col,
} from "antd";
import "antd/dist/antd.css";
import Password from "antd/lib/input/Password";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const openNotificationWithIcon = (type, message) => {
  notification[type]({
    description: message,
  });
};

function LoginApp() {

  const onFinish = (values: any) => {

    let isAuthenticated = 0
    
    // When creds passed through env
    if (process.env.USERNAME) {
      if (values["username"] == process.env.USERNAME && values["password"] == process.env.PASSWORD) {
        isAuthenticated = 1
      }
    }

    // When user details haven't passed through env, then use defaults
    if (values["username"] == "admin" && values["password"] == "admin") {
      isAuthenticated = 1 
    }

    if (isAuthenticated == 1) {
      localStorage.setItem('IsAuthenticated', "yes");
      openNotificationWithIcon('success', 'Logged in!')    
      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById('root')
      );
    }
    else {
      localStorage.setItem('IsAuthenticated', "no");
      openNotificationWithIcon('error', 'Please check your username/password')  
    }

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="center">
    <Form
      name="basic" 
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
             Submit
          </Button>
        </Form.Item>
    </Form>

    </div>
  );
};



export default LoginApp;
