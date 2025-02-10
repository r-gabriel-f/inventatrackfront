import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { VueQueryPlugin } from "@tanstack/vue-query";
import router from "./router";
import "primeicons/primeicons.css";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toast from 'primevue/toast';
import IconField from 'primevue/iconfield';
import ToastService from 'primevue/toastservice';
const app = createApp(App);

app.use(VueQueryPlugin);
app.use(router);
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});

app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("InputText", InputText);
app.component("Select", Select);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component('Toast', Toast);
app.component('IconField', IconField);
app.mount("#app");
