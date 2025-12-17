import Vue from 'vue'
import App from './App.vue'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import axios from 'axios'
// import {createRouter, createWebHashHistory} from 'vue-router'
import VueRouter from 'vue-router'
import {loadProgressBar} from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'
import VueMeta from 'vue-meta'


import HelloWorld from './components/HelloWorld'
import Paper from './components/Paper'
import CommonReference from "./components/CommonReference";
import Settings from "./components/Settings";
import VueGoodTablePlugin from 'vue-good-table';

// import the styles
import 'vue-good-table/dist/vue-good-table.css'

Vue.use(VueMeta)

Vue.use(Autocomplete)
Vue.use(VueRouter)

const DEV = process.env.NODE_ENV !== 'production'

const instance = axios.create({
  baseURL: DEV ? 'http://localhost:8000' : 'https://api.cite.gg',
  timeout: 100000,
});

// Load API key from localStorage if available (BYOK)
const savedApiKey = window.localStorage.getItem('apiKey');
if (savedApiKey) {
  instance.defaults.headers.common['x-api-key'] = savedApiKey;
}

Vue.prototype.$axios = instance
loadProgressBar({}, instance)

const routes = [
  {path: '/', component: HelloWorld},
  {path: '/paper', component: Paper},
  {path: '/common-reference', component: CommonReference},
  {path: '/settings', component: Settings},
]

const router = new VueRouter({
  routes, // short for `routes: routes`
})


Vue.config.productionTip = false


Vue.use(VueGoodTablePlugin);

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
