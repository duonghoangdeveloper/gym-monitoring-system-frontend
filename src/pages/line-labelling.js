import {
  CloseOutlined,
  DownloadOutlined,
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  message,
  Modal,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Circle, Layer, Line, Rect, Stage } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';

import {
  fileToBase64,
  getBase64ImageDimensions,
  round,
  validateFile,
  validateNumber,
} from '../common/services';
import { CommonKonvaImage } from '../components/common-konva-image';
import { CommonMainContainer } from '../components/common-main-container';
import { LayoutDashboard } from '../components/layout-dashboard';
import { LINE_LABELLING_SET_PREVIEW_IMAGE_SIZE } from '../redux/common/common.types';

export const LineLabelling = () => {
  const [settingsForm] = Form.useForm();
  const [filesData, setFilesData] = useState([]);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const { downloadImageSize, previewImageSize } = useSelector(
    state => state.common.lineLabelling
  );
  const dispatch = useDispatch();

  const handleChange = ({ fileList }) => {
    const newFilesData = generateNewFilesData(
      filesData,
      fileList
        .filter(file => validateFile(file))
        .map(file => ({
          base64: null,
          dimensions: null,
          file,
          key: file.uid,
          originPoint: null,
          theta0: null,
          theta1: null,
        }))
    );
    setFilesData(newFilesData);
  };

  useEffect(() => {
    // Generate base64 for all fileData
    (async () => {
      if (filesData.some(({ base64 }) => !base64)) {
        const newFilesData = await Promise.all(
          filesData.map(async fileData => {
            const base64 =
              fileData.base64 ||
              (await fileToBase64(fileData.file.originFileObj));
            const dimensions = await getBase64ImageDimensions(base64);
            return {
              ...fileData,
              base64,
              dimensions,
            };
          })
        );
        setFilesData(newFilesData);
      }
    })();
  }, [filesData]);

  const generateCanvasClickHandler = key => event => {
    const { offsetX, offsetY } = event.evt;
    const clickedPoint = { x: offsetX, y: offsetY };
    const { originPoint, theta0, theta1 } = filesData.find(
      fileData => fileData.key === key
    );
    const newOriginPoint = originPoint ? null : clickedPoint;
    const { theta0: newTheta0, theta1: newTheta1 } = originPoint
      ? lineFromPoints(originPoint, clickedPoint)
      : { theta0, theta1 };
    const newFilesData = filesData.map(fileData =>
      fileData.key === key
        ? {
          ...fileData,
          originPoint: newOriginPoint,
          theta0: newTheta0,
          theta1: newTheta1,
        }
        : fileData
    );
    setFilesData(newFilesData);
  };

  const generateDownloadClickHandler = key => async () => {
    const fileData = filesData.find(f => f.key === key);
    try {
      await saveFile(fileData, previewImageSize, downloadImageSize);
      const newFilesData = filesData.filter(f => f.key !== key);
      setFilesData(newFilesData);
    } catch (e) {
      message.error('Save file failed!');
    }
  };

  const generateCloseClickHandler = key => () => {
    const newFilesData = filesData.filter(fileData => fileData.key !== key);
    setFilesData(newFilesData);
  };

  const handleDownloadAllClick = async () => {
    const downloadedKeys = (await Promise.all(
      filesData
        .map(fileData =>
          saveFile(fileData, previewImageSize, downloadImageSize)
        )
        .map(p => p.catch(() => null))
    ))
      .filter(_ => _)
      .map(({ key }) => key);
    const newFilesData = filesData.filter(
      ({ key }) => !downloadedKeys.includes(key)
    );
    setFilesData(newFilesData);
    message.success(`Download ${downloadedKeys.length} images succeeded!`);
  };

  return (
    <LayoutDashboard>
      <CommonMainContainer>
        <div className="flex items-center space-x-4 mb-6">
          <Upload
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess();
              }, 0);
            }}
            fileList={filesData.map(({ file }) => file)}
            multiple
            onChange={handleChange}
            showUploadList={false}
          >
            <Button>
              <UploadOutlined /> Click to Upload
            </Button>
          </Upload>
          <span>{filesData.length} images</span>
          <div className="flex-1 flex justify-end space-x-2">
            <Button
              disabled={filesData.length === 0}
              icon={<DownloadOutlined />}
              onClick={handleDownloadAllClick}
              type="primary"
            >
              Download All
            </Button>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setSettingsModalVisible(true)}
            />
            <Modal
              maskClosable={false}
              onCancel={() => {
                setSettingsModalVisible(false);
                setTimeout(() => settingsForm.resetFields(), 500);
              }}
              onOk={() => settingsForm.submit()}
              title="Line Labelling Settings"
              visible={settingsModalVisible}
            >
              <Form
                form={settingsForm}
                initialValues={{
                  downloadImageSize,
                  previewImageSize,
                }}
                layout="vertical"
                onFinish={values => {
                  dispatch({
                    payload: {
                      previewImageSize: values.previewImageSize,
                    },
                    type: LINE_LABELLING_SET_PREVIEW_IMAGE_SIZE,
                  });
                  setSettingsModalVisible(false);
                  setTimeout(() => settingsForm.resetFields(), 500);
                }}
              >
                <Form.Item
                  label="Preview Image Size"
                  name="previewImageSize"
                  rules={[
                    {
                      message: 'Please input preview image size',
                      required: true,
                    },
                    {
                      message: 'Preview image size must be at least 256px',
                      min: 256,
                      type: 'number',
                    },
                    {
                      max: 1024,
                      message: 'Preview image size must be at most 1024px',
                      type: 'number',
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter preview image size"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Form.Item
                  label="Download Image Size"
                  name="downloadImageSize"
                  rules={[
                    {
                      message: 'Please input download image size',
                      required: true,
                    },
                  ]}
                >
                  <InputNumber
                    disabled
                    placeholder="Enter download image size"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        <div className="flex flex-col">
          {filesData.map((fileData, i) => {
            const lineTails = calculate2LineTails(
              fileData.theta0,
              fileData.theta1,
              previewImageSize
            );
            const validToSave =
              validateNumber(fileData.theta0) &&
              validateNumber(fileData.theta1) &&
              lineTails.length === 2;
            return (
              <>
                <div className="flex space-x-6" key={fileData.key}>
                  <Stage
                    height={previewImageSize}
                    onClick={generateCanvasClickHandler(fileData.key)}
                    width={previewImageSize}
                  >
                    <Layer>
                      <Rect
                        fill="#000000"
                        height={previewImageSize}
                        width={previewImageSize}
                      />
                      <CommonKonvaImage
                        src={fileData.base64}
                        {...getImagePropsFromDimensions(
                          fileData.dimensions,
                          previewImageSize
                        )}
                      />
                      {fileData.originPoint && (
                        <Circle
                          fill="#00ff00"
                          radius={3}
                          x={fileData.originPoint.x}
                          y={fileData.originPoint.y}
                        />
                      )}
                      {validToSave && (
                        <Line
                          closed
                          fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
                          fillLinearGradientEndPoint={{ x: 50, y: 50 }}
                          fillLinearGradientStartPoint={{ x: -50, y: -50 }}
                          points={[
                            lineTails[0].x,
                            lineTails[0].y,
                            lineTails[1].x,
                            lineTails[1].y,
                          ]}
                          stroke="#00ff00"
                        />
                      )}
                    </Layer>
                  </Stage>
                  <div className="flex-1 flex flex-col space-y-6">
                    <Descriptions column={1}>
                      <Descriptions.Item label="Line">
                        y = &#920;<sub>0</sub> + &#920;<sub>1</sub>x
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            &#920;<sub>0</sub>
                          </>
                        }
                      >
                        {validToSave
                          ? round(fileData.theta0 / previewImageSize, 6)
                          : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={
                          <>
                            &#920;<sub>1</sub>
                          </>
                        }
                      >
                        {validToSave ? round(fileData.theta1, 6) : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Filename">
                        {validToSave
                          ? `${round(
                            fileData.theta0 / previewImageSize,
                            6
                          )}_${round(fileData.theta1, 6)}.jpeg`
                          : 'N/A'}
                      </Descriptions.Item>
                      {/* <Descriptions.Item label="Mime Type">
                        image/jpeg
                      </Descriptions.Item>
                      <Descriptions.Item label="Download Size">
                        {downloadImageSize} x {downloadImageSize}
                      </Descriptions.Item> */}
                    </Descriptions>
                    <div className="flex-1 flex justify-end items-end space-x-2">
                      <Button
                        disabled={!validToSave}
                        icon={<DownloadOutlined />}
                        onClick={generateDownloadClickHandler(fileData.key)}
                        type="primary"
                      >
                        Download & Close
                      </Button>
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={generateCloseClickHandler(fileData.key)}
                        type="primary"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
                {i < filesData.length - 1 && <Divider />}
              </>
            );
          })}
        </div>
      </CommonMainContainer>
    </LayoutDashboard>
  );
};

const generateNewFilesData = (currentFilesData, newFilesData) => {
  const result = [...currentFilesData];
  newFilesData.forEach(newFileData => {
    if (
      !result.some(
        currentFileData =>
          currentFileData.file.lastModified === newFileData.file.lastModified &&
          currentFileData.file.name === newFileData.file.name &&
          currentFileData.file.size === newFileData.file.size &&
          currentFileData.file.type === newFileData.file.type
      )
    ) {
      result.push(newFileData);
    }
  });
  return result;
};

const getImagePropsFromDimensions = (dimensions, canvasSize) => {
  if (dimensions) {
    const { height, width } = dimensions;
    const scaledWidth = Math.round(
      width > height ? canvasSize : (width / height) * canvasSize
    );
    const scaledHeight = Math.round(
      width > height ? (height / width) * canvasSize : canvasSize
    );
    return {
      height: scaledHeight,
      width: scaledWidth,
    };
  }
  return {};
};

const lineFromPoints = (point1, point2) => {
  const a = point2.y - point1.y;
  const b = point1.x - point2.x;
  const c = a * point1.x + b * point1.y;
  return {
    theta0: c / b,
    theta1: (a * -1) / b,
  };
};

const calculate2LineTails = (theta0, theta1, canvasSize) => {
  if (
    theta0 !== null &&
    theta1 !== null &&
    !Number.isNaN(theta0) &&
    !Number.isNaN(theta1)
  ) {
    // Line: y = theta0 + theta1 * x

    // y = 0 => x = - theta0 / theta1
    const topCrossPointX = -theta0 / theta1;
    const topCrossPoint =
      topCrossPointX >= 0 && topCrossPointX <= canvasSize
        ? {
          x: topCrossPointX,
          y: 0,
        }
        : null;

    // x = 0 => y = theta0
    const leftCrossPointY = theta0;
    const leftCrossPoint =
      leftCrossPointY >= 0 && leftCrossPointY <= canvasSize
        ? {
          x: 0,
          y: leftCrossPointY,
        }
        : null;

    // y = canvasSize => x = (canvasSize - theta0) / theta1
    const bottomCrossPointX = (canvasSize - theta0) / theta1;
    const bottomCrossPoint =
      bottomCrossPointX >= 0 && bottomCrossPointX <= canvasSize
        ? {
          x: bottomCrossPointX,
          y: canvasSize,
        }
        : null;

    // x = canvasSize => y = theta0 + theta1 * canvasSize
    const rightCrossPointY = theta0 + theta1 * canvasSize;
    const rightCrossPoint =
      rightCrossPointY >= 0 && rightCrossPointY <= canvasSize
        ? {
          x: canvasSize,
          y: rightCrossPointY,
        }
        : null;

    return [
      topCrossPoint,
      leftCrossPoint,
      bottomCrossPoint,
      rightCrossPoint,
    ].filter(_ => _);
  }

  return [];
};

const saveFile = (fileData, previewImageSize, downloadImageSize) =>
  new Promise((resolve, reject) => {
    const lineTails = calculate2LineTails(
      fileData.theta0,
      fileData.theta1,
      previewImageSize
    );
    const validToSave =
      validateNumber(fileData.theta0) &&
      validateNumber(fileData.theta1) &&
      lineTails.length === 2 &&
      fileData.dimensions;
    if (validToSave) {
      const filename = `${round(fileData.theta0 / previewImageSize, 6)}_${round(
        fileData.theta1,
        6
      )}.jpeg`;
      const image = new window.Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = downloadImageSize;
        canvas.height = downloadImageSize;
        const { height, width } = getImagePropsFromDimensions(
          fileData.dimensions,
          downloadImageSize
        );
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, width, height);
        const link = document.createElement('a');
        link.download = filename;
        canvas.toBlob(blob => {
          link.href = URL.createObjectURL(blob);
          link.click();
          resolve(fileData);
        });
      };
      image.src = fileData.base64;
    } else {
      reject();
    }
  });
