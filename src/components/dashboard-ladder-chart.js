import { Chart, Line, Point } from 'bizcharts';
import React from 'react';

export const LadderChart = ({ data, text }) => (
  <div>
    <div className="flex justify-between">
      <h6 className="text-2xl">{text}</h6>
    </div>
    <Chart
      autoFit
      data={data}
      height={300}
      padding={[10, 20, 50, 40]}
      scale={{ value: { min: 0 } }}
    >
      <Line position="month*value" shape="hv" />
    </Chart>
  </div>
);
