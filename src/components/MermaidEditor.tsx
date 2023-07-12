import './MermaidEditor.scss';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Control, useController, useFieldArray, useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { FormType } from '../common/type';
import { QueryParamConverter } from '../common/queryParamConverter';
import { PointInput } from './Inputs/Point.tsx';

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

const AxisInput = (props: { control: Control<FormType.Type, any> }) => {
  const { control } = props;

  const x軸左 = useController({ control, name: 'x軸左' });
  const x軸右 = useController({ control, name: 'x軸右' });
  const y軸上 = useController({ control, name: 'y軸上' });
  const y軸下 = useController({ control, name: 'y軸下' });

  return (
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
  );
};

function QuadrantInput(props: { control: Control<FormType.Type, any> }) {
  const { control } = props;

  const 第1象限 = useController({ control, name: '第1象限' });
  const 第2象限 = useController({ control, name: '第2象限' });
  const 第3象限 = useController({ control, name: '第3象限' });
  const 第4象限 = useController({ control, name: '第4象限' });
  return (
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
  );
}

const PointsInput = (props: { control: Control<FormType.Type, any> }) => {
  const { control } = props;
  const points = useFieldArray({ control, name: 'points' });
  const appendPointHandler = () => points.append(new FormType.Point('新規', 50, 50));
  return (
    <div className="Points">
      {points.fields.map((pointField, i) => {
        return <PointInput key={pointField.id} control={control} index={i} onRemove={points.remove} />;
      })}
      <div className="ButtonContainer">
        <button onClick={appendPointHandler}>ポイントを追加</button>
      </div>
    </div>
  );
};

const CopyContainer = (props: { renderedSvg: string; graphDef: string }) => {
  const { renderedSvg, graphDef } = props;

  const mdString = () => `\`\`\`mermaid
${graphDef}
\`\`\`
[編集](${window.location.href})
`;

  const copyMdHandler = () => {
    navigator.clipboard.writeText(mdString());
  };

  const copySvgHandler = () => navigator.clipboard.writeText(renderedSvg);

  return (
    <div className="CopyContainer">
      <button onClick={copyMdHandler}>MD</button>
      {/*  copy svg to clip board */}
      <button onClick={copySvgHandler}>SVG</button>
    </div>
  );
};

export const MermaidEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // URLのクエリパラメーターからデフォルト値を取得する
  const [defaultFormValue] = useState(QueryParamConverter.parseUrl());
  const [renderedSvg, setRenderedSvg] = useState('');

  const { control, watch } = useForm<FormType>({
    mode: 'all',
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

  const values = watch();
  const graphDef = graphDefinition(values);

  const title = useController({ control, name: 'title' });

  useEffect(() => {
    // URLに状態を保存
    const query = QueryParamConverter.toQuery(values);
    history.pushState(null, '', `?${query}`);

    // 再度描画
    mermaid
      .render('MermaidContainer', graphDef)
      .then(({ svg }) => {
        debouncedRenderSvg(svg);
      })
      .catch(console.error);
  }, [containerRef.current, graphDef]);

  const [detailSettings, setDetailSettings] = useState(false);

  console.log('render');
  return (
    <div className={'MermaidEditor'}>
      <h1 className="Heading">Mermaid.js 4象限グラフ エディター</h1>
      <div className="Form">
        <div className="Title">
          <label>タイトル</label>
          <input type="text" {...title.field} />
        </div>

        <h2>軸の設定</h2>
        <AxisInput control={control} />

        <h2>各象限の名前</h2>
        <QuadrantInput control={control} />

        <h2>プロット</h2>
        <PointsInput control={control} />
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
      <CopyContainer graphDef={graphDef} renderedSvg={renderedSvg} />
    </div>
  );
};
