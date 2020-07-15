import { EditOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Form, message, Modal } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';

export const PackagesDeletePackageButton = ({ _package, onSuccess }) => {
  const client = useApolloClient();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async () => {
    const { _id } = _package;
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation DeletePackage($_id: ID!) {
            deletePackage(_id: $_id) {
              _id
              name
              price
              period
            }
          }
        `,
        variables: {
          _id,
        },
      });

      message.success('Delete package succeed!');
      setVisible(false);
      onSuccess(result?.data?.deletePackage);
    } catch (e) {
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <>
      <a className="whitespace-no-wrap" onClick={handleClick}>
        <EditOutlined />
        &nbsp;&nbsp;Delete
      </a>
      <Modal
        className="select-none"
        onCancel={() => {
          setTimeout(() => form.resetFields(), 500);
          setVisible(false);
        }}
        onOk={onFinish}
        title="Delete package"
        visible={visible}
      >
        <p>Are you sure you want to delete this package? </p>
        <p>{_package.name}</p>
      </Modal>
    </>
  );
};
