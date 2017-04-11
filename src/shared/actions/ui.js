import { createLocalAction } from '../utils/redux';

import {
  TREE_ADD_EXPANDED_KEY,
  TREE_SET_EXPANDED_KEYS,
  COLUMN_SIZE_SET,
  WINDOW_SIZE_SET,
} from './types';

export const setExpandedKeys = createLocalAction(TREE_SET_EXPANDED_KEYS);
export const addExpandedKeys = createLocalAction(TREE_ADD_EXPANDED_KEY);
export const setColumnSize = createLocalAction(COLUMN_SIZE_SET);
export const setWindowSize = createLocalAction(WINDOW_SIZE_SET);
