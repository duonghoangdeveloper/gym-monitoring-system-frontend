import { Button, Form, Input, message, Select } from 'antd';
import React, { useForm } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CREATE_CUSTOMER } from '../redux/types/user.types';

export const UsersCreateCustomerStep3View = ({
  customerData,
  onNext,
  onPrev,
}) => {
  const [form] = Form.useForm();
  // const dispatch = useDispatch();
  // const customer = useSelector(state => state?.user?.customer);
  const onFinish = async values => {
    if (verifyPassword(values.password, values.confirmPassword)) {
      // customer.username = values.username;
      // customer.password = values.password;
      // dispatch({
      //   payload: customer,
      //   type: CREATE_CUSTOMER,
      // });
      onNext(values);
    } else {
      message.error('Password and confirmed password do not match!');
    }
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
        // onValuesChange={onValuesChange}
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
