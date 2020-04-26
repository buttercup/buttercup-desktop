import { Application } from 'spectron';
import path from 'path';

const electronPath = require('electron');

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '../../app')],
});

describe('Application launch', () => {
  beforeEach(() => {
    return app.start();
  }, 10000);

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
    return false;
  });

  it('shows an initial window', () => {
    return app.client.getWindowCount().then((count) => expect(count).toBe(1));
  });
});
