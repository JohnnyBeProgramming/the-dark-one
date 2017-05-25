'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const self = {
  options: {
    base: __dirname,
    port: 9090,
    host: {
      bodyParser: {
        // Parse application/json
        json: true,
        // Parse application/x-www-form-urlencoded
        urlencoded: {extended: false}
      },
    }
  },
  routes: [],
  serves: [],
  runners: [],
  hasStarted: false,

  init: function (app, options) {
    if (self.app) throw new Error('The property `app` is already set.');
    self.app = app;
    self.config(options || {});
    return self;
  },
  config: function (options) {
    Object.keys(options).forEach(function (key) {
      var primaries = ['routes', 'serves'];
      if (primaries.indexOf(key) >= 0) {
        self[key] = options[key];
      } else {
        self.options[key] = options[key];
      }
    });
    return self;
  },
  load: function (callback) {
    if (callback) {
      callback(self.app);
    }
    return self;
  },
  route: function (routes) {
    routes = !Array.isArray(routes) ? [routes] : routes;
    self.routes = self.routes.concat(routes);
    return self;
  },
  serve: function (hostings) {

    hostings = !Array.isArray(hostings) ? [hostings] : hostings;
    self.serves = self.serves.concat(hostings);
    return self;
  },
  start: function (callback) {
    if (self.hasStarted) throw new Error('Server already started.');

    const app = self.app;
    const port = self.options.port || 9090;
    const basePath = self.options.base || __dirname;
    return self.configServer(app) // Configure the server
      .initServer(app, basePath) // Serve static files
      .initRoutes(app, self.routes) // Bootstrap the api routes
      .run(function (app) {
        app.listen(port); // Start the server
      })
      .run(callback);
  },
  run: function (callback) {
    if (self.hasStarted) {
      // Run all the de-bounced actions...
      self.runners.concat(callback)
        .forEach(function (runner) {
          if (runner) {
            runner(self.app);
          }
        });
      self.runners = [];
    } else {
      self.runners.push(callback);
    }
    return self;
  },

  configServer: function (app) {
    var hostConfig = self.options ? self.options.host : null;
    if (!hostConfig) return self;

    console.log('Configuring server...');

    // Set body parsers (if config exists)
    if (hostConfig.bodyParser) {
      if (hostConfig.bodyParser.urlencoded) {
        console.log(' - urlencoded:', hostConfig.bodyParser.urlencoded);
        app.use(bodyParser.urlencoded(hostConfig.bodyParser.urlencoded));
      }
      if (hostConfig.bodyParser.json) {
        console.log(' - json:', true);
        app.use(bodyParser.json());
      }
    }

    return self;
  },
  initServer: function (app, basePath) {
    // Serve static HTTP content
    console.log('Initialising servers...');
    self.serves && self.serves.forEach(function (hosting) {
      if (!hosting.target) throw new Error('Static target not defined.', hosting);
      if (!hosting.source) throw new Error('Static source not defined.', hosting);
      const hostedPath = path.join(basePath, hosting.source);
      console.log(' + ~' + hosting.target, JSON.stringify(hosting.options || {}, null, '  '));
      app.use(hosting.target, express.static(hostedPath, hosting.options));
    });
    self.hasStarted = true;
    return self;
  },
  initRoutes: function (app, routes) {
    console.log('Initialising routes...');
    routes && routes.forEach(function (route) {
      var verb = route.verb || 'GET';
      console.log(' + [ ' + verb + ' ] \t' + route.path);
      self.initRoute(app, route)
    });
    return self;
  },
  initRoute: function (app, route) {
    switch (route.verb || 'GET') {
      case 'HEAD':
        app.head(route.path, route.resp);
        break;
      case 'GET':
        app.get(route.path, route.resp);
        break;
      case 'PUT':
        app.put(route.path, route.resp);
        break;
      case 'POST':
        app.post(route.path, route.resp);
        break;
      case 'DELETE':
        app.delete(route.path, route.resp);
        break;
      case 'CONNECT':
        app.connect(route.path, route.resp);
        break;
    }
  }

};

module.exports = self;