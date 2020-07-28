import {
  DeleteOutlined,
  DownOutlined,
  FileSearchOutlined,
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

import { AUTH_ROLES, TOKEN_KEY } from '../common/constants';
import { generateRolesToView } from '../common/services';
import { SET_OPEN_KEYS, TOGGLE_COLLAPSED } from '../redux/common/common.types';
import { SIGN_OUT } from '../redux/user/user.types';

export const LayoutDashboard = ({ children }) => {
  const location = useLocation();
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

  const username = useSelector(state => state.user?.me?.username);
  const role = useSelector(state => state.user?.me?.role);
  const rolesToView = generateRolesToView(role);

  const collapsed = useSelector(
    state => state.common?.sider?.collapsed ?? false
  );
  const openKeys = useSelector(state => state.common?.sider?.openKeys ?? []);

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
          hidden: !rolesToView.includes('CUSTOMER'),
          icon: <UserOutlined />,
          key: 'customers',
          onClick: () => history.push('/customers'),
          title: 'Customers',
        },
        {
          hidden: !rolesToView.includes('TRAINER'),
          icon: <UserOutlined />,
          key: 'trainers',
          onClick: () => history.push('/trainers'),
          title: 'Trainers',
        },
        {
          hidden: !rolesToView.includes('MANAGER'),
          icon: <UserOutlined />,
          key: 'managers',
          onClick: () => history.push('/managers'),
          title: 'Managers',
        },
        {
          hidden: !rolesToView.includes('GYM_OWNER'),
          icon: <UserOutlined />,
          key: 'owners',
          onClick: () => history.push('/owners'),
          title: 'Gym owners',
        },
        {
          hidden: !rolesToView.includes('SYSTEM_ADMIN'),
          icon: <UserOutlined />,
          key: 'admins',
          onClick: () => history.push('/admins'),
          title: 'Admins',
        },
      ],
      icon: <UserOutlined />,
      key: 'user-management',
      title: 'User Management',
    },
    {
      hidden: role !== 'GYM_OWNER' && role !== 'SYSTEM_ADMIN',
      icon: <FileSearchOutlined />,
      key: 'feedbacks',
      onClick: () => history.push('/feedbacks'),
      title: 'Feedbacks',
    },
    {
      hidden: role !== 'GYM_OWNER' && role !== 'SYSTEM_ADMIN',
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
    {
      hidden: role !== 'SYSTEM_ADMIN',
      icon: <DeleteOutlined />,
      key: 'bin',
      onClick: () => history.push('/bin'),
      title: 'Bin',
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
                {submenu.children.map(
                  menu =>
                    !menu.hidden && (
                      <Menu.Item
                        icon={menu.icon}
                        key={menu.key}
                        onClick={menu.onClick}
                      >
                        {menu.title}
                      </Menu.Item>
                    )
                )}
              </Menu.SubMenu>
            ) : (
              !submenu.hidden && (
                <Menu.Item
                  icon={submenu.icon}
                  key={submenu.key}
                  onClick={submenu.onClick}
                >
                  {submenu.title}
                </Menu.Item>
              )
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
  pathname === '/' || /^\/customers/.test(pathname)
    ? 'customers'
    : /^\/trainers/.test(pathname)
    ? 'trainers'
    : /^\/managers/.test(pathname)
    ? 'managers'
    : /^\/owners/.test(pathname)
    ? 'owners'
    : /^\/admins/.test(pathname)
    ? 'admins'
    : /^\/feedbacks/.test(pathname)
    ? 'feedbacks'
    : /^\/packages/.test(pathname)
    ? 'packages'
    : /^\/cameras/.test(pathname)
    ? 'cameras'
    : /^\/bin/.test(pathname)
    ? 'bin'
    : null;
