import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Form, Input, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { USER_GENDERS } from '../common/constants';

export const UsersUpdateStaffButton = ({ onSuccess, user }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async values => {
    if (!values.displayName) {
      values.displayName = 'No name';
    }
    if (!values.phone) {
      values.phone = '0';
    }

    const { displayName, email, gender, phone, username } = values;
    const { _id } = user;
    try {
      await client.mutate({
        mutation: gql`
          mutation DeactivateUser(
            $_id: ID!
            $username: String!
            $displayName: String
            $gender: Gender!
            $email: String
            $phone: String
          ) {
            deactivateUser(
              data: {
                username: $username
                displayName: $displayName
                gender: $gender
                email: $email
                phone: $phone
              }
              _id: $_id
            ) {
              _id
              username
              displayName
              gender
              email
              phone
            }
          }
        `,
        variables: {
          _id,
          displayName,
          email,
          gender,
          phone,
          username,
        },
      });
      message.success('Update profile succeeded!');
      setVisible(false);
      onSuccess();
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  const onValuesChange = (_, allValues) => {
    setDisabled(
      allValues.username === user.username &&
        allValues.phone === user.phone &&
        allValues.displayName === user.displayName &&
        allValues.gender === user.gender &&
        allValues.email === user.email
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
        title="Update user"
        visible={visible}
      >
        <Form
          form={form}
          initialValues={{
            displayName: user.displayName,
            email: user.email,
            gender: user.gender,
            phone: user.phone,
            username: user.username,
          }}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
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
          <Form.Item label="Gender" name="gender">
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
