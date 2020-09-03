import { useApolloClient } from '@apollo/react-hooks';
import { DatePicker, Space, Spin, Tabs } from 'antd';
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

import { DATE_FORMAT_US } from '../common/constants';

const { RangePicker } = DatePicker;
export const PieCharts = () => {
  const [spinning, setSpinning] = useState(true);
  const [payments, setPayments] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [paymentPlan, setPaymentPlan] = useState([]);

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
  const [total4, setTotal4] = useState(0);

  const fetchWarningsSucceededData = async () => {
    setSpinning(true);

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
            limit: 100000000,
            search: { status: 'ACCEPTED' },
          },
        },
      });

      const fetchedWarningsTotal = result?.data?.warnings?.total ?? 0;

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
            limit: 100000000,
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
            limit: 100000000,
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
  const fetchWarningsPendingData = async () => {
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
            limit: 100000000,
            search: { status: 'PENDING' },
          },
        },
      });

      const fetchedWarningsTotal = result?.data?.warnings?.total ?? 0;

      setTotal4(fetchedWarningsTotal);
      setSpinning(false);
    } catch (e) {
      // Do something
    }
  };
  // fetch payment
  const fetchPaymentsData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query Payments($query: PaymentsQueryInput) {
            payments(query: $query) {
              data {
                _id
                paymentPlan {
                  _id
                  name
                }
              }
              total
            }
          }
        `,
        variables: {
          query: {
            createdBetween: { from: dateRange[0], to: dateRange[1] },
            limit: 100000000,
          },
          //  search,
        },
      });

      const fetchedPaymentsData = result?.data?.payments?.data ?? [];
      const fetchedPaymentsTotal = result?.data?.payments?.total ?? 0;
      setPayments(
        fetchedPaymentsData.map(_payment => ({
          ..._payment,
        }))
      );
      reportPaymentPlan(fetchedPaymentsData);
      setTotalPayment(fetchedPaymentsTotal);
    } catch (e) {
      // Do something
    }
  };
  useEffect(() => {
    fetchWarningsSucceededData();
    fetchWarningsData();
    fetchWarningsFailedData();
    fetchWarningsPendingData();
    fetchPaymentsData();
  }, [dateRange]);
  const datas = [
    { count: total3, item: 'Trainer help customer failed' },
    { count: total1, item: 'Trainer help cutomer succeeded' },
  ];

  const reportPaymentPlan = payments => {
    const paymentPlans = [];
    payments.forEach(({ paymentPlan }) => {
      if (paymentPlan !== null) {
        const current = paymentPlans.filter(
          d => d.paymentPlan.name === paymentPlan.name
        );
        if (current.length > 0) {
          paymentPlans[paymentPlans.indexOf(current[0])].count += 1;
        } else {
          paymentPlans.push({ count: 1, paymentPlan });
        }
      }
    });
    setPaymentPlan(
      paymentPlans.map(item => ({
        item: item.paymentPlan.name,
        ...item,
      }))
    );
    // setPaymentPlan(paymentPlans);
  };
  // console.log(payments);
  // console.log(paymentPlan);
  return (
    <>
      <Tabs
        tabBarExtraContent={
          <Space direction="vertical" size={12}>
            <RangePicker
              defaultValue={[
                moment('2020-05-09', DATE_FORMAT_US),
                moment(new Date(), DATE_FORMAT_US),
              ]}
              disabledDate={current => current && current > new Date()}
              onChange={(date, dateString) => setDateRange(dateString)}
            />
          </Space>
        }
      >
        <Tabs.TabPane key="1" tab="Warning status">
          <div className="chartSpinLoader">
            <div className="flex justify-between">
              <h6 className="text-sm">Warning accept status</h6>
            </div>
            <Spin spinning={spinning}>
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
                        `${data.item}: ${(
                          (data.count / (total2 - total4)) *
                          100
                        ).toFixed(1)}%`,
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
            </Spin>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane key="2" tab="Payment Plans">
          <div className="chartSpinLoader">
            <div className="flex justify-between">
              <h6 className="text-sm">Payment Plan Report</h6>
            </div>
            <Spin spinning={spinning}>
              <Chart autoFit data={paymentPlan} height={350} scale={cols}>
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
                        `${data.item}: ${(
                          (data.count / totalPayment) *
                          100
                        ).toFixed(1)}%`,
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
            </Spin>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};
