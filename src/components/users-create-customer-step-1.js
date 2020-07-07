import { Button, Form, Input, Select } from 'antd';
import React, { useForm } from 'react';

import { USER_GENDERS } from '../common/constants';

export const UsersCreateCustomerStep1 = () => {
  const onFinish = () => {};
  const [form] = Form.useForm();
  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
    </>
  );
};
