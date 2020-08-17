import {
  BarChartOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  DollarCircleOutlined,
  DownOutlined,
  FundViewOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SnippetsOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
  VideoCameraOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { TOKEN_KEY } from '../common/constants';
import { generateRolesToView } from '../common/services';
import eGMS from '../images/eGMSnoTextWhite.png';
import {
  SIDER_SET_OPEN_KEYS,
  SIDER_TOGGLE_COLLAPSED,
} from '../redux/common/common.types';
import { SIGN_OUT } from '../redux/user/user.types';

export const LayoutDashboard = ({ children }) => {
  const location = useLocation();
  const client = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();

  const username = useSelector(state => state.user?.me?.username);
  const role = useSelector(state => state.user?.me?.role);
  const avatarUrl = useSelector(state => state.user.me.avatar?.url);
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
      icon: <BarChartOutlined />,
      key: 'dashboard',
      onClick: () => history.push('/dashboard'),
      title: 'Dashboard',
    },
    {
      children: [
        {
          icon: <CheckCircleOutlined />,
          key: 'check-in',
          onClick: () => history.push('/check-in'),
          title: 'Check In',
        },
        {
          icon: <TeamOutlined />,
          key: 'attendance',
          onClick: () => history.push('/attendance'),
          title: 'Attendance',
        },
        {
          icon: <VideoCameraOutlined />,
          key: 'cameras',
          onClick: () => history.push('/cameras'),
          title: 'Cameras',
        },
      ],
      icon: <FundViewOutlined />,
      key: 'monitoring',
      title: 'Monitoring',
    },
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
      icon: <CommentOutlined />,
      key: 'feedbacks',
      onClick: () => history.push('/feedbacks'),
      title: 'Feedbacks',
    },
    {
      hidden: role !== 'GYM_OWNER' && role !== 'SYSTEM_ADMIN',
      icon: <SnippetsOutlined />,
      key: 'payment-plans',
      onClick: () => history.push('/payment-plans'),
      title: 'Payment Plans',
    },
    {
      icon: <DollarCircleOutlined />,
      key: 'payments',
      onClick: () => history.push('/payments'),
      title: 'Payments',
    },
    {
      icon: <WarningOutlined />,
      key: 'warnings',
      onClick: () => history.push('/warnings'),
      title: 'Warnings History',
    },
    {
      children: [
        {
          hidden: role !== 'SYSTEM_ADMIN',
          icon: <TagsOutlined />,
          key: 'line-labelling',
          onClick: () => history.push('/line-labelling'),
          title: 'Line Labelling',
        },
      ],
      icon: <ToolOutlined />,
      key: 'tools',
      title: 'Tools',
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
            <div className=" w-8 h-8" />
            <img
              alt="logo"
              className="text-xs"
              src={eGMS}
              style={{ width: 60 }}
            />
            {!collapsed && <div>eGMS</div>}
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
              type: SIDER_SET_OPEN_KEYS,
            })
          }
          openKeys={openKeys}
          selectedKeys={[getSelectedKey(location.pathname)]}
          theme="dark"
        >
          {SIDER_MENU.map(submenu =>
            Array.isArray(submenu.children)
              ? submenu.children.some(({ hidden }) => !hidden) && (
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
                )
              : !submenu.hidden && (
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
                type: SIDER_TOGGLE_COLLAPSED,
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
                <Avatar
                  className="border border-solid border-gray-300"
                  icon={<UserOutlined />}
                  shape="square"
                  src={avatarUrl}
                />
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
  pathname === '/' || /^\/dashboard/.test(pathname)
    ? 'dashboard'
    : /^\/customers/.test(pathname)
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
    : /^\/payment-plans/.test(pathname)
    ? 'payment-plans'
    : /^\/payments/.test(pathname)
    ? 'payments'
    : /^\/payments/.test(pathname)
    ? 'payments'
    : /^\/warnings/.test(pathname)
    ? 'warnings'
    : /^\/cameras/.test(pathname)
    ? 'cameras'
    : /^\/attendance/.test(pathname)
    ? 'attendance'
    : /^\/check-in/.test(pathname)
    ? 'check-in'
    : /^\/line-labelling/.test(pathname)
    ? 'line-labelling'
    : null;
