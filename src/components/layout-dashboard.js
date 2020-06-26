import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { TOKEN_KEY } from '../common/constants';
import { SIGN_OUT } from '../redux/types/user.type';

export const LayoutDashboard = ({ children }) => {
  const username = useSelector(state => state.user?.me?.username);
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSignOutClick = async () => {
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

    dispatch({
      type: SIGN_OUT,
    });
    localStorage.removeItem(TOKEN_KEY);
    history.push('/');
  };

  return (
    <Layout>
      <Layout.Sider
        trigger={null}
        collapsible
        width={256}
        className="bg-red-500 min-h-screen"
      >
        <div className="text-white text-2xl px-6 h-16 flex items-center">
          eGMS
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            nav 3
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <div className="flex-1">
        <div className="h-16 bg-white w-full shadow z-50 flex items-center px-4">
          Header
          <div className="flex-1" />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => history.push('/profile')}>
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={handleSignOutClick}>Sign out</Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <div className="flex items-center cursor-pointer">
              <div>{username}</div>
              <div className="ml-2 mr-1">
                <Avatar shape="square" icon={<UserOutlined />} />
              </div>
              <DownOutlined
                className="text-xs"
                style={{ fontSize: '0.6rem' }}
              />
            </div>
          </Dropdown>
        </div>
        <div className="pt-6" style={{ minHeight: 'calc(100vh - 4rem)' }}>
          {children}
        </div>
      </div>
    </Layout>
  );
};
