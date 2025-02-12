<template>
  <div class="card flex justify-center">
    <Toast />
    <Button label="Agregar Producto a Material" @click="visible = true" />
    <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }">
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
          optionValue="id"
          placeholder="Seleccionar Material"
          class="w-full"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-24">Nombre</label>
        <InputText id="nombre" class="flex-auto w-full" v-model="name" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="unidad" class="font-semibold w-24">Unidad</label>
        <InputText id="unidad" class="flex-auto w-full" v-model="unidad" />
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="visible = false"
          autofocus
        />

        <Button label="Crear Producto" autofocus @click="createProduct" :disabled="!name.trim() || !selectedMaterial || !unidad.trim()"/>
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import materialsService from "../../../services/client/materials.service";
import productsService from "../../../services/client/products.service";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const name = ref("");
const visible = ref(false);
const materials = ref([]);
const selectedMaterial = ref(null);
const unidad = ref(null);

const { data, refetch } = materialsService.useListQuery({}, { enabled: false });

const { mutateAsync } = productsService.useCreateMutation();

async function createProduct() {
  const payload = {
    nombre: name.value,
    material_id: selectedMaterial.value,
    unidad: unidad.value,
  };
  try {
    await mutateAsync(payload);
    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Producto creado",
      life: 3000,
    })
    visible.value = false;
    name.value = "";
    unidad.value = null;
    selectedMaterial.value = null;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Producto no creado",
      life: 3000,
    })
  }
}

watch(visible, (newVal) => {
  if (newVal) {
    refetch();
  }
});

watch(data, () => {
  if (data.value) {
    materials.value = data.value;
  }
});
</script>
