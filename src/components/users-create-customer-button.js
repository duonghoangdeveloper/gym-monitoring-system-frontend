import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, message, Modal, Steps } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

import { base64ToFile } from '../common/services';
import { UsersCreateCustomerStep1View } from './users-create-customer-step-1-view';
import { UsersCreateCustomerStep2View } from './users-create-customer-step-2-view';
import { UsersCreateCustomerStep3View } from './users-create-customer-step-3-view';
import { UsersCreateCustomerStep4View } from './users-create-customer-step-4-view';

export const UsersCreateCustomerButton = ({ onSuccess, ...rest }) => {
  const client = useApolloClient();
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [customerData, setCustomerData] = useState(INITIAL_CUSTOMER_DATA);

  useEffect(() => {
    if (!visible) {
      const timeoutId = setTimeout(() => {
        setCustomerData(INITIAL_CUSTOMER_DATA);
        if (currentStep !== 1) {
          setCurrentStep(0);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [visible]);

  const handleClick = () => {
    setVisible(true);
  };

  const createCustomer = async () => {
    try {
      const { displayName, email, gender, phone } = customerData.step1;
      const { password, username } = customerData.step3;

      const base64Faces = (customerData.step2 || [])
        .filter(sameAngleFaces => sameAngleFaces.length > 0)
        .map(sameAngleFaces => sameAngleFaces[sameAngleFaces.length - 1]);

      if (base64Faces.length === 9) {
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
              faces: base64Faces.map(base64 => base64ToFile(base64)),
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
      } else {
        message.error('Not enough 9 registered face images!');
      }
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
            onNext={faces => {
              setCustomerData({
                ...customerData,
                step2: faces,
              });
              setCurrentStep(2);
            }}
            onPrev={faces => {
              setCustomerData({
                ...customerData,
                step2: faces,
              });
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
            onDone={createCustomer}
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
        footer={null}
        maskClosable={false}
        onCancel={() => setVisible(false)}
        title="Create Customer"
        visible={visible}
        width={640}
      >
        <div>
          <Steps current={currentStep}>
            <Steps.Step title="Info" />
            <Steps.Step title="Face ID" />
            <Steps.Step title="Auth" />
            <Steps.Step title="Review" />
          </Steps>
          <div className="mt-6">{generateStepView(currentStep)}</div>
        </div>
      </Modal>
    </>
  );
};

const INITIAL_CUSTOMER_DATA = {
  step1: {},
  step2: null,
  step3: {},
};
