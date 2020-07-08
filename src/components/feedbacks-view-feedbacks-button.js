import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const UsersViewFeedbacksButton = ({ feedback }) => {
  const client = useApolloClient();
  const [visible, setVisible] = useState(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  return (
    <div>
      <a className="whitespace-no-wrap" onClick={handleClick}>
        {feedback.title}
      </a>
      <Modal
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          setVisible(false);
        }}
        title="Feedback"
        visible={visible}
      >
        <Form layout="vertical" />
        <Form.Item label="Title" name="Title">
          {feedback.title}
        </Form.Item>
        <Form.Item label="Content" name="Content">
          {feedback.content}
        </Form.Item>
      </Modal>
    </div>
  );
};
