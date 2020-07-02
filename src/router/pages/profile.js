import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { formItemLayout, tailFormItemLayout } from '../../common/antd';
import { LayoutDashboard } from '../../components/layout-dashboard';
import { UpdatePasswordButton } from '../../components/update-password-button';
import { UPDATE_PROFILE } from '../../redux/types/user.type';

export const Profile = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

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

      message.success('Update profile succeed!');
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }

    setLoading(false);
  };

  const me = useSelector(state => state?.user?.me);

  return (
    <LayoutDashboard>
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
        <Form.Item {...tailFormItemLayout}>
          <Button htmlType="submit" loading={loading} type="primary">
            Update profile
          </Button>
          <UpdatePasswordButton className="ml-4" />
        </Form.Item>
      </Form>
    </LayoutDashboard>
  );
};
