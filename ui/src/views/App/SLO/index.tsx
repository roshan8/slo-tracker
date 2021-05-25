import { Button, Col, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';

import Loader from '../../../components/Loader';
import useGetSLIs from '../../../core/hooks/useGetSLIs';
import useGetSLO from '../../../core/hooks/useGetSLO';
import { ISLO } from '../../../core/interfaces/ISLO';
import Cards from './Cards';
import SLITable from './SLITable';
import ReportDrawer from './ReportDrawer';

interface IProps {
  activeSLO: ISLO | null;
  SLOsLoading: boolean;
  onUpdateSLO: () => void;
}

const { Title } = Typography;

const SLO: React.FC<IProps> = ({ activeSLO, ...props }) => {
  const { SLIs, refreshSLIs } = useGetSLIs(activeSLO);
  const { SLO, refreshSLO } = useGetSLO(activeSLO);

  const refreshSLOAndSLIs = (slo: boolean = true, slis: boolean = true) => {
    if (slo) refreshSLO();
    if (slis) refreshSLIs();
  };

  const [showReport, setShowReport] = useState(false);
  const closeReport = () => setShowReport(false);
  const openReport = () => setShowReport(true);

  if (props.SLOsLoading) {
    return <Loader marginTop="calc(100vh /3)" />;
  }

  if (!SLO) {
    return (
      <div style={{ textAlign: 'center', margin: '150px 20px' }}>
        <p style={{ fontSize: 20, fontWeight: 500 }}>
          Please select a SLO to get your SLIs
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
        <Button type="primary" onClick={openReport}>
          Report Incident
        </Button>
      </Row>

      <Cards SLO={SLO} />
      <SLITable SLIs={SLIs} refreshSLOAndSLIs={refreshSLOAndSLIs} />
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
