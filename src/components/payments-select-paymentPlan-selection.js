import { useApolloClient } from '@apollo/react-hooks';
import { Select } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

export const PaymentsSelectpaymentPlanSelection = ({
  defaultOptions,
  onDataChange,
  style,
}) => {
  const client = useApolloClient();

  const [paymentPlans, setPaymentPlans] = useState([]);
  const [total, setTotal] = useState(0);
  const fetchpaymentPlansData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query paymentPlans($query: PaymentPlansQueryInput) {
            paymentPlans(query: $query) {
              data {
                _id
                name
                price
                period
              }
              total
            }
          }
        `,
        variables: {},
      });

      const fetchedpaymentPlansData = result?.data?.paymentPlans?.data ?? [];
      const fetchedpaymentPlansTotal = result?.data?.paymentPlans?.total ?? 0;
      setPaymentPlans(
        fetchedpaymentPlansData.map(_package => ({
          key: _package._id,

          ..._package,
        }))
      );
      setTotal(fetchedpaymentPlansTotal);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fetchpaymentPlansData();
  }, []);

  return (
    <Select
      defaultValue={defaultOptions}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={onDataChange}
      optionFilterProp="children"
      placeholder="Select a payment plan"
      showSearch
      style={style}
    >
      {paymentPlans.map(item => (
        <Option key={item._id} value={item._id}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
};
