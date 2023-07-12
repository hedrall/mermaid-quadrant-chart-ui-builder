import { Controller, useFieldArray, useForm } from 'react-hook-form';

type Input = {
  points: {
    x: number;
    y: number;
  }[];
};
export const Temp = () => {
  const { control, getValues, watch, setValue, register, reset } = useForm<Input>({
    mode: 'all',
    defaultValues: {
      points: [
        {
          x: 0,
          y: 0,
        },
      ],
    },
  });

  const points = useFieldArray({ control, name: 'points' });

  const values = watch();

  return (
    <div>
      <div>
        {points.fields.map((field, index) => {
          return (
            <div key={field.id}>
              <Controller
                control={control}
                name={`points.${index}.x`}
                render={({ field }) => {
                  return (
                    <div>
                      <input {...field} />
                      <input {...register(`points.${index}.x`)} />
                    </div>
                  );
                }}
              />
            </div>
          );
        })}
      </div>
      <div>
        {values.points.map((p, i) => {
          return (
            <div>
              {i} {p.x}, {p.y}
            </div>
          );
        })}
      </div>
      <div>
        <button
          onClick={() => {
            points.append({ x: 0, y: 0 });
          }}
        >
          append
        </button>
      </div>
    </div>
  );
};
