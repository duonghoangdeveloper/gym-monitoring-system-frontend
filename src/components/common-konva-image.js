import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

export const CommonKonvaImage = ({ src, ...rest }) => {
  const [image] = useImage(src);
  return <Image image={image} {...rest} />;
};
