import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useForm } from 'react';

export const UsersCreateCustomerStep3View = ({
  customerData,
  onNext,
  onPrev,
}) => {
  const [form] = Form.useForm();
  const client = useApolloClient();
  const onFinish = async values => {
    if (verifyPassword(values.password, values.confirmPassword)) {
      const { password, username } = values;
      try {
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
        console.log(result);
        if (
          !Object.keys(result.data.validateUser).some(
            key =>
              Array.isArray(result.data.validateUser[key]) &&
              result.data.validateUser[key].length > 0
          )
        ) {
          onNext(values);
        } else {
          addErrorToInputField(result.data.validateUser);
        }
      } catch (e) {
        message.error(`${e.message.split(': ')[1]}!`);
        console.log(e.message);
      }
    } else {
      message.error('Password and confirmed password do not match!');
    }
  };
  const addErrorToInputField = Errors => {
    if (Errors.username.length > 0)
      form.setFields([
        {
          errors: [Errors.username[0]],
          name: 'username',
        },
      ]);
    if (Errors.password.length > 0)
      form.setFields([
        {
          errors: [Errors.password[0]],
          name: 'password',
        },
      ]);
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
        <Button className="ml-2" onClick={handleOnNextClick} type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};
const verifyPassword = (password, comfirmPassword) =>
  password === comfirmPassword;
