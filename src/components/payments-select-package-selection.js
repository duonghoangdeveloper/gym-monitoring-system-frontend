import { useApolloClient } from '@apollo/react-hooks';
import { Form, Input, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

const { Option } = Select;

export const PaymentsSelectPackageSelection = ({
  defaultOptions,
  onDataChange,
  style,
}) => {
  const client = useApolloClient();

  const [packages, setPackages] = useState([]);
  const [total, setTotal] = useState(0);
  const fetchPackagesData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query Packages($query: PackagesQueryInput) {
            packages(query: $query) {
              data {
                _id
                name
                price
                period
              }
              total
            }
          }
        `,
        variables: {},
      });

      const fetchedPackagesData = result?.data?.packages?.data ?? [];
      const fetchedPackagesTotal = result?.data?.packages?.total ?? 0;
      setPackages(
        fetchedPackagesData.map(_package => ({
          key: _package._id,

          ..._package,
        }))
      );
      setTotal(fetchedPackagesTotal);
    } catch (e) {
      // Do something
    }
  };

  useEffect(() => {
    fetchPackagesData();
  }, []);

  return (
    <Select
      defaultValue={defaultOptions}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={onDataChange}
      optionFilterProp="children"
      placeholder="Select a package"
      showSearch
      style={style}
    >
      {packages.map(item => (
        <Option key={item._id} value={item._id}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
};
