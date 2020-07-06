import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';

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

// export const getColumnSearchProps = dataIndex => ({
//   filterDropdown: ({
//     clearFilters,
//     confirm,
//     selectedKeys,
//     setSelectedKeys,
//   }) => (
//     <div style={{ padding: 8 }}>
//       <Input
//         onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//         onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//         placeholder={`Search ${dataIndex}`}
//         ref={node => {
//           this.searchInput = node;
//         }}
//         style={{ display: 'block', marginBottom: 8, width: 188 }}
//         value={selectedKeys[0]}
//       />
//       <Space>
//         <Button
//           icon={<SearchOutlined />}
//           onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
//           size="small"
//           style={{ width: 90 }}
//           type="primary"
//         >
//           Search
//         </Button>
//         <Button
//           onClick={() => this.handleReset(clearFilters)}
//           size="small"
//           style={{ width: 90 }}
//         >
//           Reset
//         </Button>
//       </Space>
//     </div>
//   ),
//   filterIcon: filtered => (
//     <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
//   ),
//   onFilter: (value, record) =>
//     record[dataIndex]
//       .toString()
//       .toLowerCase()
//       .includes(value.toLowerCase()),
//   onFilterDropdownVisibleChange: visible => {
//     if (visible) {
//       setTimeout(() => this.searchInput.select());
//     }
//   },
//   render: text =>
//     this.state.searchedColumn === dataIndex ? (
//       <Highlighter
//         autoEscape
//         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//         searchWords={[this.state.searchText]}
//         textToHighlight={text.toString()}
//       />
//     ) : (
//       text
//     ),
// });
