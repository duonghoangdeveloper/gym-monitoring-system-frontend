import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Select,
  Step,
  Steps,
} from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { USER_GENDERS } from '../common/constants';
import { UsersCreateCustomerStep1 } from './users-create-customer-step-1';
import { UsersCreateCustomerStep3 } from './users-create-customer-step-3';

export const UsersCreateCustomerButton = () => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [current, setCurrent] = useState(0);
  const { Step } = Steps;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      content: <UsersCreateCustomerStep1 />,
      title: 'First',
    },
    {
      content: 'Second-content',
      title: 'Second',
    },
    {
      content: <UsersCreateCustomerStep3 />,
      title: 'Last',
    },
  ];
  const handleClick = () => {
    setVisible(true);
  };
  const onFinish = async values => {
    const { confirmPassword, password } = values;
    if (password !== confirmPassword) {
      message.error('Password and confirm password do not match!');
    } else {
      try {
        const { displayName, email, gender, phone, username } = values;
        await client.mutate({
          mutation: gql`
            mutation CreateUser(
              $username: String!
              $password: String!
              $gender: Gender!
              $displayName: String
              $phone: String
              $email: String
            ) {
              createUser(
                data: {
                  username: $username
                  password: $password
                  role: CUSTOMER
                  phone: $phone
                  displayName: $displayName
                  email: $email
                  gender: $gender
                }
              ) {
                displayName
                email
                gender
                phone
                role
                username
              }
            }
          `,
          variables: {
            displayName,
            email,
            gender,
            password,
            phone,
            username,
          },
        });
        message.success('Create user succeed.');
        setVisible(false);
      } catch (e) {
        message.error(`${e.message.split(': ')[1]}!`);
      }
    }
  };
  return (
    <>
      <Button icon={<PlusOutlined />} onClick={handleClick}>
        Create Customer
      </Button>
      <Modal
        className="select-none w-screen"
        maskClosable={false}
        okButtonProps={{
          disabled,
        }}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        title="Create User"
        visible={visible}
        width="700px"
      >
        <div>
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button onClick={next} type="primary">
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                onClick={() => message.success('Processing complete!')}
                type="primary"
              >
                Done
              </Button>
            )}
            {current > 0 && (
              <Button onClick={prev} style={{ margin: '0 8px' }}>
                Previous
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
