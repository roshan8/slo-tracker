import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import Copyable from '../../../../components/Copyable';
import { IAlertSource } from '../../../../core/interfaces/IAlertSource';
import { ISLO } from '../../../../core/interfaces/ISLO';
import { API } from '../../../../core/services';
import alertSources from './alertSources';

import './alertSources.css';

interface IProps {
  SLO: ISLO;
  show: boolean;
  close: () => void;
}

const AlertSourcesModal: React.FC<IProps> = ({ show, close, SLO }) => {
  const [activeAlert, setActiveAlert] = useState<IAlertSource>(alertSources[0]);

  return (
    <Modal
      visible={show}
      onCancel={close}
      onOk={close}
      okText="Done"
      cancelButtonProps={{ style: { display: 'none' } }}
      width={700}
    >
      <div>
        <h1>{SLO.slo_name}</h1>
        <div className="alert_sources_modal__container">
          <div className="alert_sources_modal__listing">
            {alertSources.map((alertSource) => (
              <Button
                type="text"
                style={{
                  textAlign: 'left',
                  fontWeight: 500,
                }}
                onClick={() => setActiveAlert(alertSource)}
              >
                {alertSource.name}
              </Button>
            ))}
          </div>
          <div className="alert_sources_modal__copy_column">
            <h2>{activeAlert.name} Webhook URL</h2>
            <Copyable
              content={`${API}/v1/incident/${SLO.id}/${activeAlert.id}`}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AlertSourcesModal;
