import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { PaymentsSelectCustomerSelect } from './payments-select-customer-select';
import { PaymentsSelectPackageSelect } from './payments-select-package-select';

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
    form.setFieldsValue({ packageId: value });
  };
  const handleDataChangedCustomer = value => {
    form.setFieldsValue({ customerId: value });
  };
  const onFinish = async values => {
    setConfirmLoading(true);
    try {
      const { customerId, packageId } = values;
      await client.mutate({
        mutation: gql`
          mutation createPayment($data: CreatePaymentInput!) {
            createPayment(data: $data) {
              createdAt
              _id
              customer {
                username
              }
              package {
                name
                period
              }
            }
          }
        `,
        variables: {
          data: { customerId, packageId },
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
            name="customerId"
            rules={[
              {
                message: 'Please input customer!',
                required: true,
              },
            ]}
          >
            <PaymentsSelectCustomerSelect
              onDataChange={handleDataChangedCustomer}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="Package"
            name="packageId"
            rules={[
              {
                message: 'Please choose package!',
                required: true,
              },
            ]}
          >
            <PaymentsSelectPackageSelect
              onDataChange={handleDataChanged}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
