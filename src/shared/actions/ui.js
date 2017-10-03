import { createLocalAction } from '../utils/redux';

import { TREE_ADD_EXPANDED_KEY, TREE_SET_EXPANDED_KEYS } from './types';

export const setExpandedKeys = createLocalAction(TREE_SET_EXPANDED_KEYS);
export const addExpandedKeys = createLocalAction(TREE_ADD_EXPANDED_KEY);
