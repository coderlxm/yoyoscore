import './assets/main.css'
import 'normalize.css';
import 'virtual:uno.css'
import 'vant/lib/index.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import methodForPress from '@/utils/methodForPress'
const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)

app.directive('longpress', methodForPress);

app.mount('#app')
