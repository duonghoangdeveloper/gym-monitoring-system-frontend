import {
  DownOutlined,
  FolderAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { TOKEN_KEY } from '../common/constants';
import { SET_OPEN_KEYS, TOGGLE_COLLAPSED } from '../redux/types/common.types';
import { SIGN_OUT } from '../redux/types/user.types';

export const LayoutDashboard = ({ children }) => {
  const location = useLocation();
  const username = useSelector(state => state.user?.me?.username);
  const collapsed = useSelector(
    state => state.common?.sider?.collapsed ?? false
  );
  const openKeys = useSelector(state => state.common?.sider?.openKeys ?? []);
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

  const SIDER_MENU = [
    {
      children: [
        {
          icon: <UserOutlined />,
          key: 'staffs',
          onClick: () => history.push('/staffs'),
          title: 'Staff',
        },
        {
          icon: <UserOutlined />,
          key: 'customers',
          onClick: () => history.push('/customers'),
          title: 'Customer',
        },
      ],
      icon: <UserOutlined />,
      key: 'user-management',
      title: 'User Management',
    },
    {
      icon: <FolderAddOutlined />,
      key: 'packages',
      onClick: () => history.push('/packages'),
      title: 'Packages',
    },
    {
      icon: <VideoCameraOutlined />,
      key: 'cameras',
      onClick: () => history.push('/cameras'),
      title: 'Cameras',
    },
  ];

  return (
    <Layout>
      <Layout.Sider
        className="min-h-screen"
        collapsed={collapsed}
        collapsible
        style={{
          boxShadow: '2px 0 6px rgba(0,21,41,.35)',
        }}
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
          mode="inline"
          onOpenChange={keys =>
            console.log(keys) ||
            dispatch({
              payload: {
                openKeys: keys,
              },
              type: SET_OPEN_KEYS,
            })
          }
          openKeys={openKeys}
          selectedKeys={[getSelectedKey(location.pathname)]}
          theme="dark"
        >
          {SIDER_MENU.map(submenu =>
            submenu.children ? (
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
            ) : (
              <Menu.Item
                icon={submenu.icon}
                key={submenu.key}
                onClick={submenu.onClick}
              >
                {submenu.title}
              </Menu.Item>
            )
          )}
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

const getSelectedKey = pathname =>
  pathname === '/' || /^\/staffs/.test(pathname)
    ? 'staffs'
    : /^\/customers/.test(pathname)
    ? 'customers'
    : /^\/packages/.test(pathname)
    ? 'packages'
    : /^\/cameras/.test(pathname)
    ? 'cameras'
    : null;
