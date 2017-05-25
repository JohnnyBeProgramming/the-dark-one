'use strict';

// Constants
const api = require('./api');
const express = require('express');

const InstanceService = require('./services/InstanceService');

const options = {
  base: __dirname,
  port: process.env.API_PORT || 2020,
};

// Define and start the server
module.exports = api
  .init(express(), options)
  .load(function () {
    // Bootstrap the stored instances and tools
    InstanceService.init(api, 'config/');
  })
  .serve([
    // Load main server last, so the tools gets preference
    {
      target: '/',
      source: 'app'
    }
  ])
  .start(function () {
    console.log('');
    console.log('Server running on: http://127.0.0.1:' + api.options.port);
    console.log('');
  });
