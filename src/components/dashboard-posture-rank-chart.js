import { useApolloClient } from '@apollo/react-hooks';
import { Badge, Spin, Table } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const LadderChart = () => {
  const client = useApolloClient();
  const [spinning, setSpinning] = useState(true);
  const [warnings, setWarnings] = useState([]);
  const [total, setTotal] = useState(0);
  const [dangerousPostures, setDangerousPostures] = useState([]);
  // const [skip, setSkip] = useState(0);
  // const [loading, setLoading] = useState(true);
  // const [sort, setSort] = useState('');
  // const [from, setFrom] = useState('');
  // const [to, setTo] = useState('');
  // const [skip, setSkip] = useState(0);

  const reportDangerousPoseture = warnings => {
    const dangerousPostures = [];
    warnings.forEach(({ dangerousPosture }) => {
      if (dangerousPosture !== null) {
        const current = dangerousPostures.filter(
          d => d.dangerousPosture._id === dangerousPosture._id
        );
        if (current.length > 0) {
          dangerousPostures[dangerousPostures.indexOf(current[0])].total += 1;
        } else {
          dangerousPostures.push({ dangerousPosture, total: 1 });
        }
      }
    });
    dangerousPostures.sort(function(a, b) {
      return parseInt(b.total) - parseInt(a.total);
    });
    setDangerousPostures(
      dangerousPostures.map((itemPosture, index) => ({
        key: itemPosture.dangerousPosture._id,
        no: index + 1,
        ...itemPosture,
      }))
    );
  };

  const fetchWarningsData = async () => {
    // setLoading(true);
    setSpinning(true);

    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              data {
                _id

                dangerousPosture {
                  _id
                  title
                }
              }
              total
            }
          }
        `,
        variables: {
          query: { limit: 100000000 },
        },
      });

      const fetchedWarningsData = result?.data?.warnings?.data ?? [];

      setWarnings(
        fetchedWarningsData.map((warning, index) => ({
          key: warning._id,
          no: index + 1,
          ...warning,
        }))
      );
      // setLoading(false);
      reportDangerousPoseture(fetchedWarningsData);
      setSpinning(false);
    } catch (e) {
      // Do something
    }
  };
  useEffect(() => {
    fetchWarningsData();
  }, []);

  const columns = [
    {
      dataIndex: 'no',
      key: 'no',
      render: no =>
        no <= 3 ? (
          // <span
          //   style={{
          //     borderRadius: '20px',
          //     color: 'blue',
          //   }}
          // >
          //   {no}
          // </span>
          <Badge
            count={no}
            offset={[-5, -5]}
            style={{
              backgroundColor: '#314659',
              color: '#fff',
              marginLeft: '10px',
            }}
          />
        ) : (
          <span style={{ marginLeft: '10px' }}>{no}</span>
        ),

      sorter: (a, b) => a.no - b.no,
      title: 'Rank',
    },
    {
      dataIndex: 'dangerousPosture',
      key: dangerousPosture => `${dangerousPosture._id}`,
      render: dangerousPosture => `${dangerousPosture.title}`,
      title: 'Dangerous Posture',
    },
    {
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      title: 'Total',
    },
  ];
  return (
    <div className="chartSpinLoader">
      <div className="flex justify-between">
        <h6 className="text-sm">The Most Dangerous Postures</h6>
      </div>
      <Spin spinning={spinning}>
        <Table
          columns={columns}
          dataSource={dangerousPostures}
          pagination={{
            pageSize: 5,
          }}
        />
      </Spin>
    </div>
  );
};
