import './MermaidEditor.scss';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useController, useForm, Form } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

type FormType = {
  title: string;
  x軸左: string;
  x軸右: string;
  y軸上: string;
  y軸下: string;
  第1象限: string;
  第2象限: string;
  第3象限: string;
  第4象限: string;
};
namespace FormType {
  export const Default = () => ({
    title: '',
    x軸左: '',
    x軸右: '',
    y軸上: '',
    y軸下: '',
    第1象限: '',
    第2象限: '',
    第3象限: '',
    第4象限: '',
  });
}

namespace QueryParamConverter {
  export const toQuery = (form: FormType) => {
    const { title, x軸左, x軸右, y軸上, y軸下, 第1象限, 第2象限, 第3象限, 第4象限 } = form;
    const valueString = JSON.stringify([title, x軸左, x軸右, y軸上, y軸下, 第1象限, 第2象限, 第3象限, 第4象限]);
    return `q=${encodeURIComponent(valueString)}`;
  };
  export const parseUrl = (): FormType => {
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const q = params.get('q');
    if (!q) return FormType.Default();
    const array = JSON.parse(q || '[]');
    return {
      title: array[0] || '',
      x軸左: array[1] || '',
      x軸右: array[2] || '',
      y軸上: array[3] || '',
      y軸下: array[4] || '',
      第1象限: array[5] || '',
      第2象限: array[6] || '',
      第3象限: array[7] || '',
      第4象限: array[8] || '',
    };
  };
}

const graphDefinition = (form: FormType) => {
  const { title, x軸左, x軸右, y軸上, y軸下, 第1象限, 第2象限, 第3象限, 第4象限 } = form;
  return `
quadrantChart
    title ${title}
    x-axis "${x軸左 || '(x軸左)'}" --> "${x軸右 || '(x軸右)'}"
    y-axis "${y軸下 || '(y軸下)'}" --> "${y軸上 || '(y軸上)'}"   
    quadrant-1 "${第1象限 || '(第1象限)'}"
    quadrant-2 "${第2象限 || '(第2象限)'}"
    quadrant-3 "${第3象限 || '(第3象限)'}"
    quadrant-4 "${第4象限 || '(第4象限)'}"
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
`;
};

export const MermaidEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // URLのクエリパラメーターからデフォルト値を取得する
  const [defaultFormValue] = useState(QueryParamConverter.parseUrl());

  const { control, getValues, reset } = useForm<FormType>({
    mode: 'onChange',
    defaultValues: defaultFormValue,
  });

  // mermaidを初期化
  useEffect(() => {
    mermaid.initialize({});
  }, []);

  // const [debouncedFormValue, setDebouncedFormValue] = useState(getValues());
  // const debounced = useDebouncedCallback(value => setDebouncedFormValue(value), 300);

  const values = getValues();
  const graphDef = graphDefinition(values);

  // const debounced = useDebouncedCallback(
  //     // function
  //     (value) => {
  //       setValue(value);
  //     },
  //     // delay in ms
  //     1000
  // );

  const title = useController({ control, name: 'title' });
  const x軸左 = useController({ control, name: 'x軸左' });
  const x軸右 = useController({ control, name: 'x軸右' });
  const y軸上 = useController({ control, name: 'y軸上' });
  const y軸下 = useController({ control, name: 'y軸下' });
  const 第1象限 = useController({ control, name: '第1象限' });
  const 第2象限 = useController({ control, name: '第2象限' });
  const 第3象限 = useController({ control, name: '第3象限' });
  const 第4象限 = useController({ control, name: '第4象限' });

  const [, setRefresher] = useState(0);
  const refresh = () => setRefresher(pre => pre + 1);

  useEffect(() => {
    console.log('value changed', values);
    const container = containerRef.current;
    if (!container) return;

    // URLに状態を保存
    const query = QueryParamConverter.toQuery(values);
    console.log('query', query);
    history.pushState(null, '', `?${query}`);

    mermaid // 再度描画
      .render('MermaidContainer', graphDef)
      .then(({ svg }) => {
        console.log('render');
        container.innerHTML = svg;
        refresh();
      })
      .catch(console.error);
  }, [containerRef.current, graphDef]);

  return (
    <div className={'MermaidEditor'}>
      <h1>mermaid editor</h1>
      <div className="Form">
        <div className="SingleField">
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
          <div className="CenterArrow">
            <span className="Arrow">{}</span>
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
      </div>
      <div className="MermaidContainer" ref={containerRef}></div>

      <pre>
        <code>{graphDef} </code>
      </pre>
    </div>
  );
};
