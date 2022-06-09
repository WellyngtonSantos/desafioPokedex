import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import MDialogPlugin from 'vue-m-dialog';
import "vue-m-dialog/dist/style.css";

let app = createApp(App);

app.use(MDialogPlugin);

app.mount("#app");