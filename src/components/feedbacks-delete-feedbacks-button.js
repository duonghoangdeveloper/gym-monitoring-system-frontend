import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const UsersDeleteFeedbacksButton = ({ feedback }) => {
  const client = useApolloClient();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async () => {
    setConfirmLoading(true);
    // setTimeout(() => {
    //   this.setState({
    //     confirmLoading: false,
    //     visible: false,
    //   });
    // }, 2000);
    const { _id } = feedback;
    try {
      await client.mutate({
        mutation: gql`
          mutation DeleteFeedbackByAdmin($_id: ID!) {
            deleteFeedbackByAdmin(_id: $_id) {
              _id
              title
            }
          }
        `,
        variables: {
          _id,
        },
      });
      message.success('Delete feedback successfully!');
      setVisible(false);
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
