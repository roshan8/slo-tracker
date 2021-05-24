import { Drawer } from 'antd';
import React from 'react';
import CreateSLO from './create';

interface IProps {
  type: 'create' | 'update';
  show: boolean;
  onClose: () => void;
  refreshSLOs: () => void;
}

const SLODrawer: React.FC<IProps> = ({ type, show, ...props }) => {
  const title = type === 'create' ? 'Create a new SLO' : 'Update SLO';

  return (
    <Drawer title={title} visible={show} onClose={props.onClose} width={400}>
      {type === 'create' && (
        <CreateSLO
          refreshSLOs={props.refreshSLOs}
          closeDrawer={props.onClose}
        />
      )}
    </Drawer>
  );
};

export default SLODrawer;
