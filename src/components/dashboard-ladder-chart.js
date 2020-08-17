import { useApolloClient } from '@apollo/react-hooks';
import { Chart, Line } from 'bizcharts';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';

export const LadderChart = () => {
  const client = useApolloClient();

  const [feedbacks, setFeedbacks] = useState([]);
  // const [skip, setSkip] = useState(0);
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
          limit: 100000000,
          query: { createdBetween: { from, to } },
        },
      });

      const fetchedFeedbacksData = result?.data?.feedbacks?.data ?? [];

      setFeedbacks(
        fetchedFeedbacksData.map(feedback => ({
          key: feedback._id,
          ...feedback,
        }))
      );
    } catch (e) {
      // Do something
    }
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

  return (
    <div>
      <div className="flex justify-between">
        <h6 className="text-sm">Customer feedbacks report</h6>
      </div>
      <Chart
        autoFit
        data={dataLadderChart}
        height={350}
        padding={[10, 20, 50, 40]}
        scale={{ value: { min: 0 } }}
      >
        <Line position="month*value" shape="hv" />
      </Chart>
    </div>
  );
};
