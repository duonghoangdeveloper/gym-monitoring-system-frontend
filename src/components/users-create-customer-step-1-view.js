import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';

import { USER_GENDERS } from '../common/constants';
import { hasError } from '../common/services';

export const UsersCreateCustomerStep1View = ({ customerData, onNext }) => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const onFinish = async values => {
    const { displayName, email, gender, phone } = values;
    try {
      setLoading(true);
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

      if (!hasError(result.data.validateUser)) {
        onNext(values);
      } else {
        addErrorsToForm(result.data.validateUser);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  const handleOnNextClick = () => {
    form.submit();
  };

  const [form] = Form.useForm();

  // need to optimize
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
        <Form.Item label="Email" name="email">
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
      <div className="flex justify-end">
        <Button loading={loading} onClick={handleOnNextClick} type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};
