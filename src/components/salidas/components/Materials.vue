<template>
  <div class="card flex justify-center">
    <Toast />
    <Button label="Agregar Material" @click="visible = true" />
    <Dialog
      v-model:visible="visible"
      modal
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

        <Button label="Crear Material" autofocus @click="createMaterial" :disabled="!name.trim()"/>
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";
import materialsService from "../../../services/client/materials.service";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const name = ref("");
const visible = ref(false);

const { mutateAsync } = materialsService.useCreateMutation();


async function createMaterial() {
  const payload = {
    nombre : name.value,
  };
  try {
    await mutateAsync(payload);
    toast.add({
      severity: "success",
      summary: "Material creado",
      detail: "Material creado exitosamente",
      life: 3000,
    })
    name.value = "";
    visible.value = false;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Material no creado",
      life: 3000,
    })
  }
}
</script>
