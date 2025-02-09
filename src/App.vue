<script setup>
import Materials from './components/Materials.vue';
import Productos from './components/Productos.vue';
import Salida from './components/Salida.vue';
import SalidaTable from './components/salidas/SalidaTable.vue';
</script>

<template>
  <div class="space-y-4">

    <Materials />
    <Productos />
    <Salida />
    <SalidaTable />
  </div>
</template>
