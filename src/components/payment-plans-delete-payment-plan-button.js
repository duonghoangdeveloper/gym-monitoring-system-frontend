import { DeleteOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { message, Popconfirm } from 'antd';
import gql from 'graphql-tag';
import React from 'react';

export const PaymentPlansDeletePaymentPlanButton = ({
  onSuccess,
  paymentPlan,
}) => {
  const client = useApolloClient();
  const text = `Are you sure to remove ${paymentPlan.name}?`;

  const onConfirm = async () => {
    const { _id } = paymentPlan;
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation DeletePaymentPlan($_id: ID!) {
            deletePaymentPlan(_id: $_id) {
              _id
              name
              price
              period
            }
          }
        `,
        variables: {
          _id,
        },
      });

      message.success('Delete paymentPlan succeed!');
      onSuccess(result?.data?.deletePaymentPlan);
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <>
      <Popconfirm
        cancelText="No"
        okText="Yes"
        onConfirm={onConfirm}
        placement="left"
        title={text}
      >
        <a className="whitespace-no-wrap">
          <DeleteOutlined />
          &nbsp;&nbsp;Delete
        </a>
      </Popconfirm>
    </>
  );
};
