<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="visibleEditor" modal header="Editar Material">
      <form @submit.prevent="updateMaterial(selectMaterial)">
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
            @click="visibleEditor = false"
            autofocus
          />
          <Button
            label="Actualizar Material"
            autofocus
            type="submit"
            :disabled="!name.trim()"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import materialsService from "../../../services/client/materials.service";
import { useToast } from "primevue";
const toast = useToast();

const visibleEditor = defineModel("visibleEditor");
const selectMaterial = ref();
const idMaterial = ref(0);
const name = ref("");
const props = defineProps({
  dataMaterials: {
    type: Object,
    default: null,
  },
});

const { mutateAsync } = materialsService.useUpdateMutation(idMaterial);
const emit = defineEmits(["updateMaterials"]);
async function updateMaterial() {
  idMaterial.value = selectMaterial.value.id;
  const payload = {
    ...selectMaterial.value,
    nombre: name.value,
  };
  try {
    await mutateAsync(payload);
    toast.add({
      severity: "success",
      summary: "Material Editado",
      detail: "Material Editado exitosamente",
      life: 3000,
    });
    visibleEditor.value = false;
    emit("updateMaterials");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error al editar material",
      life: 3000,
    });
  }
}

watch(props, () => {
  if (props.dataMaterials) {
    selectMaterial.value = props.dataMaterials;
    name.value = selectMaterial.value.nombre;
  }
});
</script>
