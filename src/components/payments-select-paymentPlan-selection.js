import { useApolloClient } from '@apollo/react-hooks';
import { Select } from 'antd';
import gql from 'graphql-tag';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

export const PaymentsSelectpaymentPlanSelection = ({
  defaultOptions,
  onDataChange,
  style,
}) => {
  const client = useApolloClient();
  const [currentPaymentPlan, setCurrentPaymentPlan] = useState([]);
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
  const changePayment = value => {
    setCurrentPaymentPlan(
      paymentPlans.filter(({ _id }) => _id.toString() === value)
    );
  };
  return (
    <>
      <Select
        defaultValue={defaultOptions}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={onDataChange}
        onSelect={value => changePayment(value)}
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
      {currentPaymentPlan[0] ? (
        <div className="flex flex-col pt-10">
          <div className="flex  mb-6">
            <span className="w-1/4 font-semibold">Name:</span>
            <span>{currentPaymentPlan[0].name ?? 'N/A'}</span>
          </div>
          <div className="flex mb-6">
            <span className="w-1/4 font-semibold">Period:</span>
            <span>{currentPaymentPlan[0].period ?? 'N/A'} Days</span>
          </div>

          <div className="flex">
            <span className="w-1/4 font-semibold">Price:</span>
            <span>
              {`${numeral(currentPaymentPlan[0].price).format('0,0')} VND` ??
                'N/A'}
            </span>
          </div>
        </div>
      ) : (
        <div />
      )}
    </>
  );
};
