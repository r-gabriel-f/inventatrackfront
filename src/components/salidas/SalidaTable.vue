<template>
  <div class="card">
    <div>
      <Button label="Crear Reporte" @click="reporteDia" />
    </div>
    <DataTable :value="salidas">
      <Column field="material" header="Material"></Column>
      <Column field="producto" header="Producto"></Column>
      <Column field="unidad" header="Unidad"></Column>
      <Column field="cantidad" header="Cantidad"></Column>
      <Column field="nivel" header="Nivel"></Column>
      <Column field="responsable_nombre" header="Responsable"></Column>
      <Column field="rumpero" header="Rumpero"></Column>
      <Column field="trabajador" header="Trabajador">
        <template #body="data">
          {{ data.data.trabajador ?? "-" }}
        </template>
      </Column>
      <Column field="fecha_salida" header="Fecha">
        <template #body="data">
          {{ applyFormat(data.fecha_salida) }}
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="data">
          <div>
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success mr-2"
              @click="edit(data.id)"
            ></Button>
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="deleteData(data.id)"
            ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { applyFormat } from "../../helpers/utils";
import salidaService from "../../services/client/salida.service";
import reportsService from "../../services/client/reports.service";

const salidas = ref([]);

const { data, isFetching, refetch } = salidaService.useListQuery();

const { data: dataReport, refetch: fetchReport } = reportsService.useListQuery(
  null,
  { enabled: false }
);

const reporteDia = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/reporte-dia", {
      responseType: "blob", // Esto es importante para recibir el archivo PDF como blob
    });

    // Crear un enlace para descargar el PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${new Date().toISOString().split("T")[0]}.pdf`; // Nombre del archivo con la fecha actual
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error al generar el reporte:", error);
  }
};

onMounted(() => {
  if (data.value) {
    salidas.value = data.value;
  }
});
watch(isFetching, () => {
  if (data.value) {
    salidas.value = data.value;
    console.log(salidas.value);
  }
});
</script>
