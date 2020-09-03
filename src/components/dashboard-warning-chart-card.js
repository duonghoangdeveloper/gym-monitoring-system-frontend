import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { ChartCard, Field, MiniArea } from 'ant-design-pro/lib/Charts';
import { Tooltip } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';

export const WarningChartCard = () => {
  const client = useApolloClient();
  const [warnings, setWarnings] = useState([]);
  const [total, setTotal] = useState(0);
  // const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [sort, setSort] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const visitData = [];
  const beginDay = new Date().getTime();

  for (let i = 0; i < 20; i += 1) {
    visitData.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format(
        'YYYY-MM-DD'
      ),
      y: Math.floor(Math.random() * 100) + 10,
    });
  }
  const fetchWarningsData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                createdAt
                status
              }
              total
            }
          }
        `,
        variables: {
          query: { createdBetween: { from, to }, limit: 100000000 },
        },
      });

      const fetchedWarningsData = result?.data?.warnings?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.warnings?.total ?? 0;

      setWarnings(
        fetchedWarningsData.map(warning => ({
          key: warning._id,
          ...warning,
        }))
      );
      setLoading(false);
      setTotal(fetchedPaymentsTotal);
    } catch (e) {
      // Do something
    }
  };
  useEffect(() => {
    fetchWarningsData();
  }, []);
  // const totalRevenue = payments.forEach(p => p.paymentPlan.price * p.total);
  // console.log(totalRevenue);
  // console.log(Object.keys(payments).forEach(ps => ps.Payment));
  const resultdata = Object.values(
    warnings.reduce((r, { createdAt }) => {
      const dateObj = new Date(createdAt);
      const x = dateObj.toLocaleString('en-us', {
        day: 'numeric',
        month: 'long',
        // year: 'numeric',
      });
      if (!r[x]) r[x] = { x, y: 1 };
      else r[x].y++;
      return r;
    }, {})
  ).reverse();
  // console.log(resultdata);
  return (
    <ChartCard
      action={
        <Tooltip title="Show total dangerous of customer">
          <InfoCircleOutlined />
        </Tooltip>
      }
      contentHeight={46}
      footer={<Field label="Updated" />}
      loading={loading}
      title="Total Dangerous"
      total={numeral(total).format('0,0')}
    >
      <MiniArea data={resultdata} height={45} line />
    </ChartCard>
  );
};
