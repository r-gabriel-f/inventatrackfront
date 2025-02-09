<template>
  <div class="card flex justify-center">
    <Button label="Agregar Material" @click="visible = true" />
    <Dialog
      v-model:visible="visible"
      modal
      header="Edit Profile"
      :style="{ width: '25rem' }"
    >
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Crear nuevo Material</span>
        </div>
      </template>
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-24">Nombre</label>
        <InputText id="nombre" class="flex-auto" v-model="name" />
      </div>
      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="visible = false"
          autofocus
        />
        <Button label="Crear Material" autofocus @click="createMaterial" />
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";
import materialsService from "../services/client/materials.service";

const name = ref("");
const visible = ref(false);

const { mutateAsync } = materialsService.useCreateMutation();

async function createMaterial() {
  const payload = {
    nombre : name.value,
  };
  try {
    await mutateAsync(payload);
  } catch (error) {
    console.log(error);
  }
  visible.value = false;
}
</script>
