import {createApp} from 'vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import './style.css'
import App from './App.vue'
import 'primeicons/primeicons.css'


import Button from 'primevue/button';

const app = createApp(App)
app.use(PrimeVue)
app.component('Button',Button)

app.mount('#app').$nextTick(() => {
    // Remove Preload scripts loading
    postMessage({payload: 'removeLoading'}, '*')

    // Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
    })
})
