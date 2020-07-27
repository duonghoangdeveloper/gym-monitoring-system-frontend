import { DeleteOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { message, Modal, Popconfirm } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const UsersRemoveUserButton = ({ onSuccess, user }) => {
  const client = useApolloClient();
  const text = `Are you sure to remove ${user.username}?`;

  const confirm = async () => {
    const _id = user.key;
    try {
      await client.mutate({
        mutation: gql`
          mutation RemoveUserToBin($_id: ID!) {
            removeUserToBin(_id: $_id) {
              _id
            }
          }
        `,
        variables: {
          _id,
        },
      });
      message.info('Remove success');
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
          <DeleteOutlined />
          &nbsp;&nbsp;Remove
        </a>
      </Popconfirm>
    </>
  );
};
