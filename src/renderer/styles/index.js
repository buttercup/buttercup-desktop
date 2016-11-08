import 'glamor/reset';
import { style, merge, $ } from 'glamor';
import { spacing, colors } from './variables';

export const flex = style({
  flex: 1,
  display: 'flex'
});

export const stretch = style({
  flex: 1,
  overflow: 'auto'
});

export const formRow = merge(
  style({
    display: 'flex',
    padding: `${spacing.HALF} 0`,
    borderBottom: `1px solid ${colors.BLACK_10}`
  }),
  $(' .label-wrapper', {
    flex: 1,
    minWidth: '100px',
    maxWidth: '150px',
    borderRight: `1px solid ${colors.BLACK_10}`,
    marginRight: spacing.HALF,
    paddingRight: spacing.ONE,
    textAlign: 'right',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '.75em',
    height: spacing.FORM_INPUT_HEIGHT,
    lineHeight: spacing.FORM_INPUT_HEIGHT
  }),
  $(' .label-wrapper input', {
    width: '100%',
    border: 'none',
    textAlign: 'right'
  }),
  $(' .input-wrapper', {
    flex: 1,
    minHeight: spacing.FORM_INPUT_HEIGHT,
    lineHeight: spacing.FORM_INPUT_HEIGHT,
    marginRight: spacing.HALF
  })
);

export const formInput = style({
  width: '100%',
  height: spacing.FORM_INPUT_HEIGHT,
  paddingLeft: spacing.HALF,
  border: `2px solid transparent`,
  borderRadius: '4px',
  ':focus': {
    borderColor: colors.BRAND_PRIMARY
  }
});

export const metaWrapper = style({
  marginBottom: spacing.ONE
});

export const heading = style({
  color: colors.BLACK_35,
  textTransform: 'uppercase',
  borderBottom: `1px solid ${colors.BLACK_5}`,
  margin: '3em 0 0'
});
