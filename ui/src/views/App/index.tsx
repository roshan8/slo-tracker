import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';

import TopBar from './TopBar';
import SideBar from './SideBar';

import useGetAllSLOs from '../../core/hooks/useGetAllSLOs';

import './app.css';
import Loader from '../../components/Loader';
import { ISLO } from '../../core/interfaces/ISLO';
import SLODrawer from './Drawer';
import SLO from './SLO';

const { Header, Content, Sider } = Layout;

const AppView: React.FC = () => {
  const { loading, error, SLOs, refreshSLOs } = useGetAllSLOs();
  const [activeSLO, setActiveSLO] = useState<ISLO | null>(null);
  const [sloDrawer, setSLODrawer] = useState<{
    type: 'create' | 'update';
    show: boolean;
  }>({ type: 'create', show: false });

  const closeSLODrawer = () => setSLODrawer({ ...sloDrawer, show: false });
  const openSLODrawer = (type: 'create' | 'update') => () =>
    setSLODrawer({ type, show: true });

  useEffect(() => {
    if (!activeSLO && SLOs.length) setActiveSLO(SLOs[0]);

    if (!activeSLO) return;

    // Update active SLO when slos change
    const activeSLOsArray = SLOs.filter((s) => s.id === activeSLO.id);
    const newActiveSLO = activeSLOsArray[0];

    if (newActiveSLO && activeSLO.id === newActiveSLO.id) {
      if (
        activeSLO.slo_name !== newActiveSLO.slo_name ||
        activeSLO.target_slo !== newActiveSLO.target_slo
      )
        setActiveSLO(newActiveSLO);
    }
  }, [SLOs, activeSLO]);

  const renderSideBar = () => {
    if (loading && !error) return <Loader marginTop="150px" />;
    else if (!loading && error)
      return (
        <p style={{ textAlign: 'center', margin: '30px 10px' }}>{error}</p>
      );
    else if (!SLOs.length)
      return (
        <p style={{ textAlign: 'center', margin: '30px 10px' }}>
          You have no SLOs. Create one to continue
        </p>
      );
    else
      return (
        <SideBar
          SLOs={SLOs}
          activeSLOId={activeSLO?.id}
          setActiveSlo={setActiveSLO}
        />
      );
  };

  return (
    <Layout className="app__layout">
      <Header className="app__layout_header app__layout-light_background">
        <TopBar onAddSLO={openSLODrawer('create')} />
      </Header>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          className="app__layout-light_background"
        >
          {renderSideBar()}
        </Sider>
        <Content>
          <SLO
            activeSLO={activeSLO}
            SLOsLoading={loading}
            onUpdateSLO={openSLODrawer('update')}
          />
        </Content>
      </Layout>
      <SLODrawer
        type={sloDrawer.type}
        show={sloDrawer.show}
        activeSLO={activeSLO}
        onClose={closeSLODrawer}
        refreshSLOs={refreshSLOs}
      />
    </Layout>
  );
};

export default AppView;
