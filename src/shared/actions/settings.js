import { createAction } from 'redux-actions';
import {
  WINDOW_SIZE_SET,
  COLUMN_SIZE_SET,
} from './types';

export const setColumnSize = createAction(COLUMN_SIZE_SET);
export const setWindowSize = createAction(WINDOW_SIZE_SET);
