import React, { useEffect, useState } from 'react';

import LoginApp from './views/Login';
import AppView from './views/App';

import 'antd/dist/antd.css';
import Loader from './components/Loader';

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

  if (loading) return <Loader marginTop="calc(100vh / 2)" />;

  if (isAuthenticated) return <AppView />;

  return <LoginApp authenticateUser={authenticateUser} />;
};

export default App;
