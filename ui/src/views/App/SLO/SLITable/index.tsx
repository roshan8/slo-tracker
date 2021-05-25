import { Switch, Table, notification } from 'antd';
import React from 'react';
import { IIncident } from '../../../../core/interfaces/IIncident';
import IncidentService from '../../../../core/services/service.incident';

interface IProps {
  SLIs: IIncident[];
  refreshSLO: () => void;
  refreshSLIs: () => void;
}

const openNotification = (type, message) => {
  notification[type]({
    description: message,
  });
};

const tableColumns = (
  onMarkPositive: (state: boolean, sli: IIncident) => void
) => [
  {
    title: 'SLI',
    dataIndex: 'sli_name',
    key: 'sli_name',
  },
  {
    title: 'Status',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: 'Alert Source',
    dataIndex: 'alertsource',
    key: 'alertsource',
  },
  {
    title: 'Created on',
    key: 'created_at',
    render: (e: IIncident) => {
      const date = new Date(e.created_at);
      return <p>{date.toLocaleString()}</p>;
    },
  },
  {
    title: 'Error budget spent(min)',
    dataIndex: 'err_budget_spent',
    key: 'err_budget_spent',
  },
  {
    title: 'Mark false positive',
    key: 'action',
    render: (sli: IIncident) => (
      <Switch
        onChange={(state: boolean) => onMarkPositive(state, sli)}
        defaultChecked={sli.mark_false_positive}
      />
    ),
  },
];

const SLITable: React.FC<IProps> = ({ SLIs, ...props }) => {
  const tableData = SLIs.map((i) => ({
    key: i.id,
    ...i,
  }));

  const onMarkPositive = async (state: boolean, sli: IIncident) => {
    const _incidentService = new IncidentService(sli.slo_name);

    try {
      await _incidentService.update(sli.id, {
        mark_false_positive: state,
        state: sli.state,
        err_budget_spent: sli.err_budget_spent,
      });
      props.refreshSLO();
      props.refreshSLIs();
      openNotification('success', 'Incident updated successfully');
    } catch (err) {
      console.log(err);
      openNotification('error', 'Error while updating incident');
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <Table dataSource={tableData} columns={tableColumns(onMarkPositive)} />
    </div>
  );
};

export default SLITable;
