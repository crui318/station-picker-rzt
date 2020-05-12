import Vue from 'vue'
import App from './App.vue'

// UI组件库
import Vant from 'vant';

// 引用UI组件样式
import 'vant/lib/index.css';

// rem转换
import './libs/rem';
// 自定义的样式
import './assets/less/index.less';

Vue.use(Vant);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app')
