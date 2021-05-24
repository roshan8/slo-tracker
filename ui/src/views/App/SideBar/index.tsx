import React from 'react';
import { Menu } from 'antd';

import { ISLO } from '../../../core/interfaces/ISLO';

import './sidebar.css';

interface IProps {
  SLOs: ISLO[];
  activeSLOId?: number;
}

const SideBar: React.FC<IProps> = ({ SLOs, activeSLOId }) => {
  return (
    <div>
      <Menu defaultSelectedKeys={[String(activeSLOId)]}>
        {SLOs.map((slo, i) => (
          <Menu.Item key={String(slo.id)}>{slo.slo_name}</Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default SideBar;
