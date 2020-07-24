import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Select } from 'antd';
import gql from 'graphql-tag';
import React from 'react';

import { USER_GENDERS } from '../common/constants';

export const UsersCreateCustomerStep1View = ({ customerData, onNext }) => {
  const client = useApolloClient();
  // add loading
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
      console.log(e.message);
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  const handleOnNextClick = () => {
    form.submit();
  };

  const [form] = Form.useForm();

  // need to optimize
  const addErrorToInputField = errors => {
    if (errors.email?.length > 0)
      form.setFields([
        {
          errors: [errors.email[0]],
          name: 'email',
        },
      ]);
    if (errors.displayName?.length > 0)
      form.setFields([
        {
          errors: [errors.displayName[0]],
          name: 'displayName',
        },
      ]);
    if (errors.phone?.length > 0)
      form.setFields([
        {
          errors: [errors.phone[0]],
          name: 'phone',
        },
      ]);
    if (errors.gender?.length > 0)
      form.setFields([
        {
          errors: [errors.gender[0]],
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
        <Button onClick={handleOnNextClick} type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};
