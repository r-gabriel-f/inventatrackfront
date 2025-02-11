
<template>
    <div class="card flex justify-center">
        <Button type="button" icon="pi pi-ellipsis-v" label="Generar Reporte" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const menu = ref();
const items = ref([
    {
        label: 'Opciones',
        items: [
            {
                label: 'Reporte del dia',
                icon: 'pi pi-calendar',
                command: () => {
                    reporteDia();
                }
            },
            {
                label: 'Reporte Del Mes',
                icon: 'pi pi-calendar',
            }
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

const reporteDia = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/reporte-dia", {
      responseType: "blob",
    });

    // Crear un enlace para descargar el PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No hay salidas registradas hoy ",
      life: 3000,
    });
  }
};
</script>
