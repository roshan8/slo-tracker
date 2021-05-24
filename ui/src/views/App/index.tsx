import React from 'react';
import { Layout } from 'antd';

import TopBar from './TopBar';
import SideBar from './SideBar';

import useGetSLOs from '../../core/hooks/useGetSLOs';

import './app.css';

const { Header, Content, Sider } = Layout;

const AppView = () => {
  const { loading, error, SLOs } = useGetSLOs();

  console.log('slos!!!!!!!', SLOs, loading, error);

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
          <SideBar />
        </Sider>
        <Content>Content</Content>
      </Layout>
    </Layout>
  );
};

export default AppView;
