import { useApolloClient } from '@apollo/react-hooks';
import { DatePicker, Space, Tabs } from 'antd';
import {
  Axis,
  Chart,
  Coordinate,
  Interaction,
  Interval,
  Tooltip,
} from 'bizcharts';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, DATE_FORMAT_US } from '../common/constants';

const { RangePicker } = DatePicker;
export const PieCharts = ({ text }) => {
  const client = useApolloClient();
  const dateNow = moment(new Date()).format(DATE_FORMAT_US);
  const [dateRange, setDateRange] = useState(['2020-05-09', dateNow]);

  const cols = {
    percent: {
      formatter: val => `${val * 100}%`,
    },
  };
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [total3, setTotal3] = useState(0);

  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [from, setFrom] = useState('');
  const [warningsSucceeded, setWarningsSucceeded] = useState([]);

  const [to, setTo] = useState('');
  const [warnings, setWarnings] = useState([]);

  const fetchWarningsSucceededData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              total
            }
          }
        `,
        variables: {
          query: {
            createdBetween: { from: dateRange[0], to: dateRange[1] },
            search: { status: 'SUCCEEDED' },
          },
        },
      });

      const fetchedWarningsTotal = result?.data?.warnings?.total ?? [];

      setTotal1(fetchedWarningsTotal);
    } catch (e) {
      // Do something
    }
  };
  const fetchWarningsData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              total
            }
          }
        `,
        variables: {
          query: {
            createdBetween: { from: dateRange[0], to: dateRange[1] },
          },
        },
      });

      const fetchedWarningsTotal = result?.data?.warnings?.total ?? 0;

      setTotal2(fetchedWarningsTotal);
    } catch (e) {
      // Do something
    }
  };
  const fetchWarningsFailedData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query($query: WarningsQueryInput) {
            warnings(query: $query) {
              total
            }
          }
        `,
        variables: {
          query: {
            createdBetween: { from: dateRange[0], to: dateRange[1] },
            search: { status: 'FAILED' },
          },
        },
      });

      const fetchedWarningsTotal = result?.data?.warnings?.total ?? 0;

      setTotal3(fetchedWarningsTotal);
    } catch (e) {
      // Do something
    }
  };
  useEffect(() => {
    fetchWarningsSucceededData();
    fetchWarningsData();
    fetchWarningsFailedData();
  }, [dateRange]);
  const datas = [
    { count: total3, item: 'Trainer help customer failed' },
    { count: total1, item: 'Trainer help cutomer succeeded' },
  ];

  return (
    <>
      <Tabs
        tabBarExtraContent={
          <Space direction="vertical" size={12}>
            <RangePicker
              onChange={(date, dateString) => setDateRange(dateString)}
            />
          </Space>
        }
      >
        <Tabs.TabPane key="1" tab="Warning status">
          <Chart autoFit data={datas} height={350} scale={cols}>
            <Coordinate radius={0.75} type="theta" />
            <Tooltip showTitle={false} />
            <Axis visible={false} />
            <Interval
              adjust="stack"
              color="item"
              label={[
                'count',
                {
                  content: data =>
                    `${data.item}: ${(data.count / total2).toFixed(2) * 100}%`,
                },
              ]}
              position="count"
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
            />
            <Interaction type="element-single-selected" />
          </Chart>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Package">
          <Chart autoFit data={datas} height={350} scale={cols}>
            <Coordinate radius={0.75} type="theta" />
            <Tooltip showTitle={false} />
            <Axis visible={false} />
            <Interval
              adjust="stack"
              color="item"
              label={[
                'count',
                {
                  content: data => `${data.item}: ${data.percent * 100}%`,
                },
              ]}
              position="percent"
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
            />
            <Interaction type="element-single-selected" />
          </Chart>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};
