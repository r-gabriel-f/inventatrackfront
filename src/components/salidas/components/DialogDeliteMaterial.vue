<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="visibleEliminar" modal header="Eliminar Material">
      <div class="card my-2">
        <span
          >Estas seguro de eliminar el Material
          {{ selectMaterial.nombre }}</span
        >
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visibleEliminar = false"
        ></Button>
        <Button
          type="button"
          label="Eliminar"
          severity="danger"
          @click="updateMaterial(selectMaterial)"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import materialsService from "../../../services/client/materials.service";
import { useToast } from "primevue";
const toast = useToast();

const visibleEliminar = defineModel("visibleEliminar");
const selectMaterial = ref();
const idMaterial = ref(0);

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
  const statusData = selectMaterial.value.status === 1 ? 0 : 1;
  const payload = {
    ...selectMaterial.value,
    status: statusData,
  };
  try {
    await mutateAsync(payload);
    toast.add({
      severity: "success",
      summary: "Material Eliminado",
      detail: "Material Eliminado exitosamente",
      life: 3000,
    });
    visibleEliminar.value = false;
    emit("updateMaterials");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error al eliminar material",
      life: 3000,
    });
  }
}

watch(props, () => {
  if (props.dataMaterials) {
    selectMaterial.value = props.dataMaterials;
  }
});
</script>
