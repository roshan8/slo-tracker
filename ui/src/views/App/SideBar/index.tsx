import React from 'react';
import { Menu } from 'antd';

import { ISLO } from '../../../core/interfaces/ISLO';

import './sidebar.css';
import Overview from '../Overview/Overview';
// import PoweredBy from './poweredBy';

interface IProps {
  SLOs: ISLO[];
  activeSLOId?: number;
  setActiveSlo: (slo: ISLO) => void;
}

const SideBar: React.FC<IProps> = ({ SLOs, activeSLOId, ...props }) => {
  const onSLOSelect = (value: any) => {
    const SLOId = parseInt(value.key);
    const selectedSLO = SLOs.filter((s) => s.id === SLOId);

    if (selectedSLO.length) props.setActiveSlo(selectedSLO[0]);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Menu defaultSelectedKeys={[String(activeSLOId)]} onClick={onSLOSelect}>
        {SLOs.map((slo) => (
          <Menu.Item key={String(slo.id)}>{slo.slo_name}</Menu.Item>
        ))}
      </Menu>
      <Overview />
      {/* <PoweredBy /> */}
    </div>
  );
};

export default SideBar;
