import { UserOutlined } from '@ant-design/icons';
import { Avatar, List, Spin } from 'antd';
import moment from 'moment';
import React from 'react';

export const AttendanceCustomersView = ({ attendedUsers, updatedAt }) => (
  <div>
    <h1 className="text-3xl mr-4">Customers Attendance</h1>
    {updatedAt ? (
      <div>
        <div className="font-semibold mb-2">
          Last update: {updatedAt && moment(updatedAt).format('HH:mm:ss')}
        </div>
        <List
          dataSource={attendedUsers}
          itemLayout="horizontal"
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                description={<span>{item.displayName}</span>}
                style={{ alignItems: 'center' }}
                title={<a href="https://ant.design">{item.username}</a>}
              />
              <div>Expired</div>
            </List.Item>
          )}
        />
      </div>
    ) : (
      <Spin />
    )}
  </div>
);
