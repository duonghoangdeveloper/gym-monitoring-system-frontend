import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';

export const PaymentsUpdatePaymentButton = ({ onSuccess, payment }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async values => {
    const { name, period, price } = values;
    const { _id } = payment;
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation UpdatePayment($_id: ID!, $data: UpdatePaymentInput) {
            updatePayment(_id: $_id, data: $data) {
              _id
              name
              price
              period
            }
          }
        `,
        variables: {
          _id,
          data: {
            name,
            period,
            price,
          },
        },
      });
      message.success('Update payment succeed!');
      setVisible(false);
      onSuccess(result?.data?.updatePayment);
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  const onValuesChange = (_, allValues) => {
    setDisabled(
      allValues.name === payment.name &&
        allValues.price === payment.price &&
        allValues.period === payment.period
    );
  };

  return (
    <>
      <a className="whitespace-no-wrap" onClick={handleClick}>
        <EditOutlined />
        &nbsp;&nbsp;Update
      </a>
      <Modal
        className="select-none"
        maskClosable={false}
        okButtonProps={{
          disabled,
        }}
        onCancel={() => {
          setTimeout(() => form.resetFields(), 500);
          setVisible(false);
        }}
        onOk={() => form.submit()}
        title="Update payment"
        visible={visible}
      >
        <Form
          form={form}
          initialValues={{
            name: payment.name,
            period: payment.period,
            price: payment.price,
          }}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                message: 'Please input name of payment!',
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <InputNumber placeholder="Enter price" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Period" name="period">
            <InputNumber placeholder="Enter period" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
