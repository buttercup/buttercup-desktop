
/**
 * Singleton shared instance
 * @private
 * @type {WindowManager|undefined}
 */
let __sharedInstance;

/**
 * The window manager
 * @class WindowManager
 */
const WindowManager = function() {
  this._windows = [];
  this._buildProcedures = {};
  this._lastDeregisteredType = '';
};

/**
 * Build a window of a certain type
 * @param {string} type The window type
 * @see setBuildProcedure
 * @returns {BrowserWindow}
 */
WindowManager.prototype.buildWindowOfType = function(type) {
  const window = (this._buildProcedures[type])();
  this.register(type, window);
  return window;
};

/**
 * Deregister a window
 * @param {BrowserWindow} window The window to deregister
 */
WindowManager.prototype.deregister = function(window) {
  for (let i = 0, windowsLen = this._windows.length; i < windowsLen; i += 1) {
    if (this._windows[i].window === window) {
      this._lastDeregisteredType = this._windows[i].type;
      this._windows.splice(i, 1);
      return;
    }
  }
};

/**
 * Get the number of windows registered with a certain type
 * @param {string} type The type of window
 * @returns {number}
 */
WindowManager.prototype.getCountOfType = function(type) {
  return this._windows.reduce((count, currentObj) => {
    return (currentObj.type === type) ? count + 1 : count;
  }, 0);
};

/**
 * Get the type of the last deregistered window
 * @returns {string}
 */
WindowManager.prototype.getLastDeregisteredType = function() {
  return this._lastDeregisteredType;
};

/**
 * Get all windows of a certain type
 * @param {string} type The type of window to get
 * @returns {Array.<BrowserWindow>}
 */
WindowManager.prototype.getWindowsOfType = function(type) {
  return this._windows.reduce((windows, currentObj) => {
    if (currentObj.type === type) {
      windows.push(currentObj.window);
    }
    return windows;
  }, []);
};

/**
 * Register a window
 * @param {string} type The window type
 * @param {BrowserWindow} window The window instance
 */
WindowManager.prototype.register = function(type, window) {
  this._windows.push({
    type,
    window
  });
};

/**
 * Set the build procedure for a window type
 * @param {string} type The window type
 * @param {Function} builder The build function which returns a window
 */
WindowManager.prototype.setBuildProcedure = function(type, builder) {
  this._buildProcedures[type] = builder;
};

/**
 * Get the shared instance
 * @returns {WindowManager}
 */
WindowManager.getSharedInstance = function() {
  __sharedInstance = __sharedInstance || new WindowManager();
  return __sharedInstance;
};

module.exports = WindowManager;
