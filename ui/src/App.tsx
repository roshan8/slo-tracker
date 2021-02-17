import React, { useState } from 'react';
import './app.css';
import {
  Statistic, Card, Row, Col, Modal, Button, Table, Space, Switch
} from 'antd';
import 'antd/dist/antd.css'; 
import { ResponsivePie } from '@nivo/pie'
import { ThemeProvider } from 'styled-components';
import data from './data.json';

function App() {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // function for switch
  function onChange(checked) {
    console.log(`switch to ${checked}`);
  }
  // Incident list
  const dataSource = [
    {
      key: '1',
      name: 'ThirdPartyOutage',
      created_on: "2020-12-01:10:20",
      error_budget_spent: '10 min',
      alert_source: "Alertmanager",
    },
    {
      key: '2',
      name: 'HighLatency',
      created_on: "2020-02-11:20:20",
      error_budget_spent: '1 min',
      alert_source: "Alertmanager",
    },
    {
      key: '2',
      name: 'HighLatency',
      created_on: "2020-02-11:20:20",
      error_budget_spent: '5 min',
      alert_source: "Datadog",
    },
    {
      key: '2',
      name: 'HighLatency',
      created_on: "2020-01-11:20:20",
      error_budget_spent: '7 min',
      alert_source: "alertmanager",
    },
    {
      key: '2',
      name: 'HighErrorRate',
      created_on: "2020-12-11:20:20",
      error_budget_spent: '9 min',
      alert_source: "Datadog",
    },
  ];

  const columns = [
    {
      title: 'SLI',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Alertsource',
      dataIndex: 'alert_source',
      key: 'alert_source',
    },    
    {
      title: 'Created on',
      dataIndex: 'created_on',
      key: 'created_on',
    },
    {
      title: 'Error budget spent',
      dataIndex: 'error_budget_spent',
      key: 'error_budget_spent',
    },
    {
      title: 'Mark false positive',
      key: 'action',
      render: () => (
        <Switch defaultChecked onChange={onChange} />
      ),
    },
  ];


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
                valueStyle={{ color: '#3f8600' }}
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
                valueStyle={{ color: '#cf1322' }}
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
                valueStyle={{ color: '#3f8600' }}
                // prefix={<ArrowDownOutlined />}
                suffix="min"
              />
            </Card>
          </Col>
        </Row>
      </div>  

      <Row gutter={[8, 8]}>
        <Col span={12}> 
          <Button type="primary" block onClick={showModal}>
            Update SLA Target
          </Button>
          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </Col>
        <Col span={12}> 
          <Button type="primary" block onClick={showModal}>
            Create Incident
          </Button>
          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col flex={0.5}>
          <div style={{ height: '50em', width: '40em' }}>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextColor="#333333"
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabelsSkipAngle={10}
                sliceLabelsTextColor="#333333"
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(255, 255, 255, 0.3)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'PushNotificationFailure'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'HighErrorRate'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'HighLatency'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'ThirdPartyOutage'
                        },
                        id: 'dots'
                    }
                ]}
                legends={[]}
            />
          </div>
        </Col>
        <Col flex={4.5}>
          <Table dataSource={dataSource} columns={columns} />
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
