import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TOKEN_KEY } from '../../common/constants';
import { SIGN_IN } from '../../redux/types/user.type';

export const SignIn = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    const { username, password } = values;
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation SignIn($username: String!, $password: String!) {
            signIn(data: { username: $username, password: $password }) {
              token
              data {
                _id
                username
                displayName
              }
            }
          }
        `,
        variables: {
          password,
          username,
        },
      });

      dispatch({
        payload: result.data.signIn.data,
        type: SIGN_IN,
      });

      localStorage.setItem(TOKEN_KEY, result.data.signIn.token);

      history.push('/');
    } catch (e) {
      message.error('Wrong username or password!');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="bg-gray-200 p-6 rounded shadow-md"
        style={{ width: '20rem' }}
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign in</h1>
        <Form
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                message: 'Please input your Username!',
                required: true,
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                message: 'Please input your Password!',
                required: true,
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <a href="">Forgot password</a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
