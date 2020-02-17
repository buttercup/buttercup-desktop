import test from 'ava';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import {
  COLUMN_SIZE_SET,
  SETTING_SET
} from '../../../../src/shared/actions/types';
import {
  setSetting,
  setColumnSize
} from '../../../../src/shared/actions/settings';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('SETTING_SET', t => {
  const key = 'isTrayIconEnabled';
  const value = 'isTrayIconEnabled';

  const expectedAction = {
    type: SETTING_SET,
    payload: {
      key,
      value
    }
  };

  t.deepEqual(setSetting(key, value), expectedAction);
});

test('SETTING_SET store actions', async t => {
  const store = mockStore({});

  const key = 'isTrayIconEnabled';
  const value = 'isTrayIconEnabled';

  await store.dispatch(setSetting(key, value));

  const expectedActions = [
    {
      type: SETTING_SET,
      payload: {
        key,
        value
      }
    }
  ];

  t.deepEqual(store.getActions(), expectedActions);
});

test('COLUMN_SIZE_SET', async t => {
  const payload = { name: 'tree', size: 230 };

  const expectedAction = {
    type: COLUMN_SIZE_SET,
    payload
  };

  t.deepEqual(setColumnSize(payload), expectedAction);
});

test('COLUMN_SIZE_SET store actions', async t => {
  const store = mockStore({});

  const payloadEntries = {
    name: 'entries',
    size: 300
  };
  const payloadTree = {
    name: 'tree',
    size: 200
  };

  await store.dispatch(
    setColumnSize({
      ...payloadEntries
    })
  );

  await store.dispatch(
    setColumnSize({
      ...payloadTree
    })
  );

  const expectedActions = [
    {
      type: COLUMN_SIZE_SET,
      payload: { ...payloadEntries }
    },
    {
      type: COLUMN_SIZE_SET,
      payload: { ...payloadTree }
    }
  ];

  t.deepEqual(store.getActions(), expectedActions);
});
