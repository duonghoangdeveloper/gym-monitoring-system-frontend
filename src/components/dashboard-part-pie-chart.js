import { Pie } from 'ant-design-pro/lib/Charts';
import numeral from 'numeral';
import React from 'react';

export const PartPieChart = ({ data, subTitle, text }) => (
  <div>
    <div className="flex justify-between">
      <h6 className="text-2xl">{text}</h6>
    </div>
    <Pie
      data={data}
      hasLegend
      height={294}
      subTitle={subTitle}
      title={text}
      total={() => (
        <span
          dangerouslySetInnerHTML={{
            __html: numeral(data.reduce((pre, now) => now.y + pre, 0)).format(
              '0,0'
            ),
          }}
        />
      )}
      valueFormat={val => (
        <span
          dangerouslySetInnerHTML={{ __html: numeral(val).format('0,0') }}
        />
      )}
    />
  </div>
);
