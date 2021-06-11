import { Button, Col, Row, Tabs, Typography } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, AlertOutlined } from '@ant-design/icons';

import Loader from '../../../components/Loader';
import useGetSLIs from '../../../core/hooks/useGetSLIs';
import useGetSLO from '../../../core/hooks/useGetSLO';
import { ISLO } from '../../../core/interfaces/ISLO';
import Cards from './Cards';
import SLITable from './SLITable';
import ReportDrawer from './ReportDrawer';
import useCalculateSLIs from '../../../core/hooks/useCalculateSLIs';
import ConsumptionGraph from './ConsumptionGraph';
import ErrBudgetBar from './ErrBudgetBar'
import AlertSourcesModal from './AlertSources';

const { TabPane } = Tabs;

interface IProps {
  activeSLO: ISLO | null;
  SLOsLoading: boolean;
  onUpdateSLO: () => void;
}

const { Title } = Typography;

const SLO: React.FC<IProps> = ({ activeSLO, ...props }) => {
  const { SLIs, refreshSLIs } = useGetSLIs(activeSLO);
  const { SLO, refreshSLO } = useGetSLO(activeSLO);
  const {
    incidentSummary,
    errBudgetOverTime,
    past30Days,
    falsePositives,
  } = useCalculateSLIs(SLIs);

  const refreshSLOAndSLIs = (slo: boolean = true, slis: boolean = true) => {
    if (slo) refreshSLO();
    if (slis) refreshSLIs();
  };

  const [showReport, setShowReport] = useState(false);
  const closeReport = () => setShowReport(false);
  const openReport = () => setShowReport(true);

  const [alertSourceModal, setAlertSourceModal] = useState(false);
  const openAlertSourceModal = () => setAlertSourceModal(true);
  const closeAlertSourceModal = () => setAlertSourceModal(false);

  if (props.SLOsLoading) {
    return <Loader marginTop="calc(100vh /3)" />;
  }

  if (!SLO) {
    return (
      <div style={{ textAlign: 'center', margin: '150px 20px' }}>
        <p style={{ fontSize: 20, fontWeight: 500 }}>
          Get started by creating your first SLO!
        </p>
      </div>
    );
  }

  return (
    <Col style={{ padding: '40px 20px' }}>
      <Row justify="space-between">
        <Row>
          <Title style={{ fontSize: '24px' }}>{SLO.slo_name}</Title>
          <div style={{ lineHeight: '30px', margin: '0 24px' }}>
            <Button
              type="ghost"
              icon={<EditOutlined />}
              size="small"
              onClick={props.onUpdateSLO}
            />
          </div>
        </Row>
        <Row>
          <Button style={{ marginRight: 24 }} onClick={openAlertSourceModal}>
            <AlertOutlined />
            Alert Sources
          </Button>
          <Button type="primary" onClick={openReport}>
            Report Incident
          </Button>
        </Row>
      </Row>

      <Cards data={{ SLO, falsePositives, past30Days }} />

      {incidentSummary.length 
      ? 
        <Row className="SLO__cards_container">
          <Col className="SLO__cards_card">
            <ErrBudgetBar data={incidentSummary} sli={SLIs}/>
          </Col>
        </Row>
      : 
        <></>
      }
      

      <Tabs defaultActiveKey="table">
        <TabPane key="table" tab="Incidents">
          <SLITable SLIs={SLIs} refreshSLOAndSLIs={refreshSLOAndSLIs} />
        </TabPane>

        <TabPane key="consumption_over_time" tab="Error consumption over time">
          <ConsumptionGraph data={errBudgetOverTime} />
        </TabPane>
      </Tabs>

      <AlertSourcesModal
        show={alertSourceModal}
        close={closeAlertSourceModal}
        SLO={SLO}
      />

      <ReportDrawer
        show={showReport}
        onClose={closeReport}
        SLO={SLO}
        refreshSLOAndSLIs={refreshSLOAndSLIs}
      />
    </Col>
  );
};

export default SLO;
