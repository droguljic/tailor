import Vue from 'vue';
import Router from 'vue-router';

import Auth from './containers/Auth';
import Courses from './containers/Courses';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';

Vue.use(Router);

// TODO: Implement auth based route checking
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'courses',
      component: Courses
    },
    {
      path: '/',
      name: 'auth',
      component: Auth,
      children: [
        {
          path: 'login',
          name: 'login',
          component: Login
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: ResetPassword
        }
      ]
    }
  ]
});