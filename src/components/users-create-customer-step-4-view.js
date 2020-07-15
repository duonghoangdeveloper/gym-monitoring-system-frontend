import { Button, Form, Input } from 'antd';
import { Typography } from 'antd';
import { FieldsOnCorrectTypeRule } from 'graphql';
import React, { useForm } from 'react';
import { useSelector } from 'react-redux';

const { Text } = Typography;

export const UsersCreateCustomerStep4View = ({
  customerData,
  onDone,
  onPrev,
}) => {
  const onFinish = () => {};
  const [form] = Form.useForm();
  // const customer = useSelector(state => state?.user?.customer);
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        // onValuesChange={onValuesChange}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              message: 'Please input username!',
              required: true,
            },
          ]}
        >
          <Text mark>{customerData.step3.username}</Text>
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              message: 'Please input password!',
              required: true,
            },
          ]}
        >
          <Text mark>{customerData.step3.password}</Text>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              message: 'Email is invalid!',
              required: true,
              type: 'email',
            },
          ]}
        >
          <Text mark>{customerData.step1.email}</Text>
        </Form.Item>
        <Form.Item label="Name" name="displayName">
          <Text mark>{customerData.step1.phone}</Text>
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Text mark>{customerData.step1.phone}</Text>
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Text mark>{customerData.step1.gender}</Text>
        </Form.Item>
      </Form>

      <div className="flex justify-end">
        <Button onClick={onPrev}>Previous</Button>
        <Button className="ml-2" onClick={onDone} type="primary">
          Done
        </Button>
      </div>
    </div>
  );
};
