import { CloseOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { message, Switch } from 'antd';
import gql from 'graphql-tag';
import React from 'react';

export const UserEnableDisbleSwitch = ({ status, user }) => {
  const client = useApolloClient();
  const onClick = async checked => {
    try {
      const { _id } = user;
      await client.mutate({
        mutation: gql`
          mutation ChangeOnlineStatus($_id: ID!, $checked: Boolean!) {
            changeOnlineStatus(_id: $_id, status: $checked) {
              isOnline
            }
          }
        `,
        variables: {
          _id,
          checked,
        },
      });
      if (checked) {
        message.success(`Enable ${user.username}'s online status succeeded!`);
      } else {
        message.success(`Disable ${user.username}'s online status succeeded!`);
      }
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };
  return (
    <Switch
      defaultChecked={status}
      onClick={onClick}
      unCheckedChildren={<CloseOutlined />}
    />
  );
};
