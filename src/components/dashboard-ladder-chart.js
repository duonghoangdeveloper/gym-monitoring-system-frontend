import { useApolloClient } from '@apollo/react-hooks';
import { Chart, Line, Point } from 'bizcharts';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { DATE_FORMAT, PAGE_SIZE, TIME_FORMAT } from '../common/constants';

export const LadderChart = ({ text }) => {
  const client = useApolloClient();

  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [groupMonth, setGroupMonth] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [sort, setSort] = useState('');
  const [searchAll, setSearchAll] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const fetchFeedbacksData = async () => {
    try {
      const result = await client.query({
        query: gql`
          query($query: FeedbacksQueryInput) {
            feedbacks(query: $query) {
              data {
                _id
                content
                createdAt
              }
              total
            }
          }
        `,
        variables: {
          query: { createdBetween: { from, to }, limit: skip, sort },
        },
      });

      const fetchedFeedbacksData = result?.data?.feedbacks?.data ?? [];
      const fetchedFeedbacksTotal = result?.data?.feedbacks?.total ?? 0;

      setFeedbacks(
        fetchedFeedbacksData.map((feedback, index) => ({
          key: feedback._id,
          no: skip + index + 1,
          ...feedback,
          date: moment(feedback.createdAt).format(DATE_FORMAT),
          time: moment(feedback.createdAt).format(TIME_FORMAT),
        }))
      );

      setTotal(fetchedFeedbacksTotal);
    } catch (e) {
      // Do something
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacksData();
  }, []);

  const resultdata = feedbacks.reduce((r, { createdAt }) => {
    const dateObj = new Date(createdAt);
    const month = dateObj.toLocaleString('en-us', {
      // day: 'numeric',
      month: 'long',
      // year: 'numeric',
    });
    if (!r[month]) r[month] = { month, value: 1 };
    else r[month].value++;
    return r;
  }, {});
  const dataLadderChart = Object.values(resultdata).reverse();

  console.log(dataLadderChart);
  return (
    <div>
      <div className="flex justify-between">
        <h6 className="text-2xl">{text}</h6>
      </div>
      <Chart
        autoFit
        data={dataLadderChart}
        height={300}
        padding={[10, 20, 50, 40]}
        scale={{ value: { min: 0 } }}
      >
        <Line position="month*value" shape="hv" />
      </Chart>
    </div>
  );
};
