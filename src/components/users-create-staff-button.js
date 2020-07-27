import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { AUTH_ROLES, USER_GENDERS } from '../common/constants';

export const UsersCreateStaffButton = ({ children, onSuccess, ...props }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  const { role } = props;

  const onFinish = async values => {
    const { confirmPassword, password } = values;
    if (password !== confirmPassword) {
      message.error('Password and confirm password do not match!');
    } else {
      try {
        const { displayName, email, gender, phone, username } = values;
        await client.mutate({
          mutation: gql`
            mutation CreateUser(
              $username: String!
              $password: String!
              $gender: Gender!
              $displayName: String
              $phone: String
              $email: String
              $role: Role!
            ) {
              createUser(
                data: {
                  username: $username
                  password: $password
                  role: $role
                  phone: $phone
                  displayName: $displayName
                  email: $email
                  gender: $gender
                }
              ) {
                displayName
                email
                gender
                phone
                role
                username
              }
            }
          `,
          variables: {
            displayName,
            email,
            gender,
            password,
            phone,
            role,
            username,
          },
        });
        message.success('Create user succeeded!');
        setVisible(false);
        onSuccess();
      } catch (e) {
        message.error(`${e.message.split(': ')[1]}!`);
      }
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} {...props} onClick={handleClick}>
        {children}
      </Button>
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
        title={children}
        visible={visible}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
      </Modal>
    </>
  );
};
