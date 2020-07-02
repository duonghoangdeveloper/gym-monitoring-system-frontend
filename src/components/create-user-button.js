import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { AUTH_ROLES, USER_GENDERS } from '../common/constants';

export const CreateUserButton = () => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      // Do something
    } else {
      try {
        setTimeout(() => form.resetFields(), 500);
      } catch (_) {
        // Do nothing
      }
    }
  }, [visible]);
  // const onValuesChange = (_, allValues) => {
  //   setDisabled(
  //       allValues.username &&
  //       allValues.phone &&
  //       allValues.displayName &&
  //       allValues.gender &&
  //       allValues.email
  //   );
  // };

  const onFinish = async values => {
    const { confirmPassword, password } = values;
    if (password !== confirmPassword) {
      message.error("Password and confirm password is doesn't match!!!");
    } else {
      try {
        const { displayName, email, gender, phone, role, username } = values;
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
        message.success('Update profile succeed!');
        setVisible(false);
      } catch (e) {
        console.log(e.message);
        message.error(`${e.message.split(': ')[1]}!`);
      }
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={handleClick}>
        Create Customer
      </Button>
      <Modal
        className="select-none"
        maskClosable={false}
        okButtonProps={{
          disabled,
        }}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        title="Create User"
        visible={visible}
      >
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
            name="confirm Password"
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
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select role">
              {AUTH_ROLES.map(role => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
