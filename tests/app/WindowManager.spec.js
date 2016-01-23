var WindowManager = require(__dirname + "/../setup.js").WindowManager;

module.exports = {

	setUp: function(cb) {
        this.windowManager = new WindowManager();
		cb();
	},

    register: {

        testRegistersWindows: function(test) {
            var win = { test: true };
            this.windowManager.register("test", win);
            var retrieved = this.windowManager.getWindowsOfType("test");
            test.strictEqual(retrieved.length, 1, "Array should contain exactly 1 window");
            test.strictEqual(retrieved[0].test, true, "Test window should be returned");
            test.done();
        }

    }

};
