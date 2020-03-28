import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入全局样式
import "./css/globe.css";
// 导入axios
import axios from "axios";
//设置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// Vue.prototype实现全局变量，通过在原型上定义它们使其在每个 Vue 的实例中可用
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
