import { Control, useController } from 'react-hook-form';
import { FormType } from '../../common/type.ts';
import { Slider } from 'antd';
import React from 'react';

export const PointInput = (props: {
  control: Control<FormType.Type, any>;
  index: number;
  onRemove: (index: number) => void;
}) => {
  const { control, index, onRemove } = props;

  const labelName = `points.${index}.label` as const;
  const xName = `points.${index}.x` as const;
  const yName = `points.${index}.y` as const;

  const label = useController({ control, name: labelName });
  const x = useController({ control, name: xName });
  const y = useController({ control, name: yName });

  return (
    <div className="Point">
      <span>Point {index + 1}: </span>
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
      <span onClick={() => onRemove(index)}>🗑️</span>
    </div>
  );
};
