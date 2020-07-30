import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { formItemLayout, tailFormItemLayout } from '../common/antd';
import { LayoutDashboard } from '../components/layout-dashboard';
import { ProfileAvatar } from '../components/profile-avatar';
import { UpdatePasswordButton } from '../components/profile-update-password-button';
import { UPDATE_PROFILE } from '../redux/user/user.types';

export const Profile = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    const { displayName, username } = values;
    setLoading(true);

    try {
      const result = await client.mutate({
        mutation: gql`
          mutation UpdateProfile($username: String!, $displayName: String!) {
            updateProfile(
              data: { username: $username, displayName: $displayName }
            ) {
              _id
              username
              displayName
            }
          }
        `,
        variables: {
          displayName,
          username,
        },
      });

      dispatch({
        payload: result.data.updateProfile,
        type: UPDATE_PROFILE,
      });

      message.success('Update profile succeeded!');
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }

    setLoading(false);
  };

  const me = useSelector(state => state?.user?.me);

  return (
    <LayoutDashboard>
      <div className="bg-white shadow p-6 rounded-sm">
        <Form
          initialValues={{
            _id: me._id,
            displayName: me.displayName,
            username: me.username,
          }}
          onFinish={onFinish}
          {...formItemLayout}
        >
          <Form.Item {...tailFormItemLayout}>
            <h1 className="text-3xl mb-0">Update profile</h1>
          </Form.Item>
          <Form.Item label="User ID" name="_id">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                message: 'Please input your username!',
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Display Name"
            name="displayName"
            rules={[
              {
                message: 'Please input display name!',
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Avatar">
            <ProfileAvatar />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button htmlType="submit" loading={loading} type="primary">
              Update profile
            </Button>
            <UpdatePasswordButton className="ml-2" />
          </Form.Item>
        </Form>
      </div>
    </LayoutDashboard>
  );
};
