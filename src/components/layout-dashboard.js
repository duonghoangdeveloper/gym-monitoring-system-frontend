import {
  DownOutlined,
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Avatar, Dropdown, Layout, Menu, Spin } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TOKEN_KEY } from '../common/constants';
import { SIGN_OUT } from '../redux/types/user.type';

export const LayoutDashboard = ({ children }) => {
  const username = useSelector(state => state.user?.me?.username);
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

  // const [signOutloading, setSignOutLoading] = useState(false);

  const handleSignOutClick = async () => {
    // setSignOutLoading(true);

    try {
      await client.mutate({
        mutation: gql`
          mutation {
            signOut {
              _id
            }
          }
        `,
      });
    } catch (_) {
      // Do nothing
    }

    // setSignOutLoading(false);
    dispatch({
      type: SIGN_OUT,
    });
    localStorage.removeItem(TOKEN_KEY);
    history.push('/');
  };

  return (
    <Layout>
      <Layout.Sider
        className="min-h-screen"
        collapsible
        trigger={null}
        width={256}
      >
        <div className="text-white text-2xl px-6 h-16 flex items-center">
          <a
            className="cursor-pointer text-white"
            onClick={() => history.push('/')}
          >
            eGMS
          </a>
        </div>
        <Menu defaultSelectedKeys={['1']} mode="inline" theme="dark">
          <Menu.Item
            icon={<UserOutlined />}
            key="users"
            onClick={() => history.push('/users')}
          >
            User Management
          </Menu.Item>
          <Menu.Item
            icon={<UserOutlined />}
            key="customers"
            onClick={() => history.push('/customers')}
          >
            Customer Management
          </Menu.Item>
          <Menu.Item icon={<UserOutlined />} key="3">
            Report
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <div className="flex-1">
        <div className="h-16 bg-white w-full shadow z-50 flex items-center px-6">
          Header
          <div className="flex-1" />
          <div>{username}</div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => history.push('/profile')}>
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={handleSignOutClick}>
                  Sign out
                  {/* {signOutloading && (
                    <>
                      &nbsp;&nbsp;
                      <Spin indicator={<LoadingOutlined spin />} />
                    </>
                  )} */}
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <div className="flex items-center cursor-pointer">
              <div className="mx-2">
                <Avatar icon={<UserOutlined />} shape="square" />
              </div>
              <DownOutlined
                className="text-xs"
                style={{ fontSize: '0.6rem' }}
              />
            </div>
          </Dropdown>
        </div>
        <div className="p-6" style={{ minHeight: 'calc(100vh - 4rem)' }}>
          {children}
        </div>
      </div>
    </Layout>
  );
};
