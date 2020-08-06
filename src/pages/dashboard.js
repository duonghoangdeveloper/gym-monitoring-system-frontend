import 'ant-design-pro/dist/ant-design-pro.css';

import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import {
  ChartCard,
  Charts,
  Field,
  MiniArea,
  MiniBar,
  MiniProgress,
} from 'ant-design-pro/lib/Charts';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import Trend from 'ant-design-pro/lib/Trend';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Row,
  TabPane,
  Tabs,
  Tooltip,
} from 'antd';
import { Axis, Chart, Geom, Interval } from 'bizcharts';
import gql from 'graphql-tag';
import moment from 'moment';
import numeral from 'numeral';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { formItemLayout, tailFormItemLayout } from '../common/antd';
import { ColumnChart } from '../components/dashboard-column-chart';
import { LadderChart } from '../components/dashboard-ladder-chart';
import { LineChart } from '../components/dashboard-line-chart';
import { PartPieChart } from '../components/dashboard-part-pie-chart';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Dashboard = () => {
  const client = useApolloClient();

  const dispatch = useDispatch();
  const history = useHistory();
  const operations = <Button>All Week</Button>;
  const beginDay = new Date().getTime();
  // data
  const visitData = [];
  for (let i = 0; i < 20; i += 1) {
    visitData.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
        'YYYY-MM-DD'
      ),
      y: Math.floor(Math.random() * 100) + 10,
    });
  }

  // const visitData = [
  //   {
  //     x: '2017-09-01',
  //     y: 100,
  //   },
  //   {
  //     x: '2017-09-02',
  //     y: 120,
  //   },
  //   {
  //     x: '2017-09-03',
  //     y: 88,
  //   },
  //   {
  //     x: '2017-09-04',
  //     y: 65,
  //   },
  // ];
  // data part pie chart
  const dataPartPieChart = [
    {
      x: 'Muscle',
      y: 4544,
    },
    {
      x: 'arm',
      y: 3321,
    },
    {
      x: 'Leg',
      y: 3113,
    },
    {
      x: 'hand',
      y: 2341,
    },
    {
      x: 'shoulder',
      y: 1231,
    },
    {
      x: 'ankle',
      y: 1231,
    },
  ];
  // data ladder chart
  const dataLadderChart = [
    {
      month: 'Jan',
      value: 51,
    },
    {
      month: 'Feb',
      value: 91,
    },
    {
      month: 'Mar',
      value: 34,
    },
    {
      month: 'Apr',
      value: 47,
    },
    {
      month: 'May',
      value: 63,
    },
    {
      month: 'June',
      value: 58,
    },
    {
      month: 'July',
      value: 56,
    },
    {
      month: 'Aug',
      value: 77,
    },
    {
      month: 'Sep',
      value: 99,
    },
    {
      month: 'Oct',
      value: 106,
    },
    {
      month: 'Nov',
      value: 88,
    },
    {
      month: 'Dec',
      value: 56,
    },
  ];
  // data line chart
  const dataLineChart = [
    {
      city: 'Customer at risk',
      month: 'Jan',
      temperature: 7,
    },
    {
      city: 'Trainer Help',
      month: 'Jan',
      temperature: 3.9,
    },
    {
      city: 'Customer at risk',
      month: 'Feb',
      temperature: 6.9,
    },
    {
      city: 'Trainer Help',
      month: 'Feb',
      temperature: 4.2,
    },
    {
      city: 'Customer at risk',
      month: 'Mar',
      temperature: 9.5,
    },
    {
      city: 'Trainer Help',
      month: 'Mar',
      temperature: 5.7,
    },
    {
      city: 'Customer at risk',
      month: 'Apr',
      temperature: 14.5,
    },
    {
      city: 'Trainer Help',
      month: 'Apr',
      temperature: 8.5,
    },
    {
      city: 'Customer at risk',
      month: 'May',
      temperature: 18.4,
    },
    {
      city: 'Trainer Help',
      month: 'May',
      temperature: 11.9,
    },
    {
      city: 'Customer at risk',
      month: 'Jun',
      temperature: 21.5,
    },
    {
      city: 'Trainer Help',
      month: 'Jun',
      temperature: 15.2,
    },
    {
      city: 'Customer at risk',
      month: 'Jul',
      temperature: 25.2,
    },
    {
      city: 'Trainer Help',
      month: 'Jul',
      temperature: 17,
    },
    {
      city: 'Customer at risk',
      month: 'Aug',
      temperature: 26.5,
    },
    {
      city: 'Trainer Help',
      month: 'Aug',
      temperature: 16.6,
    },
    {
      city: 'Customer at risk',
      month: 'Sep',
      temperature: 23.3,
    },
    {
      city: 'Trainer Help',
      month: 'Sep',
      temperature: 14.2,
    },
    {
      city: 'Customer at risk',
      month: 'Oct',
      temperature: 18.3,
    },
    {
      city: 'Trainer Help',
      month: 'Oct',
      temperature: 10.3,
    },
    {
      city: 'Customer at risk',
      month: 'Nov',
      temperature: 13.9,
    },
    {
      city: 'Trainer Help',
      month: 'Nov',
      temperature: 6.6,
    },
    {
      city: 'Customer at risk',
      month: 'Dec',
      temperature: 9.6,
    },
    {
      city: 'Trainer Help',
      month: 'Dec',
      temperature: 4.8,
    },
  ];
  // data column chart
  const dataChart = [
    { month: 'January', sales: 38 },
    { month: 'February', sales: 52 },
    { month: 'March', sales: 61 },
    { month: 'April', sales: 45 },
    { month: 'May', sales: 48 },
    { month: 'June', sales: 38 },
    { month: 'July', sales: 38 },
    { month: 'August', sales: 38 },
    { month: 'September', sales: 45 },
    { month: 'October', sales: 48 },
    { month: 'November', sales: 38 },
    { month: 'December', sales: 38 },
  ];

  // data pie chart
  const totalSales = 192131;
  const [loading, setLoading] = useState(false);
  const style = { padding: '8px 0' };
  return (
    <LayoutDashboard>
      <div className="mb-6">
        <Row gutter={{ lg: 32, md: 24, sm: 16, xs: 8 }}>
          <Col className="gutter-row " span={6}>
            <ChartCard
              action={
                <Tooltip title="Total sales">
                  <InfoCircleOutlined />
                </Tooltip>
              }
              contentHeight={46}
              footer={
                <Field label="Revenue" value={numeral(12423).format('0,0')} />
              }
              title="Revenue"
              total={() => (
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(totalSales).format('0,0')} VND`,
                  }}
                />
              )}
            >
              <span>
                Increase
                <Trend
                  flag="up"
                  style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}
                >
                  12%
                </Trend>
              </span>
              <span style={{ marginLeft: 16 }}>
                Decrease
                <Trend
                  flag="down"
                  style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}
                >
                  11%
                </Trend>
              </span>
            </ChartCard>
          </Col>
          <Col className="gutter-row " span={6}>
            <ChartCard
              action={
                <Tooltip title="Total Dangerous">
                  <InfoCircleOutlined />
                </Tooltip>
              }
              contentHeight={46}
              footer={
                <Field
                  label="Daily Dangerous"
                  value={numeral(1234).format('0,0')}
                />
              }
              title="Total Dangerous"
              total={numeral(8846).format('0,0')}
            >
              <MiniArea data={visitData} height={45} line />
            </ChartCard>
          </Col>
          <Col className="gutter-row " span={6}>
            <ChartCard
              action={
                <Tooltip title="Show all customer at gym center">
                  <InfoCircleOutlined />
                </Tooltip>
              }
              contentHeight={46}
              footer={
                <Field
                  label="Daily Customer"
                  value={numeral(1234).format('0,0')}
                />
              }
              title="Total Customer"
              total={numeral(8846).format('0,0')}
            >
              <MiniBar data={visitData} height={46} />
            </ChartCard>
          </Col>
          <Col className="gutter-row " span={6}>
            <ChartCard
              action={
                <Tooltip title="Show all Trainer is working in gym center">
                  <InfoCircleOutlined />
                </Tooltip>
              }
              contentHeight={46}
              footer={
                <div>
                  <span>
                    周同比
                    <Trend
                      flag="up"
                      style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}
                    >
                      12%
                    </Trend>
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    日环比
                    <Trend
                      flag="down"
                      style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}
                    >
                      11%
                    </Trend>
                  </span>
                </div>
              }
              title="Tranier working"
              total="78%"
            >
              <MiniProgress percent={78} strokeWidth={8} target={80} />
            </ChartCard>
          </Col>
        </Row>
      </div>

      <div className="bg-white shadow px-5 py-3 rounded-sm">
        <div className="">
          <Tabs tabBarExtraContent={operations}>
            <Tabs.TabPane key="1" tab="Revenue">
              <ColumnChart data={dataChart} text="Revenue" />
            </Tabs.TabPane>
            <Tabs.TabPane key="3" tab="Customer">
              <ColumnChart data={dataChart} text="Customer" />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
      <div className="flex flex-row ">
        <div
          className="bg-white shadow px-5 py-3 mt-6 mr-4 rounded-sm "
          style={{ width: '50%' }}
        >
          <div className="">
            <Tabs
              tabBarExtraContent={
                <div>
                  <Button>All Week</Button>
                  <Button>All Month</Button>
                  <Button>All Year</Button>
                </div>
              }
            >
              <Tabs.TabPane key="1" tab="Common Dangerous">
                <PartPieChart
                  data={dataPartPieChart}
                  subTitle="All dangerous happened"
                  text="Dangerous"
                />
              </Tabs.TabPane>
              <Tabs.TabPane key="2" tab="Package">
                <PartPieChart
                  data={dataPartPieChart}
                  subTitle="All package sold"
                  text="Package"
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>

        <div
          className="bg-white shadow px-5 py-3 mt-6 m rounded-sm "
          style={{ width: '50%' }}
        >
          <div className="">
            <Tabs
              tabBarExtraContent={
                <div>
                  <Button>All Week</Button>
                  <Button>All Month</Button>
                  <Button>All Year</Button>
                </div>
              }
            >
              <Tabs.TabPane key="1" tab="Customer feedback">
                <LadderChart
                  data={dataLadderChart}
                  subTitle="Customer feedback"
                  text="Customer feedback"
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="bg-white shadow px-5 py-3 mt-6 mr-5 w-full rounded-sm">
        <div className="">
          <Tabs tabBarExtraContent={operations}>
            <Tabs.TabPane key="1" tab="Risk and Help">
              <LineChart data={dataLineChart} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </LayoutDashboard>
  );
};
