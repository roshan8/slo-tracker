import React from 'react';
import { Button, Drawer, Form, Input } from 'antd';
import IncidentService from '../../../../core/services/service.incident';
import { ISLO } from '../../../../core/interfaces/ISLO';
import openNotification from '../../../../core/helpers/notification';

interface IProps {
  SLO: ISLO;
  show: boolean;
  onClose: () => void;
  refreshSLOAndSLIs: (slo?: boolean, slis?: boolean) => void;
}

const ReportDrawer: React.FC<IProps> = ({ show, onClose, ...props }) => {
  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    const sli_name = values['sli_name'];
    const err_budget_spent = parseFloat(values['err_budget']);

    const _incidentService = new IncidentService(props.SLO.id);

    try {
      await _incidentService.create({
        sli_name,
        err_budget_spent,
        alertsource: 'webUI',
        state: 'closed',
      });
      props.refreshSLOAndSLIs();
      openNotification('success', 'Report Successfully Reported');
      form.resetFields();
      onClose();
    } catch (err) {
      console.log(err);
      openNotification(
        'error',
        'Error while creating report. Please try again'
      );
    }
  };

  return (
    <Drawer
      visible={show}
      onClose={onClose}
      title="Report new Incident"
      width={400}
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <Form.Item
          label="SLI"
          name="sli_name"
          rules={[{ required: true, message: 'Please give your SLI a name!' }]}
        >
          <Input placeholder="Eg: High Latency" />
        </Form.Item>

        <Form.Item
          label="Error Budget Spent (in mins)"
          name="err_budget"
          rules={[{ required: true, message: 'Please provide Error Budget' }]}
        >
          <Input placeholder="Eg: 12" />
        </Form.Item>

        <Form.Item>
          <Button style={{ float: 'right' }} type="primary" htmlType="submit">
            Report Incident
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ReportDrawer;
