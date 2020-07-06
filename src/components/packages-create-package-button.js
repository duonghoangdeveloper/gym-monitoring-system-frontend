import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const PackagesCreatePackageButton = () => {
  const client = useApolloClient();
  const me = useSelector(state => state?._package?.me);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  const onFinish = async values => {
    try {
      const { name, period, price } = values;
      await client.mutate({
        mutation: gql`
          mutation CreateUser($name: String!, $price: Int!, $period: Int!) {
            createPackage(
              data: { name: $name, price: $price, period: $period }
            ) {
              name
              price
              period
            }
          }
        `,
        variables: {
          name,
          period,
          price,
        },
      });
      message.success('Create package succeed.');
      setVisible(false);
    } catch (e) {
      console.log(e.message);
      message.error(`${e.message.split(': ')[1]}!`);
    }
  };

  return (
    <>
      <Button icon={<PlusOutlined />} onClick={handleClick}>
        Create Package
      </Button>
      <Modal
        className="select-none"
        maskClosable={false}
        okButtonProps={{
          disabled,
        }}
        onCancel={() => {
          setTimeout(() => form.resetFields(), 500);
          setVisible(false);
        }}
        onOk={() => form.submit()}
        title="Create Package"
        visible={visible}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                message: 'Please input name of package!',
                required: true,
              },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                message: 'Please input price!',
                required: true,
              },
            ]}
          >
            <InputNumber placeholder="Enter price" />
          </Form.Item>
          <Form.Item
            label="Period"
            name="period"
            rules={[
              {
                message: 'Please input period!',
                required: true,
              },
            ]}
          >
            <InputNumber placeholder="Enter period" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};