import 'ant-design-pro/dist/ant-design-pro.css';

import { InfoCircleOutlined } from '@ant-design/icons';
import { ChartCard, MiniProgress } from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import { Col, Row, Tabs, Tooltip } from 'antd';
import React from 'react';

import { ColumnChart } from '../components/dashboard-column-chart';
import { CustomerChartCard } from '../components/dashboard-customer-chart-card';
import { LadderChart } from '../components/dashboard-ladder-chart';
import { LineChart } from '../components/dashboard-line-chart';
import { PieCharts } from '../components/dashboard-pie-chart';
import { RevenueChartCard } from '../components/dashboard-revenue-chart-card';
import { WarningChartCard } from '../components/dashboard-warning-chart-card';
import { WarningColumnChart } from '../components/dashboard-warning-column-chart';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Dashboard = () => {
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
  // console.log(dateRange);
  return (
    <LayoutDashboard>
      <div className="mb-6">
        <Row gutter={{ lg: 32, md: 24, sm: 16, xs: 8 }}>
          <Col className="gutter-row " span={6}>
            <RevenueChartCard />
          </Col>
          <Col className="gutter-row " span={6}>
            <WarningChartCard />
          </Col>
          <Col className="gutter-row " span={6}>
            <CustomerChartCard />
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
                    Trainer
                    <Trend
                      flag="up"
                      style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}
                    >
                      12
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
          <Tabs>
            {/* tabBarExtraContent={operations} */}
            <Tabs.TabPane key="1" tab="Warning">
              <WarningColumnChart />
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="Revenue">
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
            <PieCharts />
          </div>
        </div>

        <div
          className="bg-white shadow px-5 py-3 mt-6 m rounded-sm "
          style={{ width: '50%' }}
        >
          <div className="">
            <Tabs
            // tabBarExtraContent={
            //   <div>
            //     <Button>All Week</Button>
            //     <Button>All Month</Button>
            //     <Button>All Year</Button>
            //   </div>
            // }
            >
              <Tabs.TabPane key="1" tab="Customer feedback">
                <LadderChart subTitle="Feedback" text="Customer feedback" />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="bg-white shadow px-5 py-3 mt-6 mr-5 w-full rounded-sm">
        <div className="">
          <Tabs>
            {/* tabBarExtraContent={operations} */}
            <Tabs.TabPane key="1" tab="Risk and Help">
              <LineChart />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </LayoutDashboard>
  );
};
