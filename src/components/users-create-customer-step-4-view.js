import { Button, Form, Input, Select } from 'antd';
import React, { useForm } from 'react';
import { useSelector } from 'react-redux';

import { USER_GENDERS } from '../common/constants';

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
        initialValues={{
          displayName: customerData.step1.displayName,
          email: customerData.step1.email,
          gender: customerData.step1.gender,
          password: customerData.step3.password,
          phone: customerData.step1.phone,
          username: customerData.step3.username,
        }}
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
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item label="Name" name="displayName">
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone" />
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
          <Input placeholder="Enter Gender" />
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
