import { Control, useController, UseFieldArrayReturn } from 'react-hook-form';
import { Slider } from 'antd';
import React from 'react';
import { FormType } from '../../common/type.ts';

export const PointInput = (props: {
  control: Control<FormType.Type> | undefined;
  points: UseFieldArrayReturn<FormType, 'points'>;
  i: number;
}) => {
  const { control, points, i } = props;
  const label = useController({ control, name: `points.${i}.label` });
  const x = useController({ control, name: `points.${i}.x` });
  const y = useController({ control, name: `points.${i}.y` });
  return (
    <div className="Point">
      <span>Point {i + 1}: </span>
      <div className="Label">
        <label>ラベル</label>
        <input {...label.field} />
      </div>
      <div className="SliderContainer">
        <label>X</label>
        <Slider style={{ width: '100%' }} {...x.field} railStyle={{ background: 'grey' }} />
      </div>
      <div className="SliderContainer">
        <label>Y</label>
        <Slider style={{ width: '100%' }} {...y.field} railStyle={{ background: 'grey' }} />
      </div>
      <span onClick={() => points.remove(i)}>🗑️</span>
    </div>
  );
};
