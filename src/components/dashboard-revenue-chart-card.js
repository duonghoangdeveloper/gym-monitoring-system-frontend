import { InfoCircleOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { ChartCard, Field } from 'ant-design-pro/lib/Charts';
import Trend from 'ant-design-pro/lib/Trend';
import { Tooltip } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT } from '../common/constants';

export const RevenueChartCard = () => {
  const client = useApolloClient();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentsData = async () => {
    setLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query Payments($query: PaymentsQueryInput) {
            payments(query: $query) {
              data {
                _id

                paymentPlan {
                  price
                }
                createdAt
              }
            }
          }
        `,
        variables: {
          query: { limit: 100000000 },
          //  search,
        },
      });

      const fetchedPaymentsData = result?.data?.payments?.data ?? [];
      setPayments(
        fetchedPaymentsData.map(_payment => ({
          ..._payment,
        }))
      );

      setLoading(false);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);
  const totalRevenue = payments.reduce(
    (prev, next) => prev + next.paymentPlan.price,
    0
  );

  return (
    <ChartCard
      action={
        <Tooltip title="Show total revenue">
          <InfoCircleOutlined />
        </Tooltip>
      }
      contentHeight={46}
      footer={
        <Field
          label="Last update"
          value={moment(new Date()).format(DATE_FORMAT)}
        />
      }
      loading={loading}
      // loading
      title="Revenue"
      total={() => (
        <span
          dangerouslySetInnerHTML={{
            __html: `${numeral(totalRevenue).format('0,0')} VND`,
          }}
        />
      )}
    >
      <span>
        Updated
        <Trend flag="up" style={{ color: 'rgba(0,0,0,.85)', marginLeft: 8 }} />
      </span>
    </ChartCard>
  );
};
