import { useApolloClient } from '@apollo/react-hooks';
import { Form, Input, message, Modal, Select, Tabs } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

const { TabPane } = Tabs;
export const PaymentsSelectCustomerSelection = ({
  defaultOptions,
  onDataChange,
  style,
}) => {
  const client = useApolloClient();

  const [customers, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const fetchedCustomers = async () => {
    try {
      const result = await client.query({
        query: gql`
          query getUser($query: UsersQueryInput!) {
            users(query: $query) {
              data {
                _id
                username
                displayName
                email
                phone
                gender
              }
              total
            }
          }
        `,
        variables: {
          query: {
            filter: { role: 'CUSTOMER' },
          },
        },
      });

      const fetchedCustomersData = result?.data?.users?.data ?? [];
      const fetchedCustomersTotal = result?.data?.users?.total ?? 0;
      setUsers(
        fetchedCustomersData.map(user => ({
          key: user._id,

          ...user,
        }))
      );
      setTotal(fetchedCustomersTotal);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fetchedCustomers();
  }, []);
  console.log(customers);
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane key="1" tab="Username">
          <Select
            defaultValue={defaultOptions}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={onDataChange}
            optionFilterProp="children"
            placeholder="Select a customer"
            showSearch
            style={style}
          >
            {customers.map(item => (
              <Select.Option
                // defaultOptions={defaultOptions}
                key={item._id}
                value={item._id}
              >
                {item.username}
              </Select.Option>
            ))}
          </Select>
        </TabPane>
        <TabPane key="2" tab="Email">
          <Select
            // defaultValue={defaultOptions}
            // filterOption={(input, option) =>
            //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
            onChange={onDataChange}
            optionFilterProp="children"
            placeholder="Select customer by email"
            showSearch
            style={style}
          >
            {customers.map(item => (
              <Select.Option
                // defaultOptions={defaultOptions}
                key={item._id}
                value={item._id}
              >
                {item.email === '' ? ' ' : item.email}
              </Select.Option>
            ))}
          </Select>
        </TabPane>
        <TabPane key="3" tab="Phone">
          <div className="ant-col ant-form-item-label" />
          <Select
            // defaultValue={defaultOptions}
            // filterOption={(input, option) =>
            //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
            onChange={onDataChange}
            optionFilterProp="children"
            placeholder="Select customer by phone"
            showSearch
            style={style}
          >
            {customers.map(item => (
              <Select.Option
                // defaultOptions={defaultOptions}
                key={item._id}
                value={item._id}
              >
                {item.phone}
              </Select.Option>
            ))}
          </Select>
        </TabPane>
      </Tabs>
    </>
  );
};
