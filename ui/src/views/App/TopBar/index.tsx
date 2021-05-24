import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const TopBar = () => {
  return (
    <div>
      <Title style={{ fontSize: '26px' }}>SLOs</Title>
    </div>
  );
};

export default TopBar;
