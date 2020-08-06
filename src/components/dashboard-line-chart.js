import { Chart, Line, Point } from 'bizcharts';
import React from 'react';
import ReactDOM from 'react-dom';

export const LineChart = ({ data }) => (
  <Chart
    autoFit
    data={data}
    height={320}
    padding={[10, 20, 50, 40]}
    scale={{ temperature: { min: 0 } }}
  >
    <Line color="city" position="month*temperature" shape="smooth" />
    <Point color="city" position="month*temperature" />
  </Chart>
);
