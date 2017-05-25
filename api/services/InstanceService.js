'use strict';

const fs = require('fs');
const path = require('path');

const self = {
  basePath: __dirname, // Default base
  configPath: 'config/',
  cached: [],
  routes: [
    {
      path: '/api/instances',
      resp: function (req, res) {
        res.send(self.cached);
      }
    },
    {
      path: '/api/instance/:id',
      resp: function (req, res) {
        const instance = self.getInstance(req.params.id);
        if (instance) {
          res.send(instance);
        } else {
          res.status(404).send({error: 'not found'})
        }
      }
    },
    {
      verb: 'POST',
      path: '/api/instance/:id',
      resp: function (req, res) {
        self.upsertInstance(req.params.id, req.body)
          .then(function (response) {
            res.send(response);
          })
          .catch(function (error) {
            res.status(500).send({error: error.message})
          });
      }
    },
    {
      path: '/api/instance/:id/status',
      resp: function (req, res) {
        const payload = self.getInstance(req.params.id);
        self.getStatus(payload, req.body)
          .then(function (states) {
            res.send(states);
          });
      }
    },
    {
      verb: 'POST',
      path: '/api/instance/:id/status',
      resp: function (req, res) {
        self.getStatus(req.body)
          .then(function (states) {
            res.send(states);
          });
      }
    },
  ],

  init: function (api, configPath) {
    const searchPath = path.join(api.options.base, configPath);
    console.log('Searching for instances...');
    self.basePath = api.options.base;
    self.configPath = configPath;
    self.cached = self.search(searchPath)
      .map(function (instance) {
        console.log(' + [ ' + instance.code + ' ] \t' + instance.name);
        return instance;
      });
    api.route(self.routes);
  },

  search: function (configPath) {
    // Scan folders and build a list of tools
    const instanceGroups = fs.readdirSync(configPath)
      .filter(function (file) {
        // Only files that have a package JSON
        return !fs.statSync(path.join(configPath, file)).isDirectory() && /.*\.json$/i.test(file);
      })
      .map(function (file) {
        try {
          const info = require(path.join(configPath, file));
          return Array.isArray(info) ? info : [info];
        } catch (ex) {
          console.warn(ex);
          return [];
        }
      });

    var result = [];
    instanceGroups.forEach(function (group) {
      if (group) {
        result = result.concat(group);
      }
    });
    return result;
  },

  getInstance: function (ident) {
    const instances = self.cached;
    return instances ? instances.find(function (item) {
        return item.code === ident;
      }) : null;
  },

  upsertInstance: function (ident, payload) {
    return new Promise(function (resolve, reject) {
      const instance = self.getInstance(ident);
      if (!payload) throw new Error('No payload specified');
      if (!payload.code) throw new Error('Message body must contain the code field');
      if (!payload.name) throw new Error('Message body must contain a name field');
      if (instance) {
        // Update existing item
        self.updateInstance(instance, payload)
          .then(resolve)
          .catch(reject);
      } else {
        // Add new item
        self.insertInstance(payload)
          .then(resolve)
          .catch(reject);
      }
    });
  },

  insertInstance: function (payload) {
    return new Promise(function (resolve, reject) {
      const filePath = path.join(self.basePath, self.configPath, payload.code + '.json');
      console.log('~~> Insert Instance: ', filePath);
      fs.writeFile(filePath, JSON.stringify(payload, null, '  '), function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
    })
      .then(function (payload) {
        // Add new item to the local cache
        self.cached = self.cached.concat(payload);
        return payload;
      });
  },

  updateInstance: function (instance, payload) {
    return new Promise(function (resolve, reject) {
      const filePath = path.join(self.basePath, self.configPath, payload.code + '.json');
      console.log('~~> Update instance: ', filePath);
      fs.writeFile(filePath, JSON.stringify(payload, null, '  '), function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
      resolve(payload);
    })
      .then(function (payload) {
        // Update the locally cached item
        Object.keys(payload).forEach(function (key) {
          instance[key] = payload[key];
        });
      });
  },

  getStatus: function (payload) {
    const states = {};
    const checks = [];

    // Check for HTTP endpoints
    ['web', 'api'].forEach(function (key) {
      if (payload && payload[key]) {
        checks.push(self.check(payload[key], function (online) {
          states[key] = online;
        }));
      }
    });

    // Check for mongo endpoints
    if (payload && payload.mongo) {
      checks.push(self.checkMongo(payload.mongo, function (online) {
        states.mongo = online;
      }))
    }

    // Return a promise of all the states
    return Promise.all(checks).then(function () {
      return states;
    });
  },

  ping: function (url) {
    if (!url) return Promise.reject(new Error('Url not set...'));
    return new Promise(function (resolve, reject) {
      var request = require('request');
      var options = {
        method: 'HEAD',
      };

      request.get(url, options, function (err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  },

  check: function (url, callback) {
    return !url ? Promise.reject(new Error('No URI specified.')) : self.ping(url)
        .then(function () {
          callback(true);
        })
        .catch(function (err) {
          console.log('~~> Check Failed', err);
          callback(false);
        });
  },

  checkMongo: function (info, callback) {
    var url = self.mongoUrl(info);
    var MongoClient = require('mongodb').MongoClient;
    return !url
      ? Promise.reject(new Error('Mongo URI not specified.'))
      : new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        })
      })
        .then(function () {
          callback(true);
        })
        .catch(function () {
          callback(false);
        });
  },

  mongoUrl: function (info) {
    if (info.uri) return info.uri;

    var url = 'mongodb://';
    if (info.user) {
      url += info.user;
      if (info.password) {
        url += ':' + info.password;
      }
      url += '@';
    }
    url += info.host + '/' + info.db;
    return url;
  },

};

module.exports = self;