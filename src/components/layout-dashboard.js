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
import { useHistory, useLocation } from 'react-router-dom';

import { TOKEN_KEY } from '../common/constants';
import { TOGGLE_COLLAPSED } from '../redux/types/common.types';
import { SIGN_OUT } from '../redux/types/user.types';

export const LayoutDashboard = ({ children }) => {
  const location = useLocation();
  const username = useSelector(state => state.user?.me?.username);
  const collapsed = useSelector(
    state => state.common?.sider?.collapsed ?? false
  );
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

  const SIDER_MENU = [
    {
      children: [
        {
          icon: <UserOutlined />,
          key: 'staff',
          onClick: () => history.push('/staffs'),
          title: 'Staff',
        },
        {
          icon: <UserOutlined />,
          key: 'customer',
          onClick: () => history.push('/customers'),
          title: 'Customer',
        },
      ],
      icon: <UserOutlined />,
      key: 'user-management',
      title: 'User management',
    },
  ];

  return (
    <Layout>
      <Layout.Sider
        className="min-h-screen"
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={256}
      >
        <div className="text-white text-2xl px-6 h-16 flex items-center">
          <a
            className="cursor-pointer text-white flex items-center"
            onClick={() => history.push('/')}
          >
            <div className="bg-blue-500 w-8 h-8" />
            {!collapsed && <div className="ml-4">eGMS</div>}
          </a>
        </div>
        <Menu
          defaultOpenKeys={[getOpenKeys(location.pathname)]}
          defaultSelectedKeys={[getSelectedKey(location.pathname)]}
          inlineCollapsed
          mode="inline"
          theme="dark"
        >
          {SIDER_MENU.map(submenu => (
            <Menu.SubMenu
              icon={submenu.icon}
              key={submenu.key}
              title={submenu.title}
            >
              {submenu.children.map(menu => (
                <Menu.Item
                  icon={menu.icon}
                  key={menu.key}
                  onClick={menu.onClick}
                >
                  {menu.title}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </Layout.Sider>
      <div className="flex-1 w-0">
        <div className="h-16 bg-white w-full shadow z-50 flex items-center px-6">
          <div
            className="text-xl flex items-center cursor-pointer"
            onClick={() =>
              dispatch({
                type: TOGGLE_COLLAPSED,
              })
            }
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div className="flex-1" />
          <div>{username}</div>
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

const getOpenKeys = pathname =>
  /^\/staffs/.test(pathname) || /^\/customers/.test(pathname)
    ? 'user-management'
    : null;

const getSelectedKey = pathname =>
  /^\/staffs/.test(pathname)
    ? 'staffs'
    : /^\/customers/.test(pathname)
    ? 'customers'
    : null;
