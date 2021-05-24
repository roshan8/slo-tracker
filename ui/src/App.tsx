import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { blue } from '@ant-design/colors';
import { Spin } from 'antd';

import LoginApp from './views/Login';
import AppView from './views/App';

import 'antd/dist/antd.css';

const LoadingIcon = (
  <LoadingOutlined
    style={{ fontSize: 36, fontWeight: 500, color: blue.primary }}
    spin
  />
);

const authLocalKey = 'isAuthenticated';

const asyncStorage = window.localStorage;

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const isAuth = await asyncStorage.getItem(authLocalKey);
        setIsAuthenticated(isAuth === 'true');
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const authenticateUser = (auth: boolean) => {
    if (auth) {
      asyncStorage.setItem(authLocalKey, 'true');
      setIsAuthenticated(true);
    } else {
      asyncStorage.setItem(authLocalKey, 'false');
      setIsAuthenticated(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: 'calc(100vh /2)',
        }}
      >
        <Spin indicator={LoadingIcon} />
      </div>
    );

  if (isAuthenticated) return <AppView />;

  return <LoginApp authenticateUser={authenticateUser} />;
};

export default App;
