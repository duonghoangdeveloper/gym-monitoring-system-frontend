import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { PaymentsSelectCustomerSelection } from './payments-select-customer-selection';
import { PaymentsSelectpaymentPlanSelection } from './payments-select-package-selection';

export const PaymentsCreatePaymentButton = ({ onSuccess, ...props }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };
  const handleDataChanged = value => {
    form.setFieldsValue({ paymentPlanId: value });
  };
  const handleDataChangedCustomer = value => {
    form.setFieldsValue({ customerId: value });
  };
  const onFinish = async values => {
    setConfirmLoading(true);
    try {
      const { customerId, paymentPlanId } = values;
      await client.mutate({
        mutation: gql`
          mutation createPayment($data: CreatePaymentInput!) {
            createPayment(data: $data) {
              createdAt
              _id
              customer {
                username
              }
              paymentPlan {
                name
                period
              }
            }
          }
        `,
        variables: {
          data: { customerId, paymentPlanId },
        },
      });
      message.success('Create package succeeded!');
      setVisible(false);
      onSuccess();
      setConfirmLoading(false);
      setTimeout(() => form.resetFields(), 3000);
    } catch (e) {
      console.log(e.message);
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={handleClick} {...props}>
        Create Payment
      </Button>
      <Modal
        className="select-none"
        confirmLoading={confirmLoading}
        maskClosable={false}
        okButtonProps={{
          disabled,
        }}
        onCancel={() => {
          setTimeout(() => form.resetFields(), 500);
          setVisible(false);
        }}
        onOk={() => {
          form.submit();
        }}
        title="Create Payment"
        visible={visible}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                message: 'Please input name of package!',
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item> */}

          <Form.Item
            label="Customer"
            name="customerId"
            rules={[
              {
                message: 'Please input customer!',
                required: true,
              },
            ]}
          >
            <PaymentsSelectCustomerSelection
              onDataChange={handleDataChangedCustomer}
              style={{ width: '372px' }}
            />
          </Form.Item>
          <Form.Item
            label="Package"
            name="paymentPlanId"
            rules={[
              {
                message: 'Please choose package!',
                required: true,
              },
            ]}
          >
            <PaymentsSelectpaymentPlanSelection
              onDataChange={handleDataChanged}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
