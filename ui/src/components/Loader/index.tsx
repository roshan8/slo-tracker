import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { blue } from '@ant-design/colors';

interface IProps {
  marginTop: string;
}

const LoadingIcon = (
  <LoadingOutlined
    style={{ fontSize: 36, fontWeight: 500, color: blue.primary }}
    spin
  />
);

const Loader: React.FC<IProps> = ({ marginTop }) => (
  <div
    style={{
      marginTop,
      textAlign: 'center',
    }}
  >
    <Spin indicator={LoadingIcon} />
  </div>
);

export default Loader;
