import React, { useEffect } from 'react';
import { Button, Form, Input, Checkbox, Row, Popconfirm } from 'antd';
import SLOService from '../../../core/services/service.slo';
import { ISLO } from '../../../core/interfaces/ISLO';
import openNotification from '../../../core/helpers/notification';

interface IProps {
  refreshSLOs: () => void;
  closeDrawer: () => void;
  activeSLO: ISLO | null;
}

const UpdateSLO: React.FC<IProps> = (props) => {
  const _sloService = new SLOService();
  const [form] = Form.useForm();
  let isChecked;

  const initialValues = props.activeSLO
    ? {
        slo_name: props.activeSLO.slo_name,
        target_slo: props.activeSLO.target_slo,
      }
    : {};

  useEffect(() => form.resetFields(), [form, props.activeSLO]);

  function onChange(e) {
    isChecked = e.target.checked;
  }

  const onSubmit = async (values: any) => {
    if (!props.activeSLO) return;

    const slo_name = values['slo_name'];
    const target_slo = parseFloat(values['target_slo']);

    if (target_slo < 1 || target_slo > 100) {
      openNotification('error', 'Target SLO should be between 1 to 100.');
      return;
    }

    try {
      await _sloService.update(
        props.activeSLO.id,
        {
          slo_name,
          target_slo,
        },
        isChecked
      );
      props.refreshSLOs();
      openNotification('success', 'Successfully updated SLO');
      props.closeDrawer();
      form.resetFields();
    } catch (err) {
      openNotification('error', 'Error while updating SLO. Please try again.');
    }
  };

  const onConfirmDelete = async () => {
    if (!props.activeSLO) return;

    try {
      await _sloService.delete(props.activeSLO.id);

      props.refreshSLOs();
      openNotification('success', 'Successfully Deleted SLO');
      props.closeDrawer();
      form.resetFields();
    } catch (err) {
      console.log(err);
      openNotification('error', 'Error while deleting SLO. Please try again.');
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

      <Form.Item name="reset_slo">
        <Checkbox onChange={onChange}>Reset complete Error-budget</Checkbox>
      </Form.Item>

      <Form.Item>
        <Row style={{ justifyContent: 'space-between' }}>
          <Button type="primary" htmlType="submit">
            Update SLO
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this SLO?"
            okText="Yes. Delete SLO"
            placement="topRight"
            onConfirm={onConfirmDelete}
          >
            <Button danger>Delete SLO</Button>
          </Popconfirm>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default UpdateSLO;
