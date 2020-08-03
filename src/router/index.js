import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store/index.js'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Landing',
    meta: {
      title: 'Forside'
    },
    component: () => import('../views/Landing.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Logg inn'
    },
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    meta: {
      title: 'Registrer'
    },
    component: () => import('../views/SignUp.vue'),
  },
  {
    path: '/verify/:validation_hash',
    name: 'Verify',
    meta: {
      title: 'Verifiserer e-post'
    },
    component: () => import('../views/Verify.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    meta: {
      requiresAuth: true,
      title: 'Søk'
    },
    component: () => import('../views/Search.vue'),
  },
  {
    path: '/share',
    name: 'Share',
    meta: {
      requiresAuth: true,
      title: 'Del'
    },
    component: () => import('../views/Share.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {
      requiresAuth: true,
      title: 'Profil'
    },
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      requiresAuth: true,
      title: 'Oversikt'
    },
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/trust',
    name: 'Trust',
    meta: {
      requiresAuth: true,
      title: 'Tillit'
    },
    component: () => import('../views/Trust.vue'),
  },

  {
    path: '/phone',
    name: 'PhoneVerification',
    component: () => import('../components/PhoneVerification.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title + ' | Del-D';
  }
});

export default router;
