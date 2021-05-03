import React, { useEffect, useState } from "react";
import "./app.css";
import LoginApp from './Login';
import ReactDOM from 'react-dom';
import {
  Statistic,
  Card,
  Row,
  Col,
  Tabs,
  Form,
  Input,
  Drawer,
  notification,
  Button,
  Table,
  Switch,
  InputNumber,
} from "antd";
import "antd/dist/antd.css";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";

interface IIncidentList {
  id: number;
  sli_name: string;
  alertsource: string;
  state: string;
  created_at: Date;
  err_budget_spent: number;
  mark_false_positive: boolean;
}

interface incidentSummaryType  {
  id: string;
  value: number;
  label: string;
}

interface errBudgetOverTimeType  {
  x: string;
  y: number;
}

interface burningRateType  {
  label: string;
  color: string;
}

function App() {

  const [isSLODrawerVisible, setIsSLODrawerVisible] = useState(false);
  const [isIncidentDrawerVisible, setIsIncidentDrawerVisible] = useState(false);
  const [incidentList, setInicidentList] = useState<IIncidentList[]>([]);
  const [currentSLO, setCurrentSLO] = useState(100);
  const [targetSLO, setTargetSLO] = useState(100);
  const [remainingErrBudget, setRemainingErrBudget] = useState(0);
  const [burningRate, setBurningRate] = useState<burningRateType>();
  const [incidentSummary, setIncidentSummary] = useState<incidentSummaryType[]>([]);
  const [errBudgetOverTime, setErrBudgetOverTime] = useState<errBudgetOverTimeType[]>([]);
  const { TabPane } = Tabs;

  var API_URL = `http://${document.location.hostname}:8080`;

  // Redirect user to login page when `IsAuthenticated` not set to `yes`
  if (localStorage.getItem('IsAuthenticated') != "yes") {
    ReactDOM.render(
      <React.StrictMode>
        <LoginApp />
      </React.StrictMode>,
      document.getElementById('root')
    );
  }

  function callback(key) {
    console.log(key);
  }
  const showSLODrawer = () => {
    setIsSLODrawerVisible(true);
  };

  const showIncidentDrawer = () => {
    setIsIncidentDrawerVisible(true);
  };

  const HandleSLOOk = () => {
    setIsSLODrawerVisible(false);
  };

  const HandleIncidentOk = () => {
    setIsIncidentDrawerVisible(false);    
  };

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      // message:     'Notification',
      description: message,
    });
  };

  // Calulates the allotted err budget for targeted SLO
  // Also updates the SLO burning rate card
  function CalculateErrBudget(targetSLOinPerc, remainingErrBudget) {
    let allottedErrBudgetInMin = 0, totalSecsInYear = 31536000;
    let downtimeInFraction = 1 - (targetSLOinPerc / 100)
    allottedErrBudgetInMin = (downtimeInFraction * totalSecsInYear) / 60
  
    let month_raw = new Date().getMonth() + 1;
    let errBudgetSpent = allottedErrBudgetInMin - remainingErrBudget
    let errBudgetAllowed = (allottedErrBudgetInMin / 12) * month_raw

    if (errBudgetSpent > errBudgetAllowed) {
      setBurningRate({
        "label": "Critical",
        "color": "#cf1322"
      })
    }
    else {
      console.log(errBudgetSpent, errBudgetAllowed)
      setBurningRate({
          "label": "Healthy",
          "color": "#3f8600"
      })
    }
    return allottedErrBudgetInMin
  }

  function handleSwitchChange(checked) {
    
    console.log(`Updating incident: ${checked.id}`);

    const updateIncidentApi = async () => {
      try {
        var isFalsePositive = (checked.mark_false_positive ? false : true)
        const incidentUpdateReq = await fetch(
          `${API_URL}/api/v1/incident/${checked.id}`, {
            method: 'PATCH',
            body: JSON.stringify({       
              mark_false_positive: isFalsePositive,
              state: checked.state,
              err_budget_spent: checked.err_budget_spent,
            })
          }
        );
        openNotificationWithIcon('success', 'Incident updated!')
        getSLOApiCall()
        getIncidentApiCall()
      } catch (err) {
        console.log(err);
        openNotificationWithIcon('error', 'Unable to update the incident :(')
      }
    };    
    updateIncidentApi();

  }

  const SLOFormLayout = () => {

    const onFinish = (values: any) => {
      const createSLOApi = async () => {
        try {

          const sloCreationReq = await fetch(
            `${API_URL}/api/v1/slo/1`, {
              method: 'PATCH',
              body: JSON.stringify({
                slo_name: values["sloname"],
                target_slo: values["targetslo"],
              })
            }
          );
          openNotificationWithIcon('success', 'Target SLO updated!')
          getSLOApiCall()
          // TODO: Add response code validation.
        } catch (err) {
          openNotificationWithIcon('error', 'Unable to update the target SLO :(')
          console.log(err);

        }
        setIsSLODrawerVisible(false);    
      };    
      createSLOApi();
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
          name="sloname"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Target SLO(in %)"
          name="targetslo"
          rules={[{ required: true, message: 'This is required field' }]}
        >
          <InputNumber />
        </Form.Item>
  
        <Form.Item 
          // {...formTailLayout}
        >
          <Button type="primary" htmlType="submit">
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

          const incidentCreationReq = await fetch(
            `${API_URL}/api/v1/incident/`, {
              method: 'POST',
              body: JSON.stringify({
                sli_name: values["sliname"],
                alertsource: "webUI",
                err_budget_spent: values["errbudgetspent"],
                state: "closed",
              })
            }
          );
          openNotificationWithIcon('success', 'Incident created!'); 
          getIncidentApiCall()
          getSLOApiCall()
        } catch (err) {
          console.log(err);
          openNotificationWithIcon('error', 'Unable to create an incident :(')
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
          <Button type="primary" htmlType="submit">
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
      render: (e, record) => (
        <Switch onChange={() => handleSwitchChange(record)} defaultChecked={e.mark_false_positive}/>
      ) 
    },
  ];

  const getIncidentApiCall = async () => {
    try {
      const incidentListResponse = await fetch(
        `${API_URL}/api/v1/incident/`
      );
      const { data: incidentList } = await incidentListResponse.json();
      setInicidentList(
        incidentList.map((i) => {
          i.key = i.id;
          return i;
        })
      );
      
      // Format the incidentList data in incidentSummaryType format for the Pie Chat
      let incidentSummaryArr = new Array()
      let errBudgetArr = new Array()
      let i = 0;
      while (i < incidentList.length){
        let sliNameFound = 0, j = 0, downtimeDateFound = 0;

        // Skip if incident marked as false positive
        if (incidentList[i]["mark_false_positive"] == true) {
          i++;
          continue;
        }

        for (j = 0; j < incidentSummaryArr.length; j++) {
          // If sli_name key already exist in incidentSummaryArr then update err_budget_spent value
          if (incidentList[i]["sli_name"] === incidentSummaryArr[j]["id"]) {
            incidentSummaryArr[j]["value"] += incidentList[i]["err_budget_spent"]
            sliNameFound = 1
          }
        }

        for (j = 0; j < errBudgetArr.length; j++) {
          // If date key already exist in errBudgetArr then update err_budget_spent value
          if (incidentList[i]["created_at"].split('T', 1)[0] === errBudgetArr[j]["x"]) {
            errBudgetArr[j]["y"] += incidentList[i]["err_budget_spent"]
            downtimeDateFound = 1
          }
        }

        // If sli_name key doesn't exist in incidentSummaryArr then add new item
        if (sliNameFound == 0) {
          incidentSummaryArr.push(new Object(
            {
              "id": incidentList[i]["sli_name"],
              "label": incidentList[i]["sli_name"],
              "value": incidentList[i]["err_budget_spent"]
            }
          ))
        }

        // If sli_name key doesn't exist in incidentSummaryArr then add new item
        if (downtimeDateFound == 0) {
          errBudgetArr.push(new Object(
            {
              "x": incidentList[i]["created_at"].split('T', 1)[0],
              "y": incidentList[i]["err_budget_spent"]
            }
          ))
        }
        i++;
      }

      setIncidentSummary(incidentSummaryArr)  

      let totalErrBudget = 0, j = 0; 
      console.log(errBudgetArr.length)
      for (j = errBudgetArr.length-1; j >= 0; j--) {
        totalErrBudget += errBudgetArr[j]["y"]
        errBudgetArr[j]["y"] = totalErrBudget
        console.log(totalErrBudget)
      }

      console.log(errBudgetArr)
      setErrBudgetOverTime(errBudgetArr)
    } catch (err) {
      console.log(err);
      openNotificationWithIcon('error', 'Unable to fetch incidents :(')
    }
  };

  
  // Fetch SLO details
  const getSLOApiCall = async () => {
    try {
      const SLOListResponse = await fetch(
        `${API_URL}/api/v1/slo/1`
      )
      .then(response => response.json())
      .then(response => {
        console.log(response.data.slo_name)
        setCurrentSLO(response.data.current_slo)
        setTargetSLO(response.data.target_slo)
        setRemainingErrBudget(response.data.remaining_err_budget)
        CalculateErrBudget(response.data.target_slo, response.data.remaining_err_budget)
      })
      .catch(err => { console.log(err); 
      });

    } catch (err) {
      console.log(err);
      openNotificationWithIcon('error', 'Unable to fetch SLO details :(')
    }
  };

  
  useEffect(
    () => {

      getIncidentApiCall();
      getSLOApiCall();

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
                title="Target SLO"
                value={ targetSLO }
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
                title="Your SLO"
                value={ currentSLO }
                precision={4}
                valueStyle={{ color: "#3f8600" }}   
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
                title="SLO burning rate"
                value={ burningRate?.label }
                valueStyle={{ color: burningRate?.color }} 
              />
            </Card>
          </Col>          
        </Row>
      </div>

      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Button type="primary" block onClick={showSLODrawer}>
            Update SLO Target
          </Button>
          <Drawer
            title="Modify target SLO"
            placement="right"
            visible={isSLODrawerVisible}
            onClose={HandleSLOOk}
            bodyStyle={{ paddingBottom: 80 }}
          >
              <SLOFormLayout />
          </Drawer>
        </Col>
        <Col span={12}>
          <Button type="primary" block onClick={showIncidentDrawer}>
            Report an incident
          </Button>
          <Drawer
            title="Report SLO voilating incident"
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
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="ErrBudget consuption by SLI's" key="1">
            <div style={{ height: "40em", width: "40em" }}>
              <ResponsivePie
                data={incidentSummary}
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
                legends={[]}
              />
            </div>
          </TabPane>

          <TabPane tab="ErrBudget consuption over time" key="2">
            <div style={{ height: "40em", width: "40em" }}>
              <ResponsiveLine
                data={[
                  {
                    id: "ErrBudget",
                    data: errBudgetOverTime
                  }
                ]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                  type: "time",
                  format: "%Y-%m-%d"
                }}
                xFormat="time:%Y-%m-%d"
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisLeft={{
                  orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Error budget spent",
                  legendOffset: -40,
                  legendPosition: "middle"
                }}
                axisBottom={{
                  format: "%b %d",
                  //tickValues: "every 2 days",
                  // tickRotation: -90,
                  // legend: "time scale",
                  legendOffset: -12
                }}
                colors={{ scheme: "nivo" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemBackground: "rgba(0, 0, 0, .03)",
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
              />
            </div>
          </TabPane>
        </Tabs>
        </Col>
        <Col flex={4.5}>
          <Table dataSource={incidentList} columns={columns} />
        </Col>
      </Row>
    </div>

  );
}

export default App;
