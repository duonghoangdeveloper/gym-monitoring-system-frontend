import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { formItemLayout, tailFormItemLayout } from '../../common/antd';
import { LayoutDashboard } from '../../components/layout-dashboard';
import { UPDATE_PROFILE } from '../../redux/types/user.type';

export const Profile = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

  const onFinish = async values => {
    const { username } = values;

    try {
      const result = await client.mutate({
        mutation: gql`
          mutation UpdateProfile($username: String!) {
            updateProfile(data: { username: $username }) {
              _id
              username
            }
          }
        `,
        variables: {
          username,
        },
      });

      dispatch({
        payload: result.data.updateProfile,
        type: UPDATE_PROFILE,
      });

      message.success('Update profile succeed!');
    } catch (e) {
      message.error('Wrong username or password!');
    }
  };

  const me = useSelector(state => state?.user?.me);

  return (
    <LayoutDashboard>
      <Form
        onFinish={onFinish}
        initialValues={{
          _id: me._id,
          username: me.username,
        }}
        {...formItemLayout}
      >
        <Form.Item {...tailFormItemLayout}>
          <h1 className="text-3xl mb-0">Update profile</h1>
        </Form.Item>
        <Form.Item name="_id" label="User ID">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              message: 'Please input your username!',
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update profile
          </Button>
        </Form.Item>
      </Form>
    </LayoutDashboard>
  );
};
