import { Button, Form, Input, Select } from 'antd';
import React, { useForm, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { USER_GENDERS } from '../common/constants';
import { CREATE_CUSTOMER } from '../redux/types/user.types';

export const UsersCreateCustomerStep1View = ({ customerData, onNext }) => {
  // const dispatch = useDispatch();
  // const customer = useSelector(state => state?.user?.customer);

  const onFinish = async values => {
    // customer.email = values.email;
    // customer.gender = values.gender;
    // customer.phone = values.phone;
    // customer.displayName = values.displayName;
    // dispatch({
    //   payload: customer,
    //   type: CREATE_CUSTOMER,
    // });
    onNext(values);
  };

  const handleOnNextClick = () => {
    form.submit();
  };

  const [form] = Form.useForm();
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
      <div className="flex justify-end">
        <Button onClick={handleOnNextClick} type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};
