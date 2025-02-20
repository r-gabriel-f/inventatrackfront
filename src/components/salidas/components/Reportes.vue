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

    <Dialog v-model:visible="visible" header="Seleccionar Mes">
      <div class="flex justify-center items-center gap-4 mb-4">
        <label for="material">Reporte mes general</label>
        <InputSwitch v-model="checked" />
        <label for="material">Reporte por nivel</label>
      </div>
      <div class="card flex justify-center m-2">
        <Calendar
          v-model="dateFecha"
          view="month"
          dateFormat="mm/yy"
          class="w-full"
        />
      </div>
      <div v-if="checked" class="flex items-center gap-4 mb-4">
        <label for="material" class="font-semibold w-24">Nivel</label>
        <Select
          v-model="selectedNivel"
          :options="niveles"
          filter
          optionLabel="name"
          optionValue="name"
          placeholder="Seleccionar Nivel"
          class="w-full"
        />
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
          @click="generalReporte"
          :disabled="!dateFecha || (checked && !selectedNivel)"
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
const selectedNivel = ref(null);
const checked = ref(false);
const niveles = ref([
  { id: 1, name: "HARRISON" },
  { id: 2, name: "PATIÑO" },
  { id: 3, name: "-160" },
  { id: 4, name: "-200" },
  { id: 5, name: "-240" },
  { id: 6, name: "-280" },
  { id: 7, name: "-320" },
  { id: 8, name: "-360" },
  { id: 9, name: "-400" },
  { id: 10, name: "-440" },
  { id: 11, name: "PROF RAMPA" },
  { id: 12, name: "VIGILANCIA" },
  { id: 13, name: "RELAVES" },
  { id: 14, name: "PLANTA PILOTO" },
]);
const items = ref([
  {
    label: "Opciones",
    items: [
      {
        label: "Reporte del Dia",
        icon: "pi pi-calendar",
        command: () => {
          reporteDia();
        },
      },
      {
        label: "Reporte Del Mes",
        icon: "pi pi-calendar",
        command: () => {
          reporteTipo.value = "mensual";
          visible.value = true;
        },
      },
      {
        label: "Reporte Total Mes",
        icon: "pi pi-calendar",
        command: () => {
          reporteTipo.value = "mensualTotal";
          visible.value = true;
        },
      },
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
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/reporte-dia`,
      {
        responseType: "blob",
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    const fechaBolivia = new Date()
      .toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");

    a.download = `reporte_${fechaBolivia}.pdf`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Reporte generado correctamente del dia",
      life: 3000,
    });
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

    const url = `${import.meta.env.VITE_API_URL}/api/reportes/${
      reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
    }/${formattedDate.value}`;

    const response = await axios.get(url, {
      responseType: "blob",
    });

    const a = document.createElement("a");
    const fileName = `reporte_${
      reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
    }_${formattedDate.value}.pdf`;
    a.href = window.URL.createObjectURL(new Blob([response.data]));
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    cancelar();

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: `Reporte ${
        reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
      } generado correctamente`,
      life: 3000,
    });
  } catch (error) {
    let mensaje = `Error al generar el reporte ${
      reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
    }`;
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


const generarReporteNivel = async () => {
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

    const url = `${import.meta.env.VITE_API_URL}/api/reportes/${
      reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
    }/${formattedDate.value}/${selectedNivel.value}`;

    const response = await axios.get(url, {
      responseType: "blob",
    });

    const a = document.createElement("a");
    const fileName = `reporte_${
      reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
    }_${formattedDate.value}_${selectedNivel.value}.pdf`;
    a.href = window.URL.createObjectURL(new Blob([response.data]));
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    cancelar();

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: `Reporte ${
        reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
      } del nivel ${selectedNivel.value} generado correctamente`,
      life: 3000,
    });
  } catch (error) {
    let mensaje = `Error al generar el reporte ${
      reporteTipo.value === "mensual" ? "mensual" : "mensual-total"
    } del nivel ${selectedNivel.value}`;
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

const generalReporte = () => {
  if (checked.value) {
    generarReporteNivel();
  } else {
    generarReporte();
  }
  selectedNivel.value = null;
  checked.value = false;
  dateFecha.value = null;
}

watch(dateFecha, (newDate) => {
  if (newDate) {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    formattedDate.value = `${year}-${month}`;
  } else {
    formattedDate.value = null;
  }
});
</script>
