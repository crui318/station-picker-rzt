import Vue from 'vue'
import App from './App.vue'

// UI组件库
import Vant from 'vant';

// 引用UI组件样式
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app')
