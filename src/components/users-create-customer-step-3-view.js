import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';

import { hasError } from '../common/services';

export const UsersCreateCustomerStep3View = ({
  customerData,
  onNext,
  onPrev,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();
  const onFinish = async values => {
    const { confirmPassword, password, username } = values;
    if (password === confirmPassword) {
      try {
        setLoading(true);
        const result = await client.query({
          query: gql`
            query ValidateUser($data: ValidateUserInput) {
              validateUser(data: $data) {
                username
                password
              }
            }
          `,
          variables: {
            data: {
              password,
              username,
            },
          },
        });

        if (!hasError(result.data.validateUser)) {
          onNext(values);
        } else {
          addErrorsToForm(result.data.validateUser);
          setLoading(false);
        }
      } catch (e) {
        message.error(`${e.message.split(': ')[1]}!`);
        setLoading(false);
      }
    } else {
      message.error('Password and confirmed password do not match!');
    }
  };
  const addErrorsToForm = errors => {
    Object.keys(errors).forEach(key => {
      if (Array.isArray(errors[key]) && errors[key]?.length > 0)
        form.setFields([
          {
            errors: [errors[key][0]],
            name: key,
          },
        ]);
    });
  };

  const handleOnNextClick = () => {
    form.submit();
  };
  return (
    <div>
      <Form
        form={form}
        initialValues={{
          confirmPassword: customerData.step3?.password
            ? customerData.step3?.password
            : null,
          password: customerData.step3?.password,
          username: customerData.step3?.username,
        }}
        layout="vertical"
        onFinish={onFinish}
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

      <div className="flex justify-end">
        <Button onClick={onPrev}>Previous</Button>
        <Button
          className="ml-2"
          loading={loading}
          onClick={handleOnNextClick}
          type="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
