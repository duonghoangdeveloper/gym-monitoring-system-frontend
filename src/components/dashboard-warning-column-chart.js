import { useApolloClient } from '@apollo/react-hooks';
import { Spin } from 'antd';
import { Chart, Interval, Tooltip } from 'bizcharts';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const WarningColumnChart = ({ data, text }) => {
  const client = useApolloClient();

  const [warnings, setWarnings] = useState([]);

  // const [total, setTotal] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [spinning, setSpinning] = useState(true);
  const fetchWarningsData = async () => {
    setSpinning(true);
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                createdAt
                status
              }
            }
          }
        `,
        variables: {
          query: { createdBetween: { from, to }, limit: 100000000 },
        },
      });

      const fetchedWarningsData = result?.data?.warnings?.data ?? [];

      setWarnings(
        fetchedWarningsData.map(warning => ({
          key: warning._id,
          ...warning,
        }))
      );
      setSpinning(false);
    } catch (e) {
      // Do something
    }
  };
  useEffect(() => {
    fetchWarningsData();
  }, []);
  const resultdata = Object.values(
    warnings.reduce((r, { createdAt }) => {
      const dateObj = new Date(createdAt);
      const month = dateObj.toLocaleString('en-us', {
        // day: 'numeric',
        month: 'long',
        // year: 'numeric',
      });
      if (!r[month]) r[month] = { month, warnings: 1 };
      else r[month].warnings++;
      return r;
    }, {})
  ).reverse();

  return (
    <div className="chartSpinLoader">
      <div className="flex justify-between ">
        <h6 className="text-sm">Warning report</h6>
      </div>
      <Spin spinning={spinning}>
        <Chart
          autoFit
          data={resultdata}
          height={300}
          interactions={['active-region']}
          padding={[30, 30, 30, 50]}
        >
          <Interval position="month*warnings" />
          <Tooltip shared />
        </Chart>
      </Spin>
    </div>
  );
};
