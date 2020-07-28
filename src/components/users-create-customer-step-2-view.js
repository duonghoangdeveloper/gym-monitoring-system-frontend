import {
  CloseOutlined,
  DeleteOutlined,
  PauseOutlined,
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
  const [faces, setFaces] = useState(Array(9).fill([]));
  // const [error, setError] = useState(false);
  const [device, setDevice] = useState();
  const [streamLoaded, setStreamLoaded] = useState(false);
  const [captureTested, setCaptureTested] = useState(false);
  const [detecting, setDetecting] = useState(false);
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
      setTimeout(async () => {
        try {
          const imageSrc = webcamRef.current.getScreenshot();
          await detectFaceFromBase64(imageSrc);
        } catch (_) {
          // Do nothing
        }
        setCaptureTested(true);
        if (autoDetect) {
          setDetecting(true);
        }
      }, 200);
    }
  }, [device, streamLoaded, captureTested, webcamRef.current]);

  useEffect(() => {
    if (detecting) {
      if (faceFound) {
        message.success({
          content: 'Face detected!',
          duration: 1.5,
          key: MESSAGE_KEY,
        });
      } else {
        message.loading({
          content: 'Face detecting...',
          duration: 0,
          key: MESSAGE_KEY,
        });
      }

      const detectFace = throttle(100, true, async () => {
        // detectingRef.current = true;
        try {
          const imageSrc = webcamRef.current.getScreenshot();
          const detectionResult = await detectFaceFromBase64(imageSrc);
          if (detectionResult) {
            const { image, landmarks } = detectionResult;

            if (!faceFound) {
              setFaceFound(true);
            }
            const blob = base64toBlob(image);
            const formData = new FormData(document.forms[0]);
            formData.append('image', blob);
            formData.append('landmarks', JSON.stringify(landmarks));
            const result = await axios.post(
              `${URI_PYTHON}/face-pose-estimation/`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            const { pitch, roll, yaw } = result.data;
            const faceClass = classifyFacePose(yaw, pitch, roll);

            if (faceClass > -1) {
              if (faces[faceClass].length < 5) {
                setFaces(currentFaces =>
                  generateNewFaces(currentFaces, faceClass, image)
                );
              }
            }
          }
        } catch (_) {
          // Do nothing
        }
        // detectingRef.current = false;
      });
      const intervalId = setInterval(() => {
        // if (!detectingRef.current) {
        detectFace();
        // }
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

    // if (error) {
    //   return 'Error!';
    // }

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
          onUserMediaError={e => console.log(e)}
          ref={webcamRef}
          videoConstraints={{ deviceId: device.deviceId }}
        />
      </div>
    );
  };

  const faceClassDoneCount = countFaceClassDone(faces)

  return (
    <div>
      {generateWebcamView()}
      <Progress percent={Math.round(faceClassDoneCount > 0 ? 100 / 9 * faceClassDoneCount : 0)} />
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
                <FaceView sameAngleFaces={sameAngleFaces} setFaces={setFaces} faceClass={i}/>
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
                    <Radio.Button value={layout}>
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
          icon={detecting ? <PauseOutlined /> : <ThunderboltOutlined />}
          loading={!streamLoaded || !captureTested}
          onClick={handleDetectionToggle}
        >
          {detecting ? 'Pause Detecting' : 'Start Detecting'}
        </Button>
        <Button className="ml-2" onClick={onPrev}>
          Previous
        </Button>
        <Button className="ml-2" onClick={onNext} type="primary" disabled={faceClassDoneCount < 9}>
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

const detectFaceFromBase64 = async base64 => {
  try {
    const inputImg = new Image();
    inputImg.src = base64;

    const { detection, landmarks } = await faceapi
      .detectSingleFace(
        inputImg,
        new faceapi.MtcnnOptions({
          minFaceSize: 100,
        })
      )
      .withFaceLandmarks();

    if (detection && landmarks) {
      const { _height, _width, _x, _y } = detection._box;

      const canvas = document.createElement('canvas');
      canvas.width = _width;
      canvas.height = _height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(inputImg, _x, _y, _width, _height, 0, 0, _width, _height);

      return {
        image: canvas.toDataURL('image/jpeg'),
        landmarks: landmarks._positions.map(point => [
          point._x - _x,
          point._y - _y,
        ]),
      };
    }

    // if (detections.length === 0) {
    //   return null;
    // }

    // const nearestFaceDetection = detections.reduce((prev, current) =>
    //   prev._width > current._width ? prev : current
    // );

    // const { _height, _width, _x, _y } = nearestFaceDetection._box;
    // const canvas = document.createElement('canvas');
    // canvas.width = _width;
    // canvas.height = _height;
    // const ctx = canvas.getContext('2d');

    // ctx.drawImage(inputImg, _x, _y, _width, _height, 0, 0, _width, _height);

    // return canvas.toDataURL('image/jpeg');
  } catch (e) {
    // console.log('x', e);
  }
};

const FACES_LAYOUT = ['FLEX', 'GRID', 'NONE'];
const MODEL_URL = 'models';
const MESSAGE_KEY = 'face-found';

Promise.all([
  faceapi.nets.mtcnn.loadFromUri(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
])
  .then(console.log('Load models succeeded!'))
  .catch(() => console.log(`Load models failed!`));

const classifyFacePose = (yaw, pitch, roll) => {
  if (
    typeof yaw === 'number' &&
    typeof pitch === 'number' &&
    typeof roll === 'number'
  ) {
    return -1;
  }

  if (
    checkApproximation(yaw, -20) &&
    checkApproximation(pitch, -20) &&
    checkApproximation(roll, 0)
  ) {
    return 0;
  }

  if (
    checkApproximation(yaw, 0) &&
    checkApproximation(pitch, -20) &&
    checkApproximation(roll, 0)
  ) {
    return 1;
  }

  if (
    checkApproximation(yaw, 20) &&
    checkApproximation(pitch, -20) &&
    checkApproximation(roll, 0)
  ) {
    return 2;
  }

  if (
    checkApproximation(yaw, -30) &&
    checkApproximation(pitch, 0) &&
    checkApproximation(roll, 0)
  ) {
    return 3;
  }

  if (
    checkApproximation(yaw, 0) &&
    checkApproximation(pitch, 0) &&
    checkApproximation(roll, 0)
  ) {
    return 4;
  }

  if (
    checkApproximation(yaw, 30) &&
    checkApproximation(pitch, 0) &&
    checkApproximation(roll, 0)
  ) {
    return 5;
  }

  if (
    checkApproximation(yaw, -20) &&
    checkApproximation(pitch, 20) &&
    checkApproximation(roll, 0)
  ) {
    return 6;
  }

  if (
    checkApproximation(yaw, 0) &&
    checkApproximation(pitch, 20) &&
    checkApproximation(roll, 0)
  ) {
    return 7;
  }

  if (
    checkApproximation(yaw, 20) &&
    checkApproximation(pitch, 20) &&
    checkApproximation(roll, 0)
  ) {
    return 8;
  }

  return -1;
};

const ERROR = 6;
const checkApproximation = (number1, number2) =>
  Math.abs(number1 - number2) < ERROR;

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

const FaceView = ({ sameAngleFaces, setFaces, faceClass }) => {
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
                    <div className="absolute inset-0">
                      <img
                        alt="face"
                        className="rounded cursor-pointer"
                        src={face}
                        onClick={() => {
                          setFaces(currentFaces => currentFaces.map((_sameAngleFaces, _faceClass) => _faceClass === faceClass && i > 0 ? _sameAngleFaces.map(
                          (_face, j) => j === 1 ? face : j === i + 1 ? _sameAngleFaces[1] : _face
                        ) : _sameAngleFaces))
                          setVisible(false)
                        }}
                      />

                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          size="small"
                          type="primary"
                          onClick={() => {
                            setFaces(currentFaces => currentFaces.map((_sameAngleFaces, _faceClass) => _faceClass === faceClass ? _sameAngleFaces.filter(
                            (_, j) => j !== i + 1
                          ) : _sameAngleFaces))
                          }}
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
      {/* {sameAngleFaces.length === 1 && (
        <div className="absolute top-0 right-0 transform -translate-y-1/2 z-10">
          <Button
                          danger
                          icon={<CloseOutlined />}
                          size="small"
                          type="primary"
                          onClick={() => {
                            setFaces((currentFaces, faceClass) => currentFaces.map(face))
                          ) : _sameAngleFaces))
                          }}
                        />
        </div>
      )} */}
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

const countFaceClassDone = faces => faces.filter(sameAngleFaces => sameAngleFaces.length > 0).length