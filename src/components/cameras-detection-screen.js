import { encode } from 'base64-arraybuffer';
import React, { useEffect, useRef } from 'react';
import { Circle, Group, Layer, Line, Rect, Stage, Text } from 'react-konva';

import { calculate2LineTails } from '../common/services';
import { CommonKonvaImage } from './common-konva-image';

export const CamerasDetectionScreen = ({ detectionData }) => {
  const src = `data:image/jpeg;base64,${encode(detectionData.screenshot.data)}`;
  const ref = useRef(null);

  const relativeDimensions = {
    height: ref.current?.offsetHeight,
    width: ref.current?.offsetWidth,
  };

  console.log(detectionData);

  return (
    <div className="w-full self-center">
      <div
        className="relative p-1"
        style={{
          paddingTop: '56.25%',
        }}
      >
        <div className="absolute inset-0 m-1" ref={ref}>
          <Stage
            height={relativeDimensions.height}
            width={relativeDimensions.width}
          >
            <Layer>
              <CommonKonvaImage
                height={relativeDimensions.height}
                src={src}
                width={relativeDimensions.width}
              />
              {detectionData?.poses?.map(
                ({
                  leftAnkle,
                  leftElbow,
                  leftEye,
                  leftHip,
                  leftKnee,
                  leftShoulder,
                  leftWrist,
                  rightAnkle,
                  rightElbow,
                  rightEye,
                  rightHip,
                  rightKnee,
                  rightShoulder,
                  rightWrist,
                }) => {
                  const points = [
                    leftEye && getRelativePoint(leftEye, relativeDimensions),
                    rightEye && getRelativePoint(rightEye, relativeDimensions),
                    leftShoulder &&
                      getRelativePoint(leftShoulder, relativeDimensions),
                    rightShoulder &&
                      getRelativePoint(rightShoulder, relativeDimensions),
                    leftWrist &&
                      getRelativePoint(leftWrist, relativeDimensions),
                    rightWrist &&
                      getRelativePoint(rightWrist, relativeDimensions),
                    leftElbow &&
                      getRelativePoint(leftElbow, relativeDimensions),
                    rightElbow &&
                      getRelativePoint(rightElbow, relativeDimensions),
                    leftHip && getRelativePoint(leftHip, relativeDimensions),
                    rightHip && getRelativePoint(rightHip, relativeDimensions),
                    leftKnee && getRelativePoint(leftKnee, relativeDimensions),
                    rightKnee &&
                      getRelativePoint(rightKnee, relativeDimensions),
                    leftAnkle &&
                      getRelativePoint(leftAnkle, relativeDimensions),
                    rightAnkle &&
                      getRelativePoint(rightAnkle, relativeDimensions),
                  ].filter(_ => _);
                  // console.log(points);
                  return (
                    <Group>
                      {points.map((point, i) => (
                        <Circle
                          fill="#ff0000"
                          key={`${i}-${point.x}-${point.y}`}
                          radius={3}
                          x={point.x}
                          y={point.y}
                        />
                      ))}
                    </Group>
                  );
                }
              )}
              {detectionData?.faces?.map(face => {
                const point1 = getRelativePoint(
                  { x: face.left, y: face.top },
                  relativeDimensions
                );
                const point2 = getRelativePoint(
                  { x: face.right, y: face.bottom },
                  relativeDimensions
                );
                if (!point1 || !point2) {
                  return null;
                }
                const { x, y } = point1;
                const width = point2.x - point1.x;
                const height = point2.y - point1.y;
                return (
                  <Group>
                    <Text fontSize={16} text={face.label} />
                    <Rect
                      height={height}
                      id={face.label}
                      stroke="#00ff00"
                      strokeWidth={3}
                      width={width}
                      x={x}
                      y={y}
                    />
                  </Group>
                );
              })}
              {detectionData?.barbells?.map((barbell, i) => {
                const point1 = getRelativePoint(
                  { x: barbell.left, y: barbell.top },
                  relativeDimensions
                );
                const point2 = getRelativePoint(
                  { x: barbell.right, y: barbell.bottom },
                  relativeDimensions
                );
                if (!point1 || !point2) {
                  return null;
                }
                const { x, y } = point1;
                const width = point2.x - point1.x;
                const height = point2.y - point1.y;
                return (
                  <Group>
                    <Rect
                      height={height}
                      id={i}
                      stroke="#0000ff"
                      strokeWidth={3}
                      width={width}
                      x={x}
                      y={y}
                    />

                    {console.log(barbell.lines) ||
                      barbell.lines.map(({ tails }) => {
                        const relativeTails = tails
                          .map(tail =>
                            getRelativePoint(tail, relativeDimensions)
                          )
                          .map(tail => ({
                            x: x + tail.x,
                            y: y + tail.y,
                          }));

                        if (relativeTails?.length === 2) {
                          return (
                            <Line
                              closed
                              points={[
                                relativeTails[0].x,
                                relativeTails[0].y,
                                relativeTails[1].x,
                                relativeTails[1].y,
                              ]}
                              stroke="#0000ff"
                              strokeWidth={1}
                            />
                          );
                        }
                      })}
                  </Group>
                );
              })}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

const getRelativePoint = (
  absolutePoint,
  relativeDimensions,
  absoluteDimensions = {
    height: 1080,
    width: 1920,
  }
) => {
  if (
    typeof absolutePoint?.x === 'number' &&
    typeof absolutePoint?.y === 'number' &&
    typeof relativeDimensions?.width === 'number' &&
    typeof relativeDimensions?.height === 'number' &&
    typeof absoluteDimensions?.width === 'number' &&
    typeof absoluteDimensions?.height === 'number'
  ) {
    return {
      x:
        (relativeDimensions.width * absolutePoint.x) / absoluteDimensions.width,
      y:
        (relativeDimensions.height * absolutePoint.y) /
        absoluteDimensions.height,
    };
  }
};
