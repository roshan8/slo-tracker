import React from 'react';
import { Button, Form, Input } from 'antd';
import SLOService from '../../../core/services/service.slo';
import openNotification from '../../../core/helpers/notification';

interface IProps {
  refreshSLOs: () => void;
  closeDrawer: () => void;
}

const CreateSLO: React.FC<IProps> = (props) => {
  const _sloService = new SLOService();
  const [form] = Form.useForm();

  const onSubmit = async (values: any) => {
    const slo_name = values['slo_name'];
    const target_slo = parseFloat(values['target_slo']);

    if (target_slo < 1 || target_slo > 100) {
      openNotification('error', 'Target SLO should be between 1 to 100.');
      return;
    }

    try {
      await _sloService.create({
        slo_name,
        target_slo,
      });
      props.refreshSLOs();
      openNotification('success', 'Successfully created SLO');
      props.closeDrawer();
      form.resetFields();
    } catch (err) {
      openNotification('error', 'Error while creating SLO. Please try again.');
    }
  };

  return (
    <Form layout="vertical" onFinish={onSubmit} form={form}>
      <Form.Item
        label="SLO Name"
        name="slo_name"
        rules={[{ required: true, message: 'Please give your SLO a name!' }]}
      >
        <Input placeholder="Eg: Checkout Flow" />
      </Form.Item>

      <Form.Item
        label="Target SLO in %"
        name="target_slo"
        rules={[{ required: true, message: 'Please provide a target SLO' }]}
      >
        <Input placeholder="Eg: 99.999" />
      </Form.Item>

      <Form.Item>
        <Button style={{ float: 'right' }} type="primary" htmlType="submit">
          Create SLO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateSLO;
