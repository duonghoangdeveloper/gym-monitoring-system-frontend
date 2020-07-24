import { Button } from 'antd';
import * as faceapi from 'face-api.js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const MODEL_URL = 'models';

Promise.all([faceapi.nets.mtcnn.loadFromUri(MODEL_URL)])
  .then(console.log('Load models succeeded!'))
  .catch(e => console.log(`Load models failed!`));

export const UsersCreateCustomerStep2View = ({ onNext, onPrev }) => {
  const webcamRef = useRef(null);
  const [images, setImages] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  const [device, setDevice] = useState([]);

  const detectDevice = React.useCallback(
    mediaDevices =>
      setDevice(
        mediaDevices.filter(({ kind }) => kind === 'videoinput').slice(-1)[0]
      ),
    []
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(detectDevice);
  }, []);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const base64Faces = await detectFacesFromBase64(imageSrc);
    await detectFacesFromBase64(imageSrc);
    setImages([...images, ...base64Faces]);
  }, [webcamRef, images]);

  return (
    <div>
      <div className="flex items-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ borderRadius: 2, height: 444, width: 592 }}
          videoConstraints={{ deviceId: device.deviceId }}
        />
      </div>
      <div className="flex items-center flex-row flex-wrap">
        {images
          ? images.map((image, i) => (
              <img alt={i} className="w-2/6" key={i} src={image} />
            ))
          : 'NOT'}
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={capture}>Capture photo</Button>
        <Button className="ml-2" onClick={onPrev}>
          Previous
        </Button>
        <Button className="ml-2" onClick={onNext} type="primary">
          Next
        </Button>
      </div>
    </div>
  );
};

const detectFacesFromBase64 = async base64 => {
  const inputImg = new Image();
  inputImg.src = base64;

  const mtcnnForwardParams = {
    minFaceSize: 100,
  };

  const detections = await faceapi.mtcnn(inputImg, mtcnnForwardParams);
  console.log(detections);

  const base64Faces = detections.map(({ detection }) => {
    const { _height, _width, _x, _y } = detection.box;
    const canvas = document.createElement('canvas');
    canvas.width = _width;
    canvas.height = _height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(inputImg, _x, _y, _width, _height, 0, 0, _width, _height);

    return canvas.toDataURL('image/jpeg');
  });

  return base64Faces;
};
