import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import SLOService from '../../../core/services/service.slo';
import { ISLO } from '../../../core/interfaces/ISLO';

interface IProps {
  refreshSLOs: () => void;
  closeDrawer: () => void;
  activeSLO: ISLO | null;
}

const openNotification = (type, message) => {
  notification[type]({
    description: message,
  });
};

const UpdateSLO: React.FC<IProps> = (props) => {
  const _sloService = new SLOService();
  const [form] = Form.useForm();

  const initialValues = props.activeSLO
    ? {
        slo_name: props.activeSLO.slo_name,
        target_slo: props.activeSLO.target_slo,
      }
    : {};

  useEffect(() => form.resetFields(), [form, props.activeSLO]);

  const onSubmit = async (values: any) => {
    if (!props.activeSLO) return;

    const slo_name = values['slo_name'];
    const target_slo = parseFloat(values['target_slo']);

    try {
      await _sloService.update(props.activeSLO.slo_name, {
        slo_name,
        target_slo,
      });
      props.refreshSLOs();
      openNotification('success', 'Successfully updated SLO');
      props.closeDrawer();
      form.resetFields();
    } catch (err) {
      openNotification('error', 'Error while updating SLO. Please try again.');
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onSubmit}
      form={form}
      initialValues={initialValues}
    >
      <Form.Item
        label="Product Name"
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
          Update SLO
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateSLO;
