import React from 'react';
import { Button, Col, Row, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface IProps {
  onAddSLO: () => void;
}

const TopBar: React.FC<IProps> = (props) => {
  return (
    <Col>
      <Row>
        <Title style={{ fontSize: '26px', fontWeight: 400 }}>SLOs</Title>
        <div style={{ lineHeight: '30px', margin: '0 24px' }}>
          <Button
            type="ghost"
            icon={<PlusOutlined />}
            size="small"
            onClick={props.onAddSLO}
          />
        </div>
      </Row>
    </Col>
  );
};

export default TopBar;
