import { CloseOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { message, Switch } from 'antd';
import gql from 'graphql-tag';
import React from 'react';

export const UserEnableDisbleSwitch = ({ user }) => {
  const client = useApolloClient();
  const onClick = async checked => {
    try {
      const { _id } = user;
      await client.mutate({
        mutation: gql`
          mutation changeUserStatus($_id: ID!, $checked: Boolean!) {
            changeUserStatus(_id: $_id, status: $checked) {
              isActive
            }
          }
        `,
        variables: {
          _id,
          checked,
        },
      });
      if (checked) {
        message.success(`Enable ${user.username} succeed`);
      } else {
        message.success(`Disable ${user.username} succeed`);
      }
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };
  return (
    <Switch
      defaultChecked={user.isActive}
      onClick={onClick}
      unCheckedChildren={<CloseOutlined />}
    />
  );
};
