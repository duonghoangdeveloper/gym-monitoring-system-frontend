import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, Layout, message, Typography } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TOKEN_KEY } from '../common/constants';
import eGMS from '../images/eGMSnoText.png';
import { SIGN_IN } from '../redux/user/user.types';

export const SignIn = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const onFinish = async values => {
    const { password, username } = values;
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
                role
                avatar {
                  url
                }
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
      setLoading(false);
    }
  };

  return (
    <div className="-space-y-20 ">
      <div
        className="flex justify-center items-center min-h-screen bg-gray-200"
        style={{}}
      >
        <div
          className="p-6 rounded bg-white shadow-md"
          style={{ width: '25rem' }}
        >
          <div className="mb-12 -space-y-2 ">
            <span className="flex justify-center items-center">
              <img
                alt="logo GMS"
                src={eGMS}
                style={{ marginBottom: 4 }}
                width={70}
              />
              <h1 className="text-4xl font-semibold  text-center">eGMS</h1>
            </span>

            <Typography.Paragraph className="text-center italic font-serif ">
              Gym monitoring system website
            </Typography.Paragraph>
          </div>

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
                placeholder="Username"
                prefix={<UserOutlined className="site-form-item-icon" />}
                style={{ height: '2.5rem' }}
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
                placeholder="Password"
                prefix={<LockOutlined className="site-form-item-icon" />}
                style={{ height: '2.5rem' }}
                type="password"
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <a href="">Forgot password</a>
            </Form.Item>

            <Form.Item>
              <Button
                className="w-full"
                htmlType="submit"
                loading={loading}
                style={{ height: '2.5rem' }}
                type="primary"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="inset-x-0.bottom-0 ">
        <Layout.Footer style={{ textAlign: 'center' }}>
          eGMS ©2020 Created by D3T
        </Layout.Footer>
      </div>
    </div>
  );
};
const tailLayout = {
  wrapperCol: { offset: 16, span: 16 },
};
