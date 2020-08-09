import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal, Typography } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';

export const PaymentsDeletePaymentButton = ({ onSuccess, payment }) => {
  const client = useApolloClient();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async () => {
    setConfirmLoading(true);

    const { _id } = payment;
    try {
      await client.mutate({
        mutation: gql`
          mutation deletePayment($_id: ID!) {
            deletePayment(_id: $_id) {
              createdAt
            }
          }
        `,
        variables: {
          _id,
        },
      });
      message.success('Delete payment successfully!');
      setVisible(false);
      onSuccess();
      setConfirmLoading(false);
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <div>
      {payment.date === moment(new Date()).format(DATE_FORMAT) ? (
        <a className="whitespace-no-wrap" onClick={handleClick}>
          <DeleteOutlined />
          <Typography.Text style={{ color: '#1890ff' }}>
            &nbsp;&nbsp;Delete
          </Typography.Text>
        </a>
      ) : (
        <a className="whitespace-no-wrap" disabled onClick={handleClick}>
          <DeleteOutlined />
          <Typography.Text disabled>&nbsp;&nbsp;Delete</Typography.Text>
        </a>
      )}
      <Modal
        confirmLoading={confirmLoading}
        maskClosable={false}
        okText="Delete"
        onCancel={() => {
          setVisible(false);
        }}
        onOk={onFinish}
        title="Do you want delete this payment?"
        visible={visible}
      >
        <Form layout="vertical" />
        <Form.Item label="Customer" name="Title">
          {payment.customer.username}
        </Form.Item>
        <Form.Item label="Creator" name="Title">
          {payment.creator.username}
        </Form.Item>
        <Form.Item label="Package" name="Title">
          {payment.paymentPlan.name}
        </Form.Item>
        <Form.Item label="Date" name="Title">
          {payment.date}
        </Form.Item>
      </Modal>
    </div>
  );
};
