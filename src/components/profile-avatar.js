import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/react-hooks';
import { Avatar, message, Modal, Tooltip, Upload } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { base64ToFile } from '../common/services';
import { UPDATE_AVATAR } from '../redux/user/user.types';

export const ProfileAvatar = () => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const avatarUrl = useSelector(state => state.user.me.avatar?.url);
  const [base64Avatar, setBase64Avatar] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const closeAvatarModal = () => {
    setVisible(false);
    setBase64Avatar(null);
  };

  const updateAvatar = async () => {
    if (base64Avatar) {
      setUpdateLoading(true);
      try {
        const result = await client.mutate({
          mutation: gql`
            mutation updateAvatar($data: UpdateAvatarInput!) {
              updateAvatar(data: $data) {
                avatar {
                  url
                }
              }
            }
          `,
          variables: {
            data: {
              file: base64ToFile(base64Avatar),
            },
          },
        });

        dispatch({
          payload: result.data.updateAvatar,
          type: UPDATE_AVATAR,
        });

        message.success('Update avatar succeeded!');
        closeAvatarModal();
      } catch (e) {
        message.error('Update avatar failed!');
      }
      setUpdateLoading(false);
    }
  };

  const handleAvatarChange = info => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setBase64Avatar(reader.result);
      });
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  return (
    <>
      <Tooltip placement="right" title="Update avatar">
        <Avatar
          className="rounded-md cursor-pointer border border-solid border-gray-300"
          icon={<UserOutlined />}
          onClick={() => setVisible(true)}
          shape="square"
          size={96}
          src={avatarUrl}
        />
      </Tooltip>
      <Modal
        className="select-none"
        maskClosable={false}
        okButtonProps={{
          className: 'mr-2',
          disabled: !base64Avatar,
          loading: updateLoading,
        }}
        okText="Update"
        onCancel={closeAvatarModal}
        onOk={updateAvatar}
        title="Update avatar"
        visible={visible}
        width={366}
      >
        <div className="flex">
          <Upload
            beforeUpload={beforeUpload}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess();
              }, 0);
            }}
            listType="picture-card"
            name="avatar"
            onChange={handleAvatarChange}
            showUploadList={false}
          >
            {base64Avatar ? (
              <img
                alt="avatar"
                className="rounded-sm object-cover text-3xl"
                src={base64Avatar}
                style={{
                  height: 300,
                  width: 300,
                }}
              />
            ) : (
              <div
                className="flex flex-col justify-center items-center text-3xl"
                style={{
                  height: 300,
                  width: 300,
                }}
              >
                <UploadOutlined />
                <span className="mt-6">Upload image</span>
              </div>
            )}
          </Upload>
        </div>
      </Modal>
    </>
  );
};

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
