import tinycolor from 'tinycolor2';

export const COLORS = [
  '#B80000',
  '#DB3E00',
  '#EB144C',
  '#FF6900',
  '#FCB900',
  '#DCE775',
  '#808900',
  '#00D084',
  '#006B76',
  '#ABB8C3',
  '#0693E3',
  '#1273DE',
  '#004DCF',
  '#5300EB',
  '#3F51B5',
  '#7B64FF',
  '#9900EF'
];

export function getTextColor(backgroundColor) {
  const color = tinycolor(backgroundColor);

  if (color.isLight()) {
    return color.darken(50).toString();
  }
  return color.lighten(50).toString();
}
