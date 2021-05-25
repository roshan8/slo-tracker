import { Button, Col, Row, Typography } from 'antd';
import React from 'react';
import { EditOutlined } from '@ant-design/icons';

import Loader from '../../../components/Loader';
import useGetSLIs from '../../../core/hooks/useGetSLIs';
import useGetSLO from '../../../core/hooks/useGetSLO';
import { ISLO } from '../../../core/interfaces/ISLO';

interface IProps {
  activeSLO: ISLO | null;
  SLOsLoading: boolean;
  onUpdateSLO: () => void;
}

const { Title } = Typography;

const SLO: React.FC<IProps> = ({ activeSLO, ...props }) => {
  const { SLIs, SLILoading, SLIError } = useGetSLIs(activeSLO);
  const { SLO, SLOLoading, SLOError } = useGetSLO(activeSLO);

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
        <Button type="primary">Report Incident</Button>
      </Row>
    </Col>
  );
};

export default SLO;
