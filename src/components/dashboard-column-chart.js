import { Axis, Chart, Geom, Interval, Tooltip } from 'bizcharts';
import React, { useEffect, useState } from 'react';

export const ColumnChart = ({ data, text }) => (
  <div>
    <div className="flex justify-between">
      <h6 className="text-2xl">{text}</h6>
    </div>

    <Chart
      autoFit
      data={data}
      height={300}
      interactions={['active-region']}
      padding={[30, 30, 30, 50]}
    >
      <Interval position="month*sales" />
      <Tooltip shared />
    </Chart>
  </div>
);
