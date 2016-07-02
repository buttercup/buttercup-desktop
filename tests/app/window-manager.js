const WindowManager = require('../setup').WindowManager;

module.exports = {

  setUp(cb) {
    this.windowManager = new WindowManager();
    cb();
  },

  register: {

    testRegistersWindows(test) {
      const win = { test: true };
      this.windowManager.register('test', win);
      const retrieved = this.windowManager.getWindowsOfType('test');
      test.strictEqual(retrieved.length, 1, 'Array should contain exactly 1 window');
      test.strictEqual(retrieved[0].test, true, 'Test window should be returned');
      test.done();
    }

  }

};
