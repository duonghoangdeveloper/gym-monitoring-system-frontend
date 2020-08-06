import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Typography,
} from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';
import { PaymentsSelectCustomerSelection } from './payments-select-customer-selection';
import { PaymentsSelectPackageSelection } from './payments-select-package-selection';

const { Option } = Select;
export const PaymentsUpdatePaymentButton = ({ onSuccess, payment }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleDataChanged = value => {
    form.setFieldsValue({ packageId: value });
  };
  const handleDataChangedCustomer = value => {
    form.setFieldsValue({ customerId: value });
  };
  // const onValuesChange = (_, allValues) => {
  //   setDisabled(allValues.package.name === payment.package.name);
  // };
  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async values => {
    const { customerId, packageId } = values;
    setConfirmLoading(true);
    const { _id } = payment;
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation UpdatePayment($_id: ID!, $data: UpdatePaymentInput) {
            updatePayment(_id: $_id, data: $data) {
              _id
              creator {
                username
              }
              createdAt
              customer {
                username
                _id
              }
              package {
                _id
                name
                price
                period
              }
            }
          }
        `,
        variables: {
          _id,
          data: { customerId, packageId },
        },
      });
      message.success('Update payment succeeded!');
      setVisible(false);
      onSuccess(result?.data?.updatePayment);
      setConfirmLoading(false);
    } catch (e) {
      // message.error(`${e.message.split(': ')[1]}!`);
      // message.error('Update payment failed!');
    }
  };

  return (
    <>
      {payment.date === moment(new Date()).format(DATE_FORMAT) ? (
        <a className="whitespace-no-wrap" onClick={handleClick}>
          <EditOutlined />
          <Typography.Text style={{ color: '#1890ff' }}>
            &nbsp;&nbsp;Update
          </Typography.Text>
        </a>
      ) : (
        <a className="whitespace-no-wrap" disabled onClick={handleClick}>
          <EditOutlined />
          <Typography.Text disabled>&nbsp;&nbsp;Update</Typography.Text>
        </a>
      )}

      <Modal
        className="select-none"
        confirmLoading={confirmLoading}
        // okButtonProps={{
        //   disabled,
        // }}
        maskClosable={false}
        onCancel={() => {
          setTimeout(() => form.resetFields(), 500);
          setVisible(false);
        }}
        onOk={() => form.submit()}
        title="Update package"
        visible={visible}
      >
        <Form
          form={form}
          initialValues={{
            customerId: payment.customer._id,
            package: payment.package.name,
            packageId: payment.package._id,
          }}
          layout="vertical"
          onFinish={onFinish}
          // onValuesChange={onValuesChange}
        >
          <Form.Item label="Package" name="packageId">
            <PaymentsSelectPackageSelection
              defaultOptions={payment.package.name}
              onDataChange={handleDataChanged}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="customerId">
            <PaymentsSelectCustomerSelection
              defaultOptions={payment.customer.username}
              onDataChange={handleDataChangedCustomer}
              style={{ width: '100%' }}
            />
          </Form.Item>
          {/* <Form.Item label="Customer" name="customerId">
            <Input placeholder="Enter period" style={{ width: '100%' }} />
          </Form.Item> */}
        </Form>
      </Modal>
    </>
  );
};
