<template>
  <div class="card">
    <DataTable :value="salidas">
      <Column field="material" header="Material"></Column>
      <Column field="producto" header="Producto"></Column>
      <Column field="nivel" header="Nivel"></Column>
      <Column field="responsable_nombre" header="Responsable"></Column>
      <Column field="fecha_salida" header="Fecha">
        <template #body="data">
          {{ applyFormat(data.fecha_salida) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { applyFormat } from "../../helpers/utils";
import salidaService from "../../services/client/salida.service";

const salidas = ref([]);

const { data, isFetching, refetch } = salidaService.useListQuery();

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
