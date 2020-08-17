import { UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';

import { AUTH_ROLES, STAFF_ROLES } from '../common/constants';
import { SocketContext } from '../common/contexts';
import { validateObjectId } from '../common/services';
import { AttendanceCustomersView } from '../components/attendance-customers-view';
import { AttendanceStaffsView } from '../components/attendance-staffs-view';
import { LayoutDashboard } from '../components/layout-dashboard';

export const Attendance = () => {
  const { socket } = useContext(SocketContext);
  const [selectedKey, setSelectedKey] = useState('customers');
  const [attendedUsers, setAttendedUsers] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    socket.emit('client-start-get-users-attendance');

    const receiveScreensHandler = receivedUsersAttendance => {
      setAttendedUsers(getPresentUsers(receivedUsersAttendance));
      setUpdatedAt(receivedUsersAttendance.updatedAt);
      socket.emit('client-receive-users-attendance');
    };
    const observable = fromEvent(socket, 'server-send-users-attendance');
    const subscriber = observable.subscribe({
      next(receivedUsersAttendance) {
        receiveScreensHandler(receivedUsersAttendance);
      },
    });

    return () => {
      socket.emit('client-stop-get-users-attendance');
      socket.off('server-send-users-attendance');
      subscriber.unsubscribe();
    };
  }, [socket.connected]);

  const getTab = key => {
    switch (key) {
      case 'customers':
        return (
          <AttendanceCustomersView
            attendedUsers={attendedUsers.filter(
              ({ role }) => role === 'CUSTOMER'
            )}
            updatedAt={updatedAt}
          />
        );
      case 'staffs':
        return (
          <AttendanceStaffsView
            attendedUsers={attendedUsers.filter(({ role }) =>
              STAFF_ROLES.includes(role)
            )}
            updatedAt={updatedAt}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LayoutDashboard>
      <div
        className="bg-white shadow rounded-sm flex py-6"
        style={{
          minHeight: 'calc(100vh - 64px - 3rem)',
        }}
      >
        <Menu
          mode="inline"
          onSelect={({ key }) => setSelectedKey(key)}
          selectedKeys={[selectedKey]}
          style={{ width: 256 }}
        >
          <Menu.Item icon={<UserOutlined />} key="customers">
            Customers
          </Menu.Item>
          <Menu.Item icon={<UserOutlined />} key="staffs">
            Staffs
          </Menu.Item>
        </Menu>
        <div className="flex-1 px-6">{getTab(selectedKey)}</div>
      </div>
    </LayoutDashboard>
  );
};

const getPresentUsers = (usersAttendance, roles = AUTH_ROLES) =>
  Object.keys(usersAttendance)
    .filter(
      _id =>
        validateObjectId(_id) &&
          usersAttendance[_id] ?.status === 'PRESENT' &&
          roles.includes(usersAttendance[_id] ?.document ?.role)
    )
    .map(_id => usersAttendance[_id].document);
