import { Button, Form, Input, Select } from 'antd';
import React, { useForm } from 'react';

import { USER_GENDERS } from '../common/constants';

export const UsersCreateCustomerStep4View = ({ onDone, onPrev }) => {
  const onFinish = () => {};
  const [form] = Form.useForm();
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
          <Select placeholder="Select gender">
            {USER_GENDERS.map(gender => (
              <Select.Option key={gender} value={gender}>
                {gender}
              </Select.Option>
            ))}
          </Select>
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
