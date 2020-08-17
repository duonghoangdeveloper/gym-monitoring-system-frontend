import { RollbackOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { message, Popconfirm } from 'antd';
import gql from 'graphql-tag';
import React from 'react';

export const UsersBackupButton = ({ onSuccess, user }) => {
  const client = useApolloClient();
  const text = `Are you sure to backup ${user.username}?`;

  const confirm = async () => {
    const _id = user.key;
    try {
      await client.mutate({
        mutation: gql`
          mutation ActivateUser($_id: ID!) {
            activateUser(_id: $_id) {
              _id
            }
          }
        `,
        variables: {
          _id,
        },
      });
      message.info('Backup success');

      if (onSuccess instanceof Function) {
        onSuccess();
      }
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <>
      <Popconfirm
        cancelText="No"
        okText="Yes"
        onConfirm={confirm}
        placement="left"
        title={text}
      >
        <a className="whitespace-no-wrap">
          <RollbackOutlined />
          &nbsp;&nbsp;Backup
        </a>
      </Popconfirm>
    </>
  );
};
