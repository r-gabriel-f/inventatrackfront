<template>
  <div class="card flex justify-center">
    <Button
      type="button"
      icon="pi pi-ellipsis-v"
      label="Generar Reporte"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />

    <Dialog
      v-model:visible="visible"
      header="Seleccionar Mes"
    >
      <div class="card flex justify-center m-2">
        <Calendar v-model="dateFecha" view="month" dateFormat="mm/yy" class="w-full" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="cancelar"
        ></Button>
        <Button 
          type="button" 
          label="Generar Reporte" 
          @click="generarReporte"
          :disabled="!dateFecha"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const menu = ref();
const visible = ref(false);
const dateFecha = ref(null);
const formattedDate = ref(null);
const reporteTipo = ref(null);

const items = ref([
  {
    label: "Opciones",
    items: [
      {
        label: "Reporte del dia",
        icon: "pi pi-calendar",
        command: () => {
          reporteDia();
        },
      },
      {
        label: "Reporte Del Mes",
        icon: "pi pi-calendar",
        command: () => {
          reporteTipo.value = 'mensual';
          visible.value = true;
        },
      },
      {
        label: "Reporte Total Mes",
        icon: "pi pi-calendar",
        command: () => {
          reporteTipo.value = 'mensualTotal';
          visible.value = true;
        },
      }
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const cancelar = () => {
  visible.value = false;
  dateFecha.value = null;
  formattedDate.value = null;
};

const reporteDia = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reporte-dia`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Reporte generado correctamente del dia",
      life: 3000,
    })
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No hay salidas registradas hoy",
      life: 3000,
    });
  }
};

const generarReporte = async () => {
  try {
    if (!formattedDate.value) {
      toast.add({
        severity: "warn",
        summary: "Advertencia",
        detail: "Por favor seleccione un mes",
        life: 3000,
      });
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/api/reportes/${reporteTipo.value === 'mensual' ? 'mensual' : 'mensual-total'}/${formattedDate.value}`;

    const response = await axios.get(url, {
      responseType: "blob",
    });

    const a = document.createElement("a");
    const fileName = `reporte_${reporteTipo.value === 'mensual' ? 'mensual' : 'mensual-total'}_${formattedDate.value}.pdf`;
    a.href = window.URL.createObjectURL(new Blob([response.data]));
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    cancelar();
    
    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: `Reporte ${reporteTipo.value === 'mensual' ? 'mensual' : 'mensual-total'} generado correctamente`,
      life: 3000,
    });
  } catch (error) {
    let mensaje = `Error al generar el reporte ${reporteTipo.value === 'mensual' ? 'mensual' : 'mensual-total'}`;
    if (error.response && error.response.status === 404) {
      mensaje = `No hay salidas registradas para el mes seleccionado`;
    }

    toast.add({
      severity: "error",
      summary: "Error",
      detail: mensaje,
      life: 3000,
    });
  }
};

watch(dateFecha, (newDate) => {
  if (newDate) {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    formattedDate.value = `${year}-${month}`;
  } else {
    formattedDate.value = null;
  }
});
</script>
