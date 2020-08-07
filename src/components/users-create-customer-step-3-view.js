import { SyncOutlined } from '@ant-design/icons';
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
    const { password, username } = values;
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
          password: customerData.step3?.password || generateRandomString(10),
          username: customerData.step3?.username || generateRandomString(10),
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
          <Input
            addonAfter={
              <SyncOutlined
                onClick={() => {
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    username: generateRandomString(10),
                  });
                }}
              />
            }
            allowClear
            placeholder="Enter username"
          />
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
          <Input
            addonAfter={
              <SyncOutlined
                onClick={() => {
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    password: generateRandomString(10),
                  });
                }}
              />
            }
            allowClear
            placeholder="Enter password"
          />
        </Form.Item>
      </Form>

      <div className="flex justify-end">
        <Button className="ml-2" onClick={onPrev}>
          Previous
        </Button>
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

const generateRandomString = length => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return new Array(length)
    .fill()
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
};
