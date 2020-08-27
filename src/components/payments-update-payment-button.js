import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Form, message, Modal, Typography } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useState } from 'react';

import { DATE_FORMAT } from '../common/constants';
import { PaymentsSelectCustomerSelection } from './payments-select-customer-selection';
import { PaymentsSelectpaymentPlanSelection } from './payments-select-paymentPlan-selection';

export const PaymentsUpdatePaymentButton = ({ onSuccess, payment }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleDataChanged = value => {
    form.setFieldsValue({ paymentPlanId: value });
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
    const { customerId, paymentPlanId } = values;
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
              paymentPlan {
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
          data: { customerId, paymentPlanId },
        },
      });
      message.success('Update payment succeeded!');
      setVisible(false);
      onSuccess(result?.data?.updatePayment);
      setConfirmLoading(false);
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
      message.error('Update payment failed!');
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
        title="Update Payment Plan"
        visible={visible}
      >
        <Form
          form={form}
          initialValues={{
            customerId: payment.customer._id,
            paymentPlan: payment.paymentPlan.name,
            paymentPlanId: payment.paymentPlan._id,
          }}
          layout="vertical"
          onFinish={onFinish}
          // onValuesChange={onValuesChange}
        >
          {' '}
          <Form.Item
            label="Customer"
            name="customerId"
            // rules={[
            //   {
            //     message: 'Please input customer!',
            //     required: true,
            //   },
            // ]}
          >
            <PaymentsSelectCustomerSelection
              defaultOptions={payment.customer.username}
              onDataChange={handleDataChangedCustomer}
              style={{ width: '372px' }}
            />
          </Form.Item>
          <Form.Item
            label="Payment Plan"
            name="paymentPlanId"
            // rules={[
            //   {
            //     message: 'Please choose package!',
            //     required: true,
            //   },
            // ]}
          >
            <PaymentsSelectpaymentPlanSelection
              defaultOptions={payment.paymentPlan.name}
              onDataChange={handleDataChanged}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
