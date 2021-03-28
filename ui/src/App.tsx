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

interface ISLAList {
  id: number;
  product_name: string;
  target_sla: number;
  current_sla: number;
  remaining_err_budget: number;
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
  const [currentSLA, setCurrentSLA] = useState(100);
  const [targetSLA, setTargetSLA] = useState(100);
  const [remainingErrBudget, setRemainingErrBudget] = useState(0);

  var API_URL = "localhost"
  if(process.env.API_URL) { 
    API_URL = process.env.API_URL;
  }

  const showSLADrawer = () => {
    setIsSLADrawerVisible(true);
  };

  const showIncidentDrawer = () => {
    setIsIncidentDrawerVisible(true);
  };

  const HandleSLAOk = () => {
    setIsSLADrawerVisible(false);
  };

  const HandleIncidentOk = () => {
    setIsIncidentDrawerVisible(false);    
  };

  // function for switch
  function onChange(checked) {
    console.log(`switch to ${checked}`);
  }

  const SLAFormLayout = () => {

    const onFinish = (values: any) => {
      const createSLAApi = async () => {
        try {

          console.log('Success:', values);

          const slaCreationReq = await fetch(
            `http://${API_URL}:8080/api/v1/sla/1`, {
              method: 'PATCH',
              body: JSON.stringify({
                product_name: values["productname"],
                target_sla: values["targetsla"],
              })
            }
          );
          // TODO: Add response code validation.
        } catch (err) {
          console.log(err);
        }
        setIsSLADrawerVisible(false);    
      };    
      createSLAApi();
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
          <InputNumber />
        </Form.Item>
  
        <Form.Item 
          // {...formTailLayout}
        >
          <Button type="primary" htmlType="submit" onClick={onFinish}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const IncidentFormLayout = () => {

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
      const createIncidentApi = async () => {
        try {

          console.log('Success:', values);

          const incidentCreationReq = await fetch(
            `http://${API_URL}:8080/api/v1/incident/`, {
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
          <Button type="primary" htmlType="submit" onClick={onFinish}>
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
      title: "Status",
      dataIndex: "state",
      key: "state",
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
      title: "Error budget spent(min)",
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
      const getIncidentApiCall = async () => {
        try {
          const incidentListResponse = await fetch(
            `http://${API_URL}:8080/api/v1/incident/`
          );
          const { data: incidentList } = await incidentListResponse.json();
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
    
      const getSLAApiCall = async () => {
        try {
          const SLAListResponse = await fetch(
            `http://${API_URL}:8080/api/v1/sla/1`
          )
          .then(response => response.json())
          .then(response => {
            console.log(response.data.product_name)
            setCurrentSLA(response.data.current_sla)
            setTargetSLA(response.data.target_sla)
            setRemainingErrBudget(response.data.remaining_err_budget)
          })
          .catch(err => { console.log(err); 
          });

        } catch (err) {
          console.log(err);
        }
      };

      getIncidentApiCall();
      getSLAApiCall();

    },


    [],
  )

  return (
    <div className="App">
      <div className="site-statistic-demo-card">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Target SLA"
                value={ targetSLA }
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Your SLA"
                value={ currentSLA }
                precision={4}
                valueStyle={{ color: "#cf1322" }}
                // prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Remaining error budget"
                value={ remainingErrBudget }
                precision={2}
                background-color="#1c87c9"
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowDownOutlined />}
                suffix="min"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="SLA burning rate"
                value="Healthy"
                precision={2}
                valueStyle={{ color: "#3f8600" }}
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
            onClose={HandleIncidentOk}
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
