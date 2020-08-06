import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const UsersDeleteFeedbacksButton = ({ feedback, onSuccess }) => {
  const client = useApolloClient();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async () => {
    setConfirmLoading(true);

    const { _id } = feedback;
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation DeleteFeedbackByAdmin($_id: ID!) {
            deleteFeedbackByAdmin(_id: $_id) {
              _id
              content
            }
          }
        `,
        variables: {
          _id,
        },
      });
      message.success('Delete feedback successfully!');
      setVisible(false);
      // onSuccess(result?.data?.deleteFeedbackByAdmin);
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <div>
      <a className="whitespace-no-wrap" onClick={handleClick}>
        <EditOutlined />
        &nbsp;&nbsp;Delete
      </a>
      <Modal
        confirmLoading={confirmLoading}
        maskClosable={false}
        okText="Delete"
        onCancel={() => {
          setVisible(false);
        }}
        onOk={onFinish}
        title="Do you want delete this feedback?"
        visible={visible}
      >
        <Form layout="vertical" />
        <Form.Item label="Title" name="Title">
          {feedback.title}
        </Form.Item>
      </Modal>
    </div>
  );
};
