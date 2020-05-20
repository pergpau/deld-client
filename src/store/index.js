import Vue from 'vue';
import Vuex from 'vuex';
import api from '../services/api.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {},
    user_items: [],
    loans: [],
    categories: null,
    date_options: {
      year: 'numeric', month: 'numeric', day: 'numeric'
    },
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.user = payload.user
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
      state.user_items = []
      state.loans = []
    },
    set_items (state, payload) {
      state.user_items = payload
    },
    set_loans (state, payload) {
      state.loans = payload
    },
    set_categories (state, payload) {
      state.categories = payload
    },
    update_all_items (state, payload) {
      state.user_items = payload
    },
    push_new_item (state, payload) {
      state.user_items.unshift(payload)
    },
    update_item (state, payload) {
      state.user_items.splice(payload.index, 1, payload.item)
    },
    delete_item (state, payload) {
      state.user_items.splice(state.user_items.findIndex(item => {
        return item.item_id === payload;
      }), 1);
    }
  },
  actions: {
    login ({ commit, dispatch }, login_data) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        api.post('/login', login_data)
          .then(res => {
            const token = res.data.token
            const user = res.data.user
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            commit('auth_success', { token: token, user: user })
            dispatch('set_categories')
            resolve(res)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            reject(err)
          })
      })
    },
    logout ({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete api.defaults.headers.common['Authorization']
        resolve()
      })
    },
    async get_user_items ({ commit, getters }) {
      const user_id = getters.user_id
      try {
        const result = await api.get('/user/id/' + user_id + '/items')
        commit('set_items', result.data)
      } catch (error) {
        console.log(error)
      }
    },
    async push_new_item ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        console.log(payload)
        api.post('/items/new', payload)
          .then(res => {
            commit('push_new_item', res.data)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async update_item ({ commit, getters }, payload) {
      return new Promise((resolve, reject) => {
        const item_id = payload.old.item_id
        api.post('/items/update/' + item_id, payload.new)
          .then(res => {
            const index = getters.user_items.indexOf(payload.old)
            commit('update_item', { index: index, item: payload.new })
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async delete_item ({ commit }, payload) {
      const item_id = payload.item_id
      try {
        await api.post('/items/delete/' + item_id, payload)
        commit('delete_item', item_id)
      } catch (error) {
        console.log(error)
      }
    },
    async get_user_loans ({ commit, getters }) {
      const user_id = getters.user_id
      try {
        const loans = await api.get('/items/on_loan_by/user/' + user_id)
        commit('set_loans', loans.data)
      } catch (error) {
        console.log(error)
      }
    },
    async set_categories ({ commit }) {
      try {
        const categories = await api.get('/categories')
        commit('set_categories', categories.data)
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    user_id: state => state.user.user_id,
    authStatus: state => state.status,
    token: state => state.token,
    user_items: state => state.user_items,
    user_things: state => {
      if (state.user_items.length) return state.user_items.filter(item => item.item_type == 'thing')
    },
    user_books: state => {
      if (state.user_items.length) return state.user_items.filter(item => item.item_type == 'book')
    },
    loans: state => state.loans,
    loans_by_id: state => {
      return state.loans.map(item => item.item_id)
    },
    category_name: state => id => state.categories[id],
    category_map: state => state.categories,
    category_list: state => {
      const category_list = []
      Object.entries(state.categories).forEach(([key, value]) => {
        category_list.push({ "id": parseInt(key), "text": value })
      })
      return category_list
    },
    date_options: state => state.date_options
  }
});
