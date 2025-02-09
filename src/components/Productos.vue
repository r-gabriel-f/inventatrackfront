<template>
  <div class="card flex justify-center">
    <Button label="Agregar Producto a Material" @click="visible = true" />
    <Dialog
      v-model:visible="visible"
      modal
      header="Edit Profile"
      :style="{ width: '25rem' }"
    >
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap"
            >Crear Producto de Material</span
          >
        </div>
      </template>
     
        <div class="flex items-center gap-4 mb-4">
          <label for="material" class="font-semibold w-24">Material</label>
          <Select
            v-model="selectedMaterial"
            :options="materials"
            filter
            optionLabel="nombre"
            placeholder="Seleccionar Material"
            class="w-full"
          />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24">Nombre</label>
          <InputText id="nombre" class="flex-auto w-full" v-model="name" />
        </div>
     
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="visible = false"
          autofocus
        />
        <Button label="Crear Producto" autofocus />
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import materialsService from "../services/client/materials.service";

const name = ref("");
const visible = ref(false);
const materials = ref([]);
const selectedMaterial = ref(null);

const { data, isFetching } = materialsService.useListQuery();

onMounted(() => {
  if (data.value) {
    materials.value = data.value;
  }
});
watch(isFetching, () => {
  if (data.value) {
    materials.value = data.value;
  }
});
</script>
