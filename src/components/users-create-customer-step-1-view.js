import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Select } from 'antd';
import gql from 'graphql-tag';
import React from 'react';

import { USER_GENDERS } from '../common/constants';

export const UsersCreateCustomerStep1View = ({ customerData, onNext }) => {
  const client = useApolloClient();
  const onFinish = async values => {
    const { displayName, email, gender, phone } = values;
    try {
      const result = await client.query({
        query: gql`
          query ValidateUser($data: ValidateUserInput) {
            validateUser(data: $data) {
              displayName
              email
              phone
              gender
            }
          }
        `,
        variables: {
          data: {
            displayName,
            email,
            gender,
            phone,
          },
        },
      });
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
  };

  const handleOnNextClick = () => {
    form.submit();
  };

  const [form] = Form.useForm();

  const addErrorToInputField = Errors => {
    if (Errors.email.length > 0)
      form.setFields([
        {
          errors: [Errors.email[0]],
          name: 'email',
        },
      ]);
    if (Errors.displayName.length > 0)
      form.setFields([
        {
          errors: [Errors.displayName[0]],
          name: 'displayName',
        },
      ]);
    if (Errors.phone.length > 0)
      form.setFields([
        {
          errors: [Errors.phone[0]],
          name: 'phone',
        },
      ]);
    if (Errors.gender.length > 0)
      form.setFields([
        {
          errors: [Errors.gender[0]],
          name: 'gender',
        },
      ]);
  };
  return (
    <div>
      <Form
        form={form}
        initialValues={{
          displayName: customerData.step1?.displayName,
          email: customerData.step1?.email,
          gender: customerData.step1?.gender,
          phone: customerData.step1?.phone,
        }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              message: 'Email is invalid',
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
        <Button onClick={handleOnNextClick} type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};
