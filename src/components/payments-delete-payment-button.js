import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Form, message, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';

export const PaymentsDeletePaymentButton = ({ onSuccess, payment }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async () => {
    const { _id } = payment;
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation DeletePayment($_id: ID!) {
            deletePayment(_id: $_id) {
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

      message.success('Delete payment succeed!');
      setVisible(false);
      onSuccess(result?.data?.deletePayment);
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <>
      <a className="whitespace-no-wrap" onClick={handleClick}>
        <EditOutlined />
        &nbsp;&nbsp;Delete
      </a>
      <Modal
        className="select-none"
        onCancel={() => {
          setTimeout(() => form.resetFields(), 500);
          setVisible(false);
        }}
        onOk={onFinish}
        title="Delete payment"
        visible={visible}
      >
        <p>Are you sure you want to delete this payment? </p>
        <p>{payment.name}</p>
      </Modal>
    </>
  );
};
