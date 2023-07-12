import { FormType } from './type.ts';

export namespace QueryParamConverter {
  type Value = [string, string, string, string, string, string, string, string, string, FormType.Point[]];
  type ValueLength = Value['length'];
  const valueLength = 10 satisfies ValueLength;

  export const toQuery = (form: FormType) => {
    const { title, x軸左, x軸右, y軸上, y軸下, 第1象限, 第2象限, 第3象限, 第4象限, points } = form;
    const value = [title, x軸左, x軸右, y軸上, y軸下, 第1象限, 第2象限, 第3象限, 第4象限, points] satisfies Value;
    const valueString = JSON.stringify(value);
    return `q=${encodeURIComponent(valueString)}`;
  };
  export const parseUrl = (): FormType => {
    const params = new URLSearchParams(decodeURIComponent(window.location.search));
    const q = params.get('q');
    if (!q) return FormType.Default();
    const parsed = JSON.parse(q || '[]') as Value;

    // QueryParameterに指定された条件が不正な場合はデフォルト値を返す
    if (parsed.length !== valueLength) {
      console.warn('QueryParameterに指定された条件が不正');
      return FormType.Default();
    }

    const [title, x軸左, x軸右, y軸上, y軸下, 第1象限, 第2象限, 第3象限, 第4象限, points] = parsed;
    return {
      title: title || '',
      x軸左: x軸左 || '',
      x軸右: x軸右 || '',
      y軸上: y軸上 || '',
      y軸下: y軸下 || '',
      第1象限: 第1象限 || '',
      第2象限: 第2象限 || '',
      第3象限: 第3象限 || '',
      第4象限: 第4象限 || '',
      points: (points || []).map(i => new FormType.Point(i.label, i.x, i.y)),
    } satisfies FormType;
  };
}
