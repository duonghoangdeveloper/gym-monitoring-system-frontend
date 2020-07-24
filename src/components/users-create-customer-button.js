import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, message, Modal, Steps } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';

import { UsersCreateCustomerStep1View } from './users-create-customer-step-1-view';
import { UsersCreateCustomerStep2View } from './users-create-customer-step-2-view';
import { UsersCreateCustomerStep3View } from './users-create-customer-step-3-view';
import { UsersCreateCustomerStep4View } from './users-create-customer-step-4-view';

export const UsersCreateCustomerButton = ({ onSuccess, ...rest }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [customerData, setCustomerData] = useState({
    step1: {},
    step2: {},
    step3: {},
  });

  const handleClick = () => {
    setVisible(true);
  };
  const createCustomer = async () => {
    try {
      const { displayName, email, gender, phone } = customerData.step1;
      const { password, username } = customerData.step3;

      await client.mutate({
        mutation: gql`
          mutation CreateUser($data: CreateUserInput!) {
            createUser(data: $data) {
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
          data: {
            displayName,
            email,
            gender,
            password,
            phone,
            role: 'CUSTOMER',
            username,
          },
        },
      });
      message.success('Create customer succeeded!');
      setVisible(false);
      onSuccess();
    } catch (e) {
      const msg = e.message.split(': ')[1] ?? e.message;
      message.error(`${msg}!`);
    }
  };

  const generateStepView = step => {
    switch (step) {
      case 0:
        return (
          <UsersCreateCustomerStep1View
            customerData={customerData}
            onNext={values => {
              setCustomerData({
                ...customerData,
                step1: values,
              });
              setCurrentStep(1);
            }}
          />
        );
      case 1:
        return (
          <UsersCreateCustomerStep2View
            customerData={customerData}
            onNext={() => {
              setCurrentStep(2);
            }}
            onPrev={() => {
              setCurrentStep(0);
            }}
          />
        );
      case 2:
        return (
          <UsersCreateCustomerStep3View
            customerData={customerData}
            onNext={values => {
              setCustomerData({
                ...customerData,
                step3: values,
              });
              setCurrentStep(3);
            }}
            onPrev={() => {
              setCurrentStep(1);
            }}
          />
        );
      case 3:
        return (
          <UsersCreateCustomerStep4View
            customerData={customerData}
            onDone={() => {
              createCustomer();
            }}
            onPrev={() => {
              setCurrentStep(2);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} {...rest} onClick={handleClick}>
        Create Customer
      </Button>
      <Modal
        className="select-none"
        footer={null}
        maskClosable={false}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        title="Create Customer"
        visible={visible}
        width={640}
      >
        <div>
          <Steps current={currentStep}>
            {steps.map(item => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="mt-6">{generateStepView(currentStep)}</div>
        </div>
      </Modal>
    </>
  );
};

const steps = [
  {
    title: 'Step 1',
  },
  {
    title: 'Step 2',
  },
  {
    title: 'Step 3',
  },
  {
    title: 'Step 4',
  },
];
