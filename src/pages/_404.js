import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const _404 = () => {
  const history = useHistory();

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Result
        extra={
          <>
            <Button onClick={() => history.goBack()} type="primary">
              Go Back
            </Button>
            <Button onClick={() => history.push('/')} type="primary">
              Go Home
            </Button>
          </>
        }
        status="404"
        subTitle="Sorry, the page you visited does not exist."
        title="404"
      />
      ,
    </div>
  );
};
