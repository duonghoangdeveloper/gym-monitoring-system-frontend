import {
  CloseOutlined,
  PauseOutlined,
  ReloadOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Form,
  message,
  Popover,
  Progress,
  Radio,
  Spin,
  Switch,
} from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import * as faceapi from 'face-api.js';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Webcam from 'react-webcam';

import { PYTHON_SERVER_URI } from '../common/constants';
import { base64toBlob } from '../common/services';
import {
  // SET_FACES_LAYOUT,
  TOGGLE_AUTO_DETECT,
  TOGGLE_WEBCAM_VISIBLE,
} from '../redux/common/common.types';

const { CancelToken } = axios;

export const UsersCreateCustomerStep2View = ({
  customerData,
  onNext,
  onPrev,
}) => {
  const dispatch = useDispatch();
  const { autoDetect, webcamVisible } = useSelector(
    state => state.common.userWebcam
  );
  const webcamRef = useRef(null);
  const detectingRef = useRef(false);
  const cancelTokenRef = useRef(null);
  const [faces, setFaces] = useState(customerData.step2 || INIT_FACES);
  const [error, setError] = useState(false);
  const [device, setDevice] = useState();
  const [streamLoaded, setStreamLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [faceFound, setFaceFound] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    cancelTokenRef.current = CancelToken.source();
    navigator.mediaDevices
      .enumerateDevices()
      .then(mediaDevices =>
        setDevice(
          mediaDevices.filter(({ kind }) => kind === 'videoinput').slice(-1)[0]
        )
      );

    return () => {
      message.destroy();
      cancelTokenRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (detecting) {
      if (networkError) {
        message.destroy();
        message.error({
          content: 'Connect to the server failed!',
          duration: 0,
          key: NETWORK_ERROR_MESSAGE_KEY,
        });
      } else if (!faceFound) {
        message.destroy();
        message.loading({
          content: 'Face detecting...',
          duration: 0,
          key: FACE_FOUND_MESSAGE_KEY,
        });
      }

      const detectFace = async () => {
        detectingRef.current = true;
        try {
          const base64Screenshot = webcamRef.current.getScreenshot();
          if (!faceFound) {
            message.success({
              content: 'Face detected!',
              duration: 1.5,
              key: FACE_FOUND_MESSAGE_KEY,
            });
            setFaceFound(true);
          }
          const formData = new FormData(document.forms[0]);
          formData.append('image', base64toBlob(base64Screenshot));
          const response = await axios.post(
            `${PYTHON_SERVER_URI}/register-face/`,
            formData,
            {
              cancelToken: cancelTokenRef.current.token,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              responseType: 'arraybuffer',
            }
          );
          if (networkError) {
            setNetworkError(false);
          }
          if (response.headers['content-type'] === 'image/jpeg') {
            const base64Face = `data:image/jpeg;base64,${Buffer.from(
              response.data,
              'binary'
            ).toString('base64')}`;
            const { faceClass /* yaw, pitch, roll */ } = JSON.parse(
              response.headers.payload
            );
            if (faces[faceClass].length < 5) {
              setFaces(currentFaces =>
                generateNewFaces(currentFaces, faceClass, base64Face)
              );
            }
          }
        } catch (e) {
          if (e.message === 'Network Error') {
            setNetworkError(true);
          }
        }
        detectingRef.current = false;
      };
      const intervalId = setInterval(() => {
        if (!detectingRef.current) {
          detectFace();
        }
      }, 1000 / 30);
      return () => {
        message.destroy();
        clearInterval(intervalId);
      };
    }
  }, [
    device,
    detecting,
    faceFound,
    faces,
    detectingRef,
    webcamRef,
    webcamRef.current,
    networkError,
  ]);

  const handleDetectionToggle = () => {
    setDetecting(!detecting);
  };

  const generateWebcamView = () => {
    if (!webcamVisible) {
      return (
        <Button
          onClick={() =>
            dispatch({
              type: TOGGLE_WEBCAM_VISIBLE,
            })
          }
        >
          Show Webcam
        </Button>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col space-y-2">
          <span>
            Can not access the webcam! Try 3 steps below to fix the problem:
          </span>
          <a href="images/fix-webcam-tutorial-1.png" target="_blank">
            Allow this website to access the webcam.
          </a>
          <a href="images/fix-webcam-tutorial-2.png" target="_blank">
            Make sure the webcam is not used elsewhere.
          </a>
          <span>
            Simply click "Previous" button below, then click "Next" to reload
            this view.
          </span>
        </div>
      );
    }

    if (!device) {
      return (
        <div
          className="flex flex-col justify-center bg-gray-200 rounded-sm"
          style={{ height: 444 }}
        >
          <Spin />
        </div>
      );
    }

    return (
      <div
        className="flex flex-col justify-center bg-gray-200 rounded-sm"
        style={{ height: 444 }}
      >
        <WebcamWrapper
          detecting={detecting}
          loading={!streamLoaded}
          onUserMedia={() => setStreamLoaded(true)}
          onUserMediaError={() => setError(true)}
          ref={webcamRef}
          videoConstraints={{ deviceId: device.deviceId }}
        />
      </div>
    );
  };

  const faceClassDoneCount = countFaceClassDone(faces);

  const handleNextClick = () => {
    if (faceClassDoneCount === 9) {
      onNext(faces);
    }
  };

  const handlePrevClick = () => {
    onPrev(faces);
  };

  return (
    <div>
      {generateWebcamView()}
      <div className="mt-2">
        <Progress
          percent={Math.round(
            faceClassDoneCount > 0 ? (100 / 9) * faceClassDoneCount : 0
          )}
        />
      </div>
      <div className="flex justify-between space-x-2 mt-4">
        {faces.map((sameAngleFaces, i) => (
          <div className="flex-1" key={i}>
            <div
              className="w-full relative bg-gray-200 rounded-sm"
              style={{
                paddingTop: '100%',
              }}
            >
              <div className="absolute inset-0">
                <FaceView
                  faceClass={i}
                  sameAngleFaces={sameAngleFaces}
                  setFaces={setFaces}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <Popover
          content={
            <Form layout="inline">
              <Form.Item label="Auto detect">
                <Switch
                  checked={autoDetect}
                  onChange={() =>
                    dispatch({
                      type: TOGGLE_AUTO_DETECT,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Show webcam">
                <Switch
                  checked={webcamVisible}
                  onChange={() => {
                    dispatch({
                      type: TOGGLE_WEBCAM_VISIBLE,
                    });
                    setSettingsVisible(false);
                  }}
                />
              </Form.Item>
            </Form>
          }
          onVisibleChange={visible => setSettingsVisible(visible)}
          title="Settings"
          trigger="click"
          visible={settingsVisible}
        >
          <Button icon={<SettingOutlined />} />
        </Popover>
        <Button
          className="ml-2"
          icon={<ReloadOutlined />}
          onClick={() => setFaces(INIT_FACES)}
        >
          Reset result
        </Button>
        <Button
          className="ml-2"
          icon={detecting ? <PauseOutlined /> : <ThunderboltOutlined />}
          loading={!streamLoaded}
          onClick={handleDetectionToggle}
        >
          {detecting ? 'Pause Detecting' : 'Start Detecting'}
        </Button>
        <Button
          className="ml-2"
          loading={!streamLoaded && !error}
          onClick={handlePrevClick}
        >
          Previous
        </Button>
        <Button
          className="ml-2"
          disabled={faceClassDoneCount < 9}
          onClick={handleNextClick}
          type="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const WebcamWrapper = forwardRef(({ detecting, loading, ...rest }, ref) => (
  <div
    className={classNames('relative p-1 rounded-sm', {
      'bg-green-600': detecting,
    })}
  >
    {loading && (
      <div className="absolute w-full h-full flex justify-center items-center">
        <Spin />
      </div>
    )}

    <Webcam
      audio={false}
      className={classNames('rounded-sm', { 'opacity-50': loading })}
      ref={ref}
      screenshotFormat="image/jpeg"
      {...rest}
    />
  </div>
));

const FACE_FOUND_MESSAGE_KEY = 'face-found';
const NETWORK_ERROR_MESSAGE_KEY = 'network-error';
const INIT_FACES = Array(9).fill([]);

const generateNewFaces = (currentFaces, faceClass, newFace) => {
  if (currentFaces[faceClass].length < 4) {
    const sameYawIndex = Math.floor(faceClass / 3) * 3;

    return currentFaces.map((sameAngleFaces, i) => {
      if (i === sameYawIndex && sameAngleFaces.length === 0) {
        return [newFace];
      }

      if (i === sameYawIndex + 1 && sameAngleFaces.length === 0) {
        return [newFace];
      }

      if (i === sameYawIndex + 2 && sameAngleFaces.length === 0) {
        return [newFace];
      }

      if (i === faceClass) {
        return [...sameAngleFaces, newFace];
      }

      return sameAngleFaces;
    });
  }
  return currentFaces;
};

const FaceView = ({ faceClass, sameAngleFaces, setFaces }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full h-full relative">
      {sameAngleFaces.length === 1 && (
        <img alt="face" className="rounded-sm" src={sameAngleFaces[0]} />
      )}
      {sameAngleFaces.length === 2 && (
        <img alt="face" className="rounded-sm" src={sameAngleFaces[1]} />
      )}
      {sameAngleFaces.length > 2 && (
        <Popover
          className="cursor-pointer"
          content={
            <div className="flex justify-between space-x-2">
              {sameAngleFaces.slice(1).map((face, i) => (
                <div className="w-16 h-16" key={i}>
                  <div
                    className="w-full relative bg-gray-200 rounded-sm"
                    style={{
                      paddingTop: '100%',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      onClick={() => {
                        setFaces(currentFaces =>
                          currentFaces.map((_sameAngleFaces, _faceClass) =>
                            _faceClass === faceClass && i > 0
                              ? _sameAngleFaces.map((_face, j) =>
                                  j === 1
                                    ? face
                                    : j === i + 1
                                    ? _sameAngleFaces[1]
                                    : _face
                                )
                              : _sameAngleFaces
                          )
                        );
                        setVisible(false);
                      }}
                    >
                      <img
                        alt="face"
                        className="rounded-sm cursor-pointer"
                        src={face}
                      />

                      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1/2 z-10 scale-75">
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => {
                            setFaces(currentFaces =>
                              currentFaces.map((_sameAngleFaces, _faceClass) =>
                                _faceClass === faceClass
                                  ? _sameAngleFaces.filter(
                                      (_, j) => j !== i + 1
                                    )
                                  : _sameAngleFaces
                              )
                            );
                          }}
                          size="small"
                          type="primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          onVisibleChange={v => setVisible(v)}
          title="Choose face"
          trigger="click"
          visible={visible}
        >
          <img alt="face" className="rounded-sm" src={sameAngleFaces[1]} />
        </Popover>
      )}
      {(sameAngleFaces.length === 1 || sameAngleFaces.length === 2) && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-1/2 z-10 scale-75">
          <Button
            className="transform"
            danger
            icon={<CloseOutlined />}
            onClick={() => {
              setFaces(currentFaces =>
                currentFaces.map((_sameAngleFaces, _faceClass) =>
                  _faceClass === faceClass
                    ? _sameAngleFaces.filter(
                        (_, j) => j < _sameAngleFaces.length - 1
                      )
                    : _sameAngleFaces
                )
              );
            }}
            size="small"
            type="primary"
          />
        </div>
      )}
      {sameAngleFaces.length > 2 && (
        <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-3 z-10">
          <Badge
            count={sameAngleFaces.length - 1}
            style={{ backgroundColor: '#52c41a' }}
          />
        </div>
      )}
    </div>
  );
};

const countFaceClassDone = faces =>
  faces.filter(sameAngleFaces => sameAngleFaces.length > 0).length;
