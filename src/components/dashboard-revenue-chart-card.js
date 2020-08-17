import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { ChartCard, Field } from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import { Tooltip } from 'antd';
import gql from 'graphql-tag';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';

export const RevenueChartCard = () => {
  const client = useApolloClient();
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const totalSales = 123213;
  const fetchPaymentsData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query Payments($query: PaymentsQueryInput) {
            payments(query: $query) {
              data {
                _id

                paymentPlan {
                  price
                  period
                }
              }
              total
            }
          }
        `,
        variables: {
          query: { limit: 100000000 },
          //  search,
        },
      });

      const fetchedPaymentsData = result?.data?.payments?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.payments?.total ?? 0;
      setPayments(
        fetchedPaymentsData.map(_payment => ({
          ..._payment,
        }))
      );
      setTotal(fetchedPaymentsTotal);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);
  // const totalRevenue = payments.forEach(p => p.paymentPlan.price * p.total);
  // console.log(totalRevenue);
  // console.log(Object.keys(payments).forEach(ps => ps.Payment));

  return (
    <ChartCard
      action={
        <Tooltip title="Total sales">
          <InfoCircleOutlined />
        </Tooltip>
      }
      contentHeight={46}
      footer={
        <Field label="Daily revenue" value={numeral(12423).format('0,0')} />
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
        <Trend flag="up" style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}>
          12%
        </Trend>
      </span>
      <span style={{ marginLeft: 16 }}>
        Decrease
        <Trend flag="down" style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }}>
          11%
        </Trend>
      </span>
    </ChartCard>
  );
};
