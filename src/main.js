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

    // 定义处理开始触摸/点击的函数
    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return; // 如果不是鼠标左键点击，则不处理
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          // 长按事件的处理函数
          handler();
        }, 2000); // 长按时间阈值设置为2000毫秒
      }
    };

    // 定义取消触摸/点击的函数
    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    // 绑定的函数，长按触发时执行
    const handler = (e) => {
      binding.value(e);
    };

    // 添加事件监听
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start);
    el.addEventListener('click', cancel);
    el.addEventListener('mouseout', cancel);
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);

    // 在el对象上存储函数引用，以便后续移除
    el._longPressHandlers = { start, cancel };
  },

  unmounted(el) {
    // 移除事件监听器
    if (el._longPressHandlers) {
      el.removeEventListener('mousedown', el._longPressHandlers.start);
      el.removeEventListener('touchstart', el._longPressHandlers.start);
      el.removeEventListener('click', el._longPressHandlers.cancel);
      el.removeEventListener('mouseout', el._longPressHandlers.cancel);
      el.removeEventListener('touchend', el._longPressHandlers.cancel);
      el.removeEventListener('touchcancel', el._longPressHandlers.cancel);
    }
  }
});
app.mount('#app')
