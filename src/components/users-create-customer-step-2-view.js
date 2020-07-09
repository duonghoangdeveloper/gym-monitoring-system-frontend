import { Button } from 'antd';
import React from 'react';

export const UsersCreateCustomerStep2View = ({ onNext, onPrev }) => (
  <div>
    Step 2
    <div className="flex justify-end">
      <Button onClick={onPrev}>Previous</Button>
      <Button className="ml-2" onClick={onNext} type="primary">
        Next
      </Button>
    </div>
  </div>
);
