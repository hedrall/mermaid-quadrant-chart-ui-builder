export namespace FormType {
  export class Point {
    constructor(
      public label: string,
      public x: number,
      public y: number,
    ) {}
  }

  export type Type = {
    title: string;
    x軸左: string;
    x軸右: string;
    y軸上: string;
    y軸下: string;
    第1象限: string;
    第2象限: string;
    第3象限: string;
    第4象限: string;
    points: Point[];
    // details: {
    //   chart: {
    //     width: number;
    //     height: number;
    //   };
    //   title: {
    //     padding: number;
    //     fontSize: number;
    //   };
    //   quadrant: {
    //     padding: number;
    //     textTopPadding: number;
    //     labelFontSize: number;
    //     internalBorderStrokeWidth: number;
    //     externalBorderStrokeWidth: number;
    //   };
    //   xAxis: {
    //     label: {
    //       padding: number;
    //       fontSize: number;
    //     };
    //     Position: 'top' | 'bottom';
    //   };
    //   yAxis: {
    //     label: {
    //       padding: number;
    //       fontSize: number;
    //     };
    //     Position: 'left' | 'right';
    //   };
    //   point: {
    //     textPadding: number;
    //     labelFontSize: number;
    //     radius: number;
    //   };
    //   theme: {
    //     quadrant1:{
    //       fill: string,
    //       TextFill: string,
    //     },
    //     quadrant2:{
    //       fill: string,
    //       TextFill: string,
    //     },
    //     quadrant3:{
    //       fill: string,
    //       TextFill: string,
    //     },
    //     quadrant4:{
    //       fill: string,
    //       TextFill: string,
    //     },
    //     point: {
    //       Fill: string, // quadrantPointFill
    //       TextFill: string, // quadrantPointTextFill
    //     },
    //     xAxisTextFill: string,
    //     yAxisTextFill: string,
    //     internalBorderStrokeFill: string,
    //     externalBorderStrokeFill: string,
    //     titleFill: string,
    //   }
    // };
  };

  export const Default = (): FormType => ({
    title: '',
    x軸左: '',
    x軸右: '',
    y軸上: '',
    y軸下: '',
    第1象限: '',
    第2象限: '',
    第3象限: '',
    第4象限: '',
    points: [],
  });
}
export type FormType = FormType.Type;
