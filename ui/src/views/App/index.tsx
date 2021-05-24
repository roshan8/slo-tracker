import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';

import TopBar from './TopBar';
import SideBar from './SideBar';

import useGetSLOs from '../../core/hooks/useGetSLOs';

import './app.css';
import Loader from '../../components/Loader';
import { ISLO } from '../../core/interfaces/ISLO';

const { Header, Content, Sider } = Layout;

const AppView: React.FC = () => {
  const { loading, error, SLOs } = useGetSLOs();
  const [activeSLO, setActiveSLO] = useState<ISLO | null>(null);

  useEffect(() => {
    if (SLOs.length) setActiveSLO(SLOs[0]);
  }, [SLOs]);

  const renderSideBar = () => {
    if (loading && !error) return <Loader marginTop="150px" />;
    else if (!loading && error)
      return <p style={{ textAlign: 'center' }}>{error}</p>;
    else if (!SLOs.length)
      return (
        <p style={{ textAlign: 'center' }}>
          You have no SLOs. Create one to continue
        </p>
      );
    else return <SideBar SLOs={SLOs} activeSLOId={activeSLO?.id} />;
  };

  return (
    <Layout className="app__layout">
      <Header className="app__layout_header app__layout-light_background">
        <TopBar />
      </Header>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          className="app__layout-light_background"
        >
          {renderSideBar()}
        </Sider>
        <Content>Content</Content>
      </Layout>
    </Layout>
  );
};

export default AppView;
