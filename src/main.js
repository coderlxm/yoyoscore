import './assets/main.css'
import 'normalize.css';
import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('longpress', {
  mounted(el, binding) {
    let pressTimer = null;
    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return; // 不是左键点击时不做处理
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler(); // 执行传入的方法
        }, 2000); // 设置定时器，2秒后触发长按事件
      }
    };

    const cancel = (e) => {
      // 取消计时器
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const handler = (e) => {
      binding.value(e); // 执行绑定的值，即我们传递的方法
    };

    // 添加事件监听器
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start);
    el.addEventListener('click', cancel);
    el.addEventListener('mouseout', cancel);
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);
  },

  unmounted(el) {
    // 移除事件监听器
    el.removeEventListener('mousedown', start);
    el.removeEventListener('touchstart', start);
    el.removeEventListener('click', cancel);
    el.removeEventListener('mouseout', cancel);
    el.removeEventListener('touchend', cancel);
    el.removeEventListener('touchcancel', cancel);
  }
});
app.mount('#app')
