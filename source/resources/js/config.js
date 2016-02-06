System.config({
  baseURL: "./js/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "afeld/backbone-nested": "github:afeld/backbone-nested@2.0.4",
    "babel": "npm:babel-core@5.8.25",
    "babel-runtime": "npm:babel-runtime@5.8.25",
    "backbone": "npm:backbone@1.2.3",
    "backbone-nested": "github:afeld/backbone-nested@2.0.4",
    "backbone.babysitter": "github:marionettejs/backbone.babysitter@0.1.10",
    "backbone.wreqr": "github:marionettejs/backbone.wreqr@1.3.5",
    "backone": "npm:backbone@1.2.3",
    "core-js": "npm:core-js@1.2.1",
    "fuzzysearch": "npm:fuzzysearch@1.0.3",
    "jquery": "github:components/jquery@2.1.4",
    "marionette": "github:marionettejs/backbone.marionette@2.4.3",
    "sweetalert": "npm:sweetalert@1.1.3",
    "text": "github:systemjs/plugin-text@0.0.2",
    "underscore": "npm:underscore@1.8.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.25": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:backbone@1.2.3": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:core-js@1.2.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:sweetalert@1.1.3": {
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
