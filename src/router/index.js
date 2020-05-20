import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store/index.js'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
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
    path: '/camera',
    name: 'Camera',
    meta: {
      requiresAuth: true
    },
    component: () => import('../views/CameraView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log("requires auth")
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
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
