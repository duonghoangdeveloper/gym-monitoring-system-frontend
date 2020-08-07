import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import Highlighter from 'react-highlight-words';

import { CommonTableSearchDropdown } from '../components/common-table-search-dropdown';

export const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
    xs: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 8 },
    xs: { span: 24 },
  },
};

export const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      offset: 8,
      span: 16,
    },
    xs: {
      offset: 0,
      span: 24,
    },
  },
};

export const getColumnSearchProps = (dataIndex, onSearch, searchValue) => ({
  filterDropdown: ({ confirm }) => (
    <CommonTableSearchDropdown
      dataIndex={dataIndex}
      onSearch={value => {
        onSearch(value);
        confirm();
      }}
      searchValue={searchValue}
    />
  ),
  filterIcon: () => (
    <SearchOutlined
      style={{
        color: searchValue ? '#1890ff' : undefined,
        transform: 'translate(-6px, -5px)',
      }}
    />
  ),
  render: text => (
    <Highlighter
      autoEscape
      highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      searchWords={[searchValue]}
      textToHighlight={text ? text.toString() : ''}
    />
  ),
});
