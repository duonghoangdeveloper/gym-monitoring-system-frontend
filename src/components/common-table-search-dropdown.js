import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';

export const CommonTableSearchDropdown = ({
  dataIndex,
  onSearch,
  searchValue,
}) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  return (
    <div>
      <div className="p-2 w-56">
        <Input
          onChange={e => setSearch(e.target.value)}
          onPressEnter={e => onSearch(e.target.value)}
          placeholder={`Search ${dataIndex}`}
          value={search}
        />
        <div className="mt-2 flex space-x-2">
          <Button
            className="flex-1"
            icon={<SearchOutlined />}
            onClick={() => onSearch(search)}
            type="primary"
          >
            Search
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setSearch('');
              onSearch('');
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
