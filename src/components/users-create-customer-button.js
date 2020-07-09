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
import { UsersCreateCustomerStep1View } from './users-create-customer-step-1-view';
import { UsersCreateCustomerStep2View } from './users-create-customer-step-2-view';
import { UsersCreateCustomerStep3View } from './users-create-customer-step-3-view';
import { UsersCreateCustomerStep4View } from './users-create-customer-step-4-view';

export const UsersCreateCustomerButton = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const [user: {}, setUser] = useState();

  const handleClick = () => {
    setVisible(true);
  };

  const generateStepView = step => {
    switch (step) {
      case 0:
        return (
          <UsersCreateCustomerStep1View
            onNext={() => {
              setCurrentStep(1);
              // Do something
              // setStep1Data
            }}
          />
        );
      case 1:
        return (
          <UsersCreateCustomerStep2View
            onNext={() => {
              setCurrentStep(2);
              // Do something
              // setStep2Data
            }}
            onPrev={() => {
              setCurrentStep(0);
              // Do something
            }}
          />
        );
      case 2:
        return (
          <UsersCreateCustomerStep3View
            onNext={() => {
              setCurrentStep(3);
              // Do something
              // setStep3Data
              // Combine 3 steps & submit data
            }}
            onPrev={() => {
              setCurrentStep(1);
              // Do something
            }}
          />
        );
      case 3:
        return (
          <UsersCreateCustomerStep4View
            onDone={() => {
              // Do something
              // setStep3Data
              // Combine 3 steps & submit data
            }}
            onPrev={() => {
              setCurrentStep(2);
              // Do something
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={handleClick}>
        Create Customer
      </Button>
      <Modal
        className="select-none w-screen"
        footer={null}
        maskClosable={false}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        title="Create User"
        visible={visible}
        width="700px"
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
