import React, { useEffect, useState } from "react";
import "./app.css";
import {
  Statistic,
  Card,
  Row,
  Col,
  Form,
  Input,
  Drawer,
  Button,
  Table,
  Switch,
  InputNumber,
} from "antd";
import "antd/dist/antd.css";
import { ResponsivePie } from "@nivo/pie";
import data from "./data.json";

interface IIncidentList {
  id: number;
  sli_name: string;
  alertsource: string;
  state: string;
  created_at: Date;
  err_budget_spent: number;
  mark_false_positive: boolean;
}

// const formLayout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };
// const formTailLayout = {
//   wrapperCol: { offset: 8, span: 16 },
// };

function App() {
  const [isSLADrawerVisible, setIsSLADrawerVisible] = useState(false);
  const [isIncidentDrawerVisible, setIsIncidentDrawerVisible] = useState(false);
  const [incidentList, setInicidentList] = useState<IIncidentList[]>([]);

  const showSLADrawer = () => {
    setIsSLADrawerVisible(true);
  };

  const showIncidentDrawer = () => {
    setIsIncidentDrawerVisible(true);
  };

  const HandleSLAOk = () => {
    setIsSLADrawerVisible(false);
  };

  const createIncidentApi = async () => {
    try {
      const incidentCreationReq = await fetch(
        "http://localhost:8080/api/v1/incident/", {
          method: 'POST',
          body: JSON.stringify({
            sli_name: "test",
            alertsource: 'webUI',
          })
        }
      );
      // TODO: Add response code validation.
    } catch (err) {
      console.log(err);
    }
    setIsIncidentDrawerVisible(false);    
  };

  // function for switch
  function onChange(checked) {
    console.log(`switch to ${checked}`);
  }

  const SLAFormLayout = () => {
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };
  
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
      <Form
        // {...formLayout}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

        <Form.Item
          label="Product name"
          name="productname"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Target SLA"
          name="targetsla"
          rules={[{ required: true, message: 'This is required field' }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item 
          // {...formTailLayout}
        >
          <Button type="primary" htmlType="submit" onClick={HandleSLAOk}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const IncidentFormLayout = () => {

    const [form] = Form.useForm();

    // const onFinish = (values: any) => {
    //   console.log('Success:', values);
    // };

    const HandleIncidentOk = () => {
      console.log("HandleIncidentOk triggered");
    };

    const onFinish = (values: any) => {
      const createIncidentApi = async () => {
        try {

          console.log('Success:', values);

          const incidentCreationReq = await fetch(
            "http://localhost:8080/api/v1/incident/", {
              method: 'POST',
              body: JSON.stringify({
                sli_name: values["sliname"],
                alertsource: "webUI",
                err_budget_spent: values["errbudgetspent"],
                state: "closed",
              })
            }
          );
          // TODO: Add response code validation.
        } catch (err) {
          console.log(err);
        }
        setIsIncidentDrawerVisible(false);    
      };    
      createIncidentApi();
    };  
  
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
  
    return (
      <Form
        // {...formLayout}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

        <Form.Item
          label="SLI"
          name="sliname"
          rules={[{ required: true, message: 'This is required field' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Error budget spent(In mins)"
          name="errbudgetspent"
          rules={[{ required: true, message: "Please enter valid number" }]}
        >
          <InputNumber />
        </Form.Item>
  
        <Form.Item 
          // {...formTailLayout}
        >
          <Button type="primary" htmlType="submit" onClick={HandleIncidentOk}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const columns = [
    {
      title: "SLI",
      dataIndex: "sli_name",
      key: "sli_name",
    },
    {
      title: "Alertsource",
      dataIndex: "alertsource",
      key: "alertsource",
    },
    {
      title: "Created on",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Error budget spent",
      dataIndex: "err_budget_spent",
      key: "err_budget_spent",
    },
    {
      title: "Mark false positive",
      key: "action",
      render: () => <Switch onChange={onChange} />,
    },
  ];

  useEffect(
    () => {
      const apiCall = async () => {
        try {
          const incidentListResposne = await fetch(
            "http://localhost:8080/api/v1/incident/"
          );
          const { data: incidentList } = await incidentListResposne.json();
          setInicidentList(
            incidentList.map((i) => {
              i.key = i.id;
              return i;
            })
          );
        } catch (err) {
          console.log(err);
        }
      };
    
      apiCall();
    },
    [],
  )

  return (
    <div className="App">
      <div className="site-statistic-demo-card">
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Target SLA"
                value={99.99}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Your SLA"
                value={100}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                // prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Remaining error budget"
                value={52.5}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowDownOutlined />}
                suffix="min"
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Button type="primary" block onClick={showSLADrawer}>
            Update SLA Target
          </Button>
          <Drawer
            title="Modify target SLA"
            placement="right"
            visible={isSLADrawerVisible}
            onClose={HandleSLAOk}
            bodyStyle={{ paddingBottom: 80 }}
          >
              <SLAFormLayout />
          </Drawer>
        </Col>
        <Col span={12}>
          <Button type="primary" block onClick={showIncidentDrawer}>
            Report an incident
          </Button>
          <Drawer
            title="Report SLA voilating incident"
            placement="right"
            visible={isIncidentDrawerVisible}
            bodyStyle={{ paddingBottom: 80 }}
          >
              <IncidentFormLayout />
          </Drawer>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col flex={0.5}>
          <div style={{ height: "50em", width: "40em" }}>
            <ResponsivePie
              data={data}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: "nivo" }}
              borderWidth={1}
              borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
              radialLabelsSkipAngle={10}
              radialLabelsTextColor="#333333"
              radialLabelsLinkColor={{ from: "color" }}
              sliceLabelsSkipAngle={10}
              sliceLabelsTextColor="#333333"
              defs={[
                {
                  id: "dots",
                  type: "patternDots",
                  background: "inherit",
                  color: "rgba(255, 255, 255, 0.3)",
                  size: 4,
                  padding: 1,
                  stagger: true,
                },
                {
                  id: "lines",
                  type: "patternLines",
                  background: "inherit",
                  color: "rgba(255, 255, 255, 0.3)",
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10,
                },
              ]}
              fill={[
                {
                  match: {
                    id: "PushNotificationFailure",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "HighErrorRate",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "HighLatency",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "ThirdPartyOutage",
                  },
                  id: "dots",
                },
              ]}
              legends={[]}
            />
          </div>
        </Col>
        <Col flex={4.5}>
          <Table dataSource={incidentList} columns={columns} />
        </Col>
      </Row>
    </div>
    // <Grid type="column" height="100%" flexWidth={12}>
    //   {/* heading */}
    //   <Grid alignItems="center" justifyContent="space-between" flexWidth={12}>
    //     <Heading fontSize={24} height={35}>Your SLA Tracker!</Heading>
    //     <Grid alignItems="center">

    //       {/* need to understand the usage of following div tag */}
    //       <div style={{ marginLeft: 50, height: 24 }} className="header_select_box">

    //       </div>
    //     </Grid>
    //   </Grid>
    //   {/* body */}
    //   <Grid flexWidth={12} height="100%">

    //   </Grid>
    // </Grid>
  );
}

export default App;
