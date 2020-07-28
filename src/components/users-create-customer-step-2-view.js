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
import { throttle } from 'throttle-debounce';

import { URI_PYTHON } from '../common/constants';
import { base64toBlob } from '../common/services';
import {
  SET_FACES_LAYOUT,
  TOGGLE_AUTO_DETECT,
  TOGGLE_WEBCAM_VISIBLE,
} from '../redux/common/common.types';

export const UsersCreateCustomerStep2View = ({ onNext, onPrev }) => {
  const dispatch = useDispatch();
  const { autoDetect, facesLayout, webcamVisible } = useSelector(
    state => state.common.userWebcam
  );
  const webcamRef = useRef(null);
  const detectingRef = useRef(false);
  const [faces, setFaces] = useState(INIT_FACES);
  const [error, setError] = useState(false);
  const [device, setDevice] = useState();
  const [streamLoaded, setStreamLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [captureTested, setCaptureTested] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [faceFound, setFaceFound] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(mediaDevices =>
        setDevice(
          mediaDevices.filter(({ kind }) => kind === 'videoinput').slice(-1)[0]
        )
      );
  }, []);

  useEffect(() => {
    if (device && streamLoaded && !captureTested && webcamRef.current) {
      // setTimeout(() => {
      //   setCaptureTested(true);
      //   if (autoDetect) {
      //     setDetecting(true);
      //   }
      // }, 100);

      setTimeout(async () => {
        try {
          const imageSrc = webcamRef.current.getScreenshot();
          await hasFace(imageSrc);
        } catch (_) {
          // Do nothing
        }
        setCaptureTested(true);
        if (autoDetect) {
          setDetecting(true);
        }
      }, 1000);
    }
  }, [device, streamLoaded, captureTested, webcamRef.current]);

  useEffect(() => {
    if (detecting) {
      if (faceFound) {
        message.success({
          content: 'Face detected!',
          duration: 1,
          key: MESSAGE_KEY,
        });
        // message.destroy()
      } else {
        message.loading({
          content: 'Face detecting...',
          duration: 0,
          key: MESSAGE_KEY,
        });
      }

      const detectFace = throttle(100, true, async () => {
        detectingRef.current = true;
        try {
          const base64Screenshot = webcamRef.current.getScreenshot();
          if (await hasFace(base64Screenshot)) {
            if (!faceFound) {
              setFaceFound(true);
            }
            const formData = new FormData(document.forms[0]);
            formData.append('image', base64toBlob(base64Screenshot));
            const response = await axios.post(
              `${URI_PYTHON}/register-face/`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                responseType: 'arraybuffer',
              }
            );
            if (response.headers['content-type'] === 'image/png') {
              const base64Face = `data:image/png;base64,${Buffer.from(
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
            // console.log(
            //   Buffer.from(response.data, 'binary').toString('base64')
            // );
            // const { pitch, roll, yaw } = result.data;
            // const faceClass = classifyFacePose(yaw, pitch, roll);

            // if (faceClass > -1) {
            //   if (faces[faceClass].length < 5) {
            //     setFaces(currentFaces =>
            //       generateNewFaces(currentFaces, faceClass, image)
            //     );
            //   }
            // }
          }
        } catch (_) {
          console.log(_);
          // Do nothing
        }
        detectingRef.current = false;
      });
      const intervalId = setInterval(() => {
        if (!detectingRef.current) {
          detectFace();
        }
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [detecting, faceFound, faces]);

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
          <span>Can not access the webcam! Try 3 steps below to fix the problem:</span>
          <a href="images/fix-webcam-tutorial-1.png" target="_blank">
            Allow this website to access the webcam.
          </a>
          <a href="images/fix-webcam-tutorial-2.png" target="_blank">
            Make sure the webcam is not used elsewhere.
          </a>
          <span>Simply click "Previous" button below, then click "Next" to reload this view.</span>
        </div>
      );
    }

    if (!device) {
      return (
        <div
          className="flex flex-col justify-center bg-gray-200 rounded"
          style={{ height: 444 }}
        >
          <Spin />
        </div>
      );
    }

    return (
      <div
        className="flex flex-col justify-center bg-gray-200 rounded"
        style={{ height: 444 }}
      >
        <WebcamWrapper
          detecting={detecting}
          loading={!streamLoaded || !captureTested}
          onUserMedia={() => setStreamLoaded(true)}
          onUserMediaError={() => setError(true)}
          ref={webcamRef}
          videoConstraints={{ deviceId: device.deviceId }}
        />
      </div>
    );
  };

  const faceClassDoneCount = countFaceClassDone(faces);

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
      <div className="flex justify-between space-x-2 mt-2">
        {faces.map((sameAngleFaces, i) => (
          <div className="flex-1" key={i}>
            <div
              className="w-full relative bg-gray-200 rounded"
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
              <Form.Item label="Faces layout">
                <Radio.Group
                  onChange={e => {
                    dispatch({
                      payload: {
                        facesLayout: e.target.value,
                      },
                      type: SET_FACES_LAYOUT,
                    });
                    setSettingsVisible(false);
                  }}
                  size="small"
                  value={facesLayout}
                >
                  {FACES_LAYOUT.map(layout => (
                    <Radio.Button key={layout} value={layout}>
                      {layout.charAt(0).toUpperCase() +
                        layout.slice(1).toLowerCase()}
                    </Radio.Button>
                  ))}
                </Radio.Group>
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
          loading={!streamLoaded || !captureTested}
          onClick={handleDetectionToggle}
        >
          {detecting ? 'Pause Detecting' : 'Start Detecting'}
        </Button>
        <Button className="ml-2" onClick={onPrev}>
          Previous
        </Button>
        <Button
          className="ml-2"
          disabled={faceClassDoneCount < 9}
          onClick={onNext}
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
    className={classNames('relative p-1 rounded', {
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
      className={classNames('rounded', { 'opacity-50': loading })}
      ref={ref}
      screenshotFormat="image/jpeg"
      {...rest}
    />
  </div>
));

const hasFace = async base64 => {
  try {
    const inputImg = new Image();
    inputImg.src = base64;

    // const { detection } =

    return !!(await faceapi.detectSingleFace(
      inputImg,
      new faceapi.MtcnnOptions({
        minFaceSize: 128,
      })
    ));
  } catch (e) {
    return false;
  }
};

const FACES_LAYOUT = ['FLEX', 'GRID', 'NONE'];
const MODEL_URL = 'models';
const MESSAGE_KEY = 'face-found';

Promise.all([
  faceapi.nets.mtcnn.loadFromUri(MODEL_URL),
  // faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  // faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
  // faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  // faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
])
  .then(console.log('Load models succeeded!'))
  .catch(() => console.log(`Load models failed!`));

const generateNewFaces = (currentFaces, faceClass, newFace) => {
  if (currentFaces[faceClass].length < 4) {
    if (faceClass === 1 || faceClass === 4 || faceClass === 7) {
      return currentFaces.map((sameAngleFaces, i) => {
        if (i === faceClass - 1 && sameAngleFaces.length === 0) {
          return [newFace];
        }

        if (i === faceClass) {
          return [...sameAngleFaces, newFace];
        }

        if (i === faceClass + 1 && sameAngleFaces.length === 0) {
          return [newFace];
        }

        return sameAngleFaces;
      });
    }

    return currentFaces.map((sameAngleFaces, i) => {
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
        <img alt="face" className="rounded" src={sameAngleFaces[0]} />
      )}
      {sameAngleFaces.length === 2 && (
        <img alt="face" className="rounded" src={sameAngleFaces[1]} />
      )}
      {sameAngleFaces.length > 2 && (
        <Popover
          className="cursor-pointer"
          content={
            <div className="flex justify-between space-x-4">
              {sameAngleFaces.slice(1).map((face, i) => (
                <div className="w-16 h-16" key={i}>
                  <div
                    className="w-full relative bg-gray-200 rounded"
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
                        className="rounded cursor-pointer"
                        src={face}
                      />

                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
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
          <img alt="face" className="rounded" src={sameAngleFaces[1]} />
        </Popover>
      )}
      {sameAngleFaces.length > 2 && (
        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
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

const INIT_FACES = Array(9).fill([]);
