import { PlusOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const UsersCreateCustomerButton = () => (
  <Button icon={<PlusOutlined />}>Create Customer</Button>
);
