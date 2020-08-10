import { useApolloClient } from '@apollo/react-hooks';
import { Axis, Chart, Geom, Interval, Tooltip } from 'bizcharts';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';

export const WarningColumnChart = ({ data, text }) => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);

  const [groupMonth, setGroupMonth] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchWarningsData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                customer {
                  username
                }
                createdAt
                status
              }
            }
          }
        `,
        variables: {
          query: { createdBetween: { from, to }, limit: skip, sort },
        },
      });

      const fetchedWarningsData = result?.data?.warnings?.data ?? [];

      setWarnings(
        fetchedWarningsData.map((warning, index) => ({
          key: warning._id,
          ...warning,
        }))
      );
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
    <div>
      <div className="flex justify-between">
        <h6 className="text-2xl">Warning report</h6>
      </div>

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
    </div>
  );
};
