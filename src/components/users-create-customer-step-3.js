import { Button, Form, Input, Select } from 'antd';
import React, { useForm } from 'react';

export const UsersCreateCustomerStep3 = () => {
  const onFinish = () => {};
  const [form] = Form.useForm();
  return (
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
        <Input placeholder="Enter username" />
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
        <Input.Password placeholder="Enter password" />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        rules={[
          {
            message: 'Please input confirm password!',
            required: true,
          },
        ]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>
    </Form>
  );
};
