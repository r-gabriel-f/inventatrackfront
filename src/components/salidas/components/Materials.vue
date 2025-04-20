<template>
  <div class="card flex justify-center">
    <Toast />
    <Button label="Agregar Material" @click="openDialog" />
    <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }">
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Crear Nuevo Material</span>
        </div>
      </template>
      <form @submit.prevent="createMaterial">
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24">Nombre</label>
          <InputText
            id="nombre"
            class="flex-auto"
            v-model="name"
            placeholder="Nombre del Material"
          />
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <Button
            label="Cancel"
            severity="secondary"
            @click="clearForm"
            autofocus
          />
          <Button
            label="Crear Material"
            autofocus
            type="submit"
            :disabled="!name.trim()"
          />
          <Button
            label="Ver Materiales"
            @click="openMaterialDialog"
            severity="info"
          />
        </div>
      </form>
    </Dialog>
  </div>
  <DialogMaterial
    v-model:visibleVerDialog="visibleVerDialog"
    :dataMaterials="dataMaterials"
    @updateMaterials="openMaterialDialog"
  />
</template>
<script setup>
import { ref, watch } from "vue";
import materialsService from "../../../services/client/materials.service";
import DialogMaterial from "./DialogMaterial.vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const name = ref("");
const visible = ref(false);
const visibleVerDialog = ref(false);
const dataMaterials = ref([]);
const { mutateAsync } = materialsService.useCreateMutation();
const options = {
  enabled: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};
const { data, refetch } = materialsService.useListQuery({}, options);

const openDialog = async () => {
  options.enabled = true;
  await refetch();
  visible.value = true;
};
const emit = defineEmits(["updateMaterials"]);

const openMaterialDialog = async () => {
  options.enabled = true;
  await refetch();
  visibleVerDialog.value = true;
  emit("updateMaterials");
};

const cancel = () => {
  name.value = "";
};

const clearForm = () => {
  visible.value = false;
  name.value = "";
};

async function createMaterial() {
  const payload = {
    nombre: name.value,
  };
  try {
    const existMaterial = dataMaterials.value.find(
      (material) => material.nombre.toLowerCase() === name.value.toLowerCase()
    );
    if (existMaterial) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Material ya existe",
        life: 3000,
      });
      return;
    } else {
      await mutateAsync(payload);
      toast.add({
        severity: "success",
        summary: "Material creado",
        detail: "Material creado exitosamente",
        life: 3000,
      });
      cancel();
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Material no creado",
      life: 3000,
    });
  }
}

watch(data, () => {
  if (data.value) {
    dataMaterials.value = data.value;
  }
});
</script>
