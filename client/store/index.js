import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import auth from './modules/auth';
import editor from './modules/editor';
import settings from '../settings';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];
const modules = { auth, editor };

export default new Vuex.Store({
  middlewares,
  modules,
  strict: isDevEnv
});
