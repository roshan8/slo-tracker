import { Button, Input, Modal } from 'antd';
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
  const [searchQuery, setSearchQuery] = useState('');

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

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
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={onSearch}
              style={{
                margin: '12px',
                width: '168px',
              }}
              autoFocus
            />
            {alertSources
              .filter((al) =>
                al.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((alertSource) => (
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
              content={`${API}/api/v1/incident/${SLO.id}/webhook/${activeAlert.id}`}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AlertSourcesModal;
