import 'ant-design-pro/dist/ant-design-pro.css';

import { Col, Row, Tabs } from 'antd';
import React from 'react';

import { CustomerColumnChart } from '../components/dashboard-column-customer-chart';
import { CustomerChartCard } from '../components/dashboard-customer-chart-card';
import { LineChart } from '../components/dashboard-line-chart';
import { PieCharts } from '../components/dashboard-pie-chart';
import { LadderChart } from '../components/dashboard-posture-rank-chart';
import { RevenueChartCard } from '../components/dashboard-revenue-chart-card';
import { TrainerChartCard } from '../components/dashboard-trainer-chart-card';
import { WarningChartCard } from '../components/dashboard-warning-chart-card';
import { WarningColumnChart } from '../components/dashboard-warning-column-chart';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Dashboard = () => (
  // data pie chart
  // console.log(dateRange);
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
          <TrainerChartCard />
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
          <Tabs.TabPane key="2" tab="Customer">
            <CustomerColumnChart />
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
          <Tabs>
            <Tabs.TabPane key="1" tab="Dangerous Postures Ranking">
              <LadderChart
                subTitle="Dangerous Postures"
                text="Dangerous Postures Ranking"
              />
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
