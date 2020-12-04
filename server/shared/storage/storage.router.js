'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express').Router();
const upload = multer({ storage: multer.memoryStorage() });

router
  .get('/set-cookies', ctrl.setSignedCookies)
  .post('/', upload.single('file'), ctrl.upload);

module.exports = {
  path: '/assets',
  router
};
