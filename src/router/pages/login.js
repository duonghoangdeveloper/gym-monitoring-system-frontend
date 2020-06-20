import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Button, Form, Input } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SIGN_IN } from '../../redux/types/user.type';

export const Login = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();

  const [signIn, { loading }] = useMutation(
    gql`
      mutation {
        signIn(data: { username: "duonghoang", password: "123456" }) {
          data {
            _id
            displayName
          }
          token
        }
      }
    `,
    {
      onCompleted: () => {},
      onError: () => {},
    }
  );

  const onFinish = async values => {
    // const { username ,password } =  values
    const result = await client.mutate({
      mutation: gql`
        mutation {
          signIn(data: { username: "duonghoang", password: "123456" }) {
            data {
              _id
              displayName
            }
            token
          }
        }
      `,
    });

    dispatch({
      payload: result.data.signIn.data,
      type: SIGN_IN,
    });
  };

  // const onFinish = async values => {
  //   // // const { username ,password } =  values
  //   // const result = await client.mutate({
  //   //   mutation: gql`
  //   //     mutation {
  //   //       signIn(data: { username: "duonghoang", password: "123456" }) {
  //   //         data {
  //   //           _id
  //   //           displayName
  //   //         }
  //   //         token
  //   //       }
  //   //     }
  //   //   `,
  //   // });
  //   // dispatch({
  //   //   payload: result.data.signIn.data,
  //   //   type: SIGN_IN,
  //   // });
  // };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="bg-gray-200 p-6 rounded shadow-md"
        style={{ width: '20rem' }}
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Sign in</h1>
        <Form
          name="normal_login"
          className="login-form"
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
            <Button type="primary" htmlType="submit" className="w-full">
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
