import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';

export const UpdatePasswordButton = props => {
  const client = useApolloClient();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    console.log('ok');
    form.submit();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async values => {
    const { oldPassword, newPassword, confirmPassword } = values;
    console.log(values);

    if (confirmPassword !== newPassword) {
      message.error('Confirm password is not matched!');
    } else if (oldPassword === newPassword) {
      message.error('The old and new passwords can not be the same!');
    } else {
      try {
        await client.mutate({
          mutation: gql`
            mutation UpdatePassword(
              $oldPassword: String!
              $newPassword: String!
            ) {
              updatePassword(
                data: { oldPassword: $oldPassword, newPassword: $newPassword }
              ) {
                _id
                username
                displayName
              }
            }
          `,
          variables: {
            newPassword,
            oldPassword,
          },
        });
        message.success('Update password succeed!');
        setVisible(false);
      } catch (e) {
        message.error(`${e.message.split(': ')[1]}!`);
      }
    }
  };

  return (
    <>
      <Button onClick={showModal} {...props}>
        Reset Password
      </Button>
      <Modal
        title="Reset Password"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        className="select-none"
      >
        <Form onFinish={onFinish} layout="vertical" form={form}>
          <Form.Item
            label="Old password"
            name="oldPassword"
            rules={[{ message: 'Please input your password!', required: true }]}
          >
            <Input.Password placeholder="Enter your old password" />
          </Form.Item>

          <Form.Item
            label="New password"
            name="newPassword"
            rules={[{ message: 'Please input your password!', required: true }]}
          >
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            rules={[{ message: 'Please input your password!', required: true }]}
          >
            <Input.Password placeholder="Confirm your new password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
