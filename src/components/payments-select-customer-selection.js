import { useApolloClient } from '@apollo/react-hooks';
import { Select, Space, Tabs } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

export const PaymentsSelectCustomerSelection = ({
  defaultOptions,
  onDataChange,
  style,
}) => {
  const client = useApolloClient();
  const [visibleSelectUser, setVisibleSelectUser] = useState(false);
  const [visibleSelectEmail, setVisibleSelectEmail] = useState(true);

  const [visibleSelectPhone, setVisibleSelectPhone] = useState(true);

  const [value, setValue] = useState('Username');
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

  const handleChange = () => {
    if (value === 'Username') {
      setVisibleSelectUser(false);
      setVisibleSelectPhone(true);
      setVisibleSelectEmail(true);
    } else if (value === 'Phone') {
      setVisibleSelectPhone(false);
      setVisibleSelectUser(true);
      setVisibleSelectEmail(true);
    } else if (value === 'Email') {
      setVisibleSelectEmail(false);
      setVisibleSelectUser(true);
      setVisibleSelectPhone(true);
    }
  };
  setTimeout(handleChange, 10);

  return (
    <Space label="aaa" size="0">
      <Select
        onChange={setValue}
        onSelect={e => {
          handleChange(e);
        }}
        style={{ marginBottom: '-50', width: '100px' }}
        value={value}
      >
        <Option key="1" value="Username">
          Username
        </Option>
        <Option key="2" value="Phone">
          Phone
        </Option>
        <Option key="3" value="Email">
          Email
        </Option>
      </Select>
      <Select
        defaultValue={defaultOptions}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        hidden={visibleSelectUser}
        onChange={onDataChange}
        optionFilterProp="children"
        placeholder="Find customer"
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
      <Select
        defaultValue={defaultOptions}
        hidden={visibleSelectEmail}
        onChange={onDataChange}
        optionFilterProp="children"
        placeholder="Find user by email"
        showSearch
        style={style}
      >
        {customers.map(item => (
          <Select.Option
            // defaultOptions={defaultOptions}
            key={item._id}
            value={item._id}
          >
            {item.email}
          </Select.Option>
        ))}
      </Select>
      <Select
        defaultValue={defaultOptions}
        hidden={visibleSelectPhone}
        onChange={onDataChange}
        optionFilterProp="children"
        placeholder="Find user by phone"
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
    </Space>
  );
};
