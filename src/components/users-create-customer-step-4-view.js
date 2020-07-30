import { Button, Form, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

export const UsersCreateCustomerStep4View = ({
  customerData,
  onDone,
  onPrev,
}) => {
  const onFinish = () => {};
  return (
    <div>
      <div className="flex flex-col pt-2">
        <div className="flex mb-6">
          <span className="w-1/4 font-semibold">Username:</span>
          <span>{customerData.step3?.username ?? 'N/A'}</span>
        </div>

        <div className="flex mb-6">
          <span className="w-1/4 font-semibold">Password:</span>
          <span>{customerData.step3?.password ?? 'N/A'}</span>
        </div>

        <div className="flex mb-6">
          <span className="w-1/4 font-semibold">Email:</span>
          <span>{customerData.step1?.email ?? 'N/A'}</span>
        </div>

        <div className="flex mb-6">
          <span className="w-1/4 font-semibold">Name:</span>
          <span>{customerData.step1?.displayName ?? 'N/A'}</span>
        </div>

        <div className="flex mb-6">
          <span className="w-1/4 font-semibold">Phone:</span>
          <span>{customerData.step1?.phone ?? 'N/A'}</span>
        </div>

        <div className="flex mb-6">
          <span className="w-1/4 font-semibold">Gender:</span>
          <span>{customerData.step1?.gender ?? 'N/A'}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onPrev}>Previous</Button>
        <Button className="ml-2" onClick={onDone} type="primary">
          Create customer
        </Button>
      </div>
    </div>
  );
};
