import { SyncOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Select } from 'antd';
import gql from 'graphql-tag';
import { value } from 'numeral';
import React, { useEffect, useState } from 'react';

import { PAGE_SIZE } from '../common/constants';
import { hasError } from '../common/services';

export const UsersCreateCustomerStep3View = ({
  customerData,
  onNext,
  onPrev,
}) => {
  const [form] = Form.useForm();
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [currentPaymentPlan, setCurrentPaymentPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectLoading, setSelectLoading] = useState(false);
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
      values.paymentPlanName = paymentPlans.filter(
        ({ _id }) => _id.toString() === values.paymentPlan
      )[0].name;

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

  const fetchPaymentPlansData = async () => {
    setSelectLoading(true);
    try {
      const result = await client.query({
        query: gql`
          query paymentPlans($query: PaymentPlansQueryInput) {
            paymentPlans(query: $query) {
              data {
                _id
                name
                price
                period
              }
              total
            }
          }
        `,
        variables: {
          query: {},
          //  search,
        },
      });
      const fetchedPaymentPlansData = result?.data?.paymentPlans?.data ?? [];
      setPaymentPlans(
        fetchedPaymentPlansData.map((paymentPlan, index) => ({
          key: paymentPlan._id,
          no: index + 1,
          ...paymentPlan,
        }))
      );
    } catch (e) {
      message.error('Something went wrong :(');
    }
    setSelectLoading(false);
  };
  useEffect(() => {
    fetchPaymentPlansData();
  }, []);
  const handleOnNextClick = () => {
    form.submit();
  };
  const changePayment = value => {
    setCurrentPaymentPlan(
      paymentPlans.filter(({ _id }) => _id.toString() === value)
    );
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
        <Form.Item label="Choose a payment plan" name="paymentPlan">
          <Select
            allowClear
            loading={selectLoading}
            onChange={value => changePayment(value)}
            placeholder="Choose a payment plan"
          >
            {paymentPlans.map(({ _id, name }) => (
              <Select.Option key={_id} value={_id}>
                {name}
              </Select.Option>
            ))}
            ]}
          </Select>
        </Form.Item>
      </Form>
      {currentPaymentPlan[0] ? (
        <div className="flex flex-col pt-2">
          <div className="flex mb-6">
            <span className="w-1/4 font-semibold">Period:</span>
            <span>{currentPaymentPlan[0].period ?? 'N/A'}</span>
          </div>

          <div className="flex mb-6">
            <span className="w-1/4 font-semibold">Price:</span>
            <span>{currentPaymentPlan[0].price ?? 'N/A'}</span>
          </div>
        </div>
      ) : (
        <div />
      )}
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
