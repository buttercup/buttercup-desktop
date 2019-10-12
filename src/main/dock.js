import { app } from 'electron';
import { getSetting } from '../shared/selectors';

export const setupDockIcon = store => {
  const state = store.getState();
  const isDockIconEnabled = getSetting(state, 'isDockIconEnabled');

  isDockIconEnabled ? app.dock.show() : app.dock.hide();
};
