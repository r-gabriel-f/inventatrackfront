<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="visibleVerDialog"
      modal
      header="Lista de Materiales"
    >
      <div class="card">
        <DataTable :value="dataMaterials" scrollable scrollHeight="400px">
          <Column field="nombre" header="Nombre"></Column>
          <Column header="Actions">
            <template #body="data">
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="updateMaterial(data.data)"
              ></Button>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visibleVerDialog = false"
        ></Button>
      </div>
    </Dialog>
  </div>
  <DialogDeliteMaterial v-model:visibleEliminar="visibleEliminar" :dataMaterials="selectMaterial" @updateMaterials="$emit('updateMaterials')" />
</template>

<script setup>
import { ref, watch } from "vue";
import DialogDeliteMaterial from "./DialogDeliteMaterial.vue";

const visibleVerDialog = defineModel("visibleVerDialog");

const visibleEliminar = ref(false);
const dataMaterials = ref([]);
const selectMaterial = ref();

const props = defineProps({
  dataMaterials: {
    type: Array,
    default: [],
  },
});
async function updateMaterial(data) {
  selectMaterial.value = data;
  visibleEliminar.value = true;
  console.log(selectMaterial.value);
}

watch(props, () => {
  if (props.dataMaterials) {
    dataMaterials.value = props.dataMaterials;
  }
});
</script>
