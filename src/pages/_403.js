import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const _403 = () => {
  const history = useHistory();

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Result
        extra={
          <>
            <Button onClick={() => history.go(-2)} type="primary">
              Go Back
            </Button>
            <Button onClick={() => history.push('/')} type="primary">
              Go Home
            </Button>
          </>
        }
        status="403"
        subTitle="Sorry, you are not authorized to access this page."
        title="403"
      />
      ,
    </div>
  );
};
