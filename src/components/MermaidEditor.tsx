import './MermaidEditor.scss';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  Control,
  Controller,
  ControllerRenderProps,
  useController,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
// import { PointInput } from './Inputs/Point.tsx';
import { FormType } from '../common/type';
import { QueryParamConverter } from '../common/queryParamConverter';
import { Slider } from 'antd';

const graphDefinition = (form: FormType) => {
  const { title, x軸左, x軸右, y軸上, y軸下, 第1象限, 第2象限, 第3象限, 第4象限, points } = form;

  return (
    `quadrantChart
    title ${title}
    x-axis "${x軸左 || '(x軸左)'}" --> "${x軸右 || '(x軸右)'}"
    y-axis "${y軸下 || '(y軸下)'}" --> "${y軸上 || '(y軸上)'}"   
    quadrant-1 "${第1象限 || '(第1象限)'}"
    quadrant-2 "${第2象限 || '(第2象限)'}"
    quadrant-3 "${第3象限 || '(第3象限)'}"
    quadrant-4 "${第4象限 || '(第4象限)'}"
` +
    points
      .map(p => `    "${p.label || '未入力'}": [${Number(p.x) / 100 || 0.5}, ${Number(p.y) / 100 || 0.5}]`)
      .join('\n')
  );
};

export const MermaidEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // URLのクエリパラメーターからデフォルト値を取得する
  const [defaultFormValue] = useState(QueryParamConverter.parseUrl());
  const [renderedSvg, setRenderedSvg] = useState('');

  const { control, getValues, register, reset } = useForm<FormType>({
    mode: 'onChange',
    defaultValues: defaultFormValue,
  });

  // mermaidを初期化
  useEffect(() => {
    mermaid.initialize({});
  }, []);

  const [svgDataUrl, setSvgDataUrl] = useState('');

  const setSvg = (svg: string) => {
    setRenderedSvg(svg);
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    setSvgDataUrl(dataUrl);
  };
  const debouncedRenderSvg = useDebouncedCallback(setSvg, 50);

  const values = getValues();
  const graphDef = graphDefinition(values);

  const title = useController({ control, name: 'title' });
  const x軸左 = useController({ control, name: 'x軸左' });
  const x軸右 = useController({ control, name: 'x軸右' });
  const y軸上 = useController({ control, name: 'y軸上' });
  const y軸下 = useController({ control, name: 'y軸下' });
  const 第1象限 = useController({ control, name: '第1象限' });
  const 第2象限 = useController({ control, name: '第2象限' });
  const 第3象限 = useController({ control, name: '第3象限' });
  const 第4象限 = useController({ control, name: '第4象限' });
  const points = useFieldArray({ control, name: 'points' });

  useEffect(() => {
    // URLに状態を保存
    const query = QueryParamConverter.toQuery(values);
    history.pushState(null, '', `?${query}`);

    mermaid // 再度描画
      .render('MermaidContainer', graphDef)
      .then(({ svg }) => {
        debouncedRenderSvg(svg);
        // container.innerHTML = svg;
        // setSvg(svg);
        // refresh();
      })
      .catch(console.error);
  }, [containerRef.current, graphDef]);

  const [detailSettings, setDetailSettings] = useState(false);

  return (
    <div className={'MermaidEditor'}>
      <h1>mermaid editor</h1>
      <div className="Form">
        <div className="Title">
          <label>タイトル</label>
          <input type="text" {...title.field} />
        </div>
        <h2>軸の設定</h2>
        <div className="Axis">
          <div className="X Minus">
            <label>x軸(-)</label>
            <input {...x軸左.field} />
          </div>
          {/*<span className="Arrow">{'-->'}</span>*/}
          <div className="X Plus">
            <label>x軸(+)</label>
            <input {...x軸右.field} />
          </div>
          <div className="Y Minus">
            <label>y軸(-)</label>
            <input {...y軸下.field} />
          </div>
          {/*<span className="Arrow">{'-->'}</span>*/}
          <div className="Y Plus">
            <label>y軸(+)</label>
            <input {...y軸上.field} />
          </div>
        </div>
        <h2>各象限の名前</h2>
        <div className="Quadrant">
          <div className="SingleField D1">
            <label>第1象限</label>
            <input type="text" {...第1象限.field} />
          </div>
          <div className="SingleField D2">
            <label>第2象限</label>
            <input type="text" {...第2象限.field} />
          </div>
          <div className="SingleField D3">
            <label>第3象限</label>
            <input type="text" {...第3象限.field} />
          </div>
          <div className="SingleField D4">
            <label>第4象限</label>
            <input type="text" {...第4象限.field} />
          </div>
        </div>
        <h2>プロット</h2>
        <div className="Points">
          {points.fields.map((pointField, i) => {
            const labelName = `points.${i}.label` as const;
            const xName = `points.${i}.x` as const;
            const yName = `points.${i}.y` as const;
            // const label = useController({ control, name: labelName });
            // const x = useController({ control, name: `points.${i}.x` });
            // const y = useController({ control, name: `points.${i}.y` });
            // なぜかresetしないと値が変わらない
            const mod = (i: ControllerRenderProps) => {
              return {
                ...i,
                onChange: (e: any) => {
                  i.onChange(e);
                  reset();
                },
              };
            };
            // const label = mod(register(labelName));
            // const x = mod(register(xName));
            // const y = mod(register(yName));

            return (
              <div className="Point" key={pointField.id}>
                <span>Point {i + 1}: </span>
                <Controller
                  name={labelName}
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="Label">
                        <label>ラベル</label>
                        <input {...mod(field)} />
                      </div>
                    );
                  }}
                />
                <Controller
                  name={xName}
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="SliderContainer">
                        <label>X</label>
                        <Slider style={{ width: '100%' }} {...mod(field)} railStyle={{ background: 'grey' }} />
                      </div>
                    );
                  }}
                />
                <Controller
                  name={yName}
                  control={control}
                  render={({ field }) => {
                    return (
                      <div className="SliderContainer">
                        <label>Y</label>
                        <Slider style={{ width: '100%' }} {...mod(field)} railStyle={{ background: 'grey' }} />
                      </div>
                    );
                  }}
                />
                <span onClick={() => points.remove(i)}>🗑️</span>
              </div>
            );
          })}
          <div className="ButtonContainer">
            <button onClick={() => points.append(new FormType.Point('新規', 50, 50))}>ポイントを追加</button>
          </div>
        </div>
        <div className={`DetailSettings ${detailSettings ? 'Open' : 'Closed'}`}>
          <h3 onClick={() => setDetailSettings(pre => !pre)}>
            詳細設定 <span className="Icon">◀︎</span>
          </h3>
          <div className="Inputs"></div>
        </div>
      </div>
      <div className="SvgContainer">
        <img src={svgDataUrl} />
      </div>

      <h2>Markdown</h2>
      <pre>
        <code>{graphDef}</code>
      </pre>

      <h2>コピー</h2>
      <div className="CopyContainer">
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              `\`\`\`mermaid
${graphDef}
\`\`\`
[編集](${window.location.href})
`,
            )
          }
        >
          MD
        </button>
        {/*  copy svg to clip board */}
        <button onClick={() => navigator.clipboard.writeText(renderedSvg)}>SVG</button>
      </div>
    </div>
  );
};
