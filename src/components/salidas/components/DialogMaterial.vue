<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="visibleVerDialog"
      modal
      header="Lista de Materiales"
    >
      <div class="card">
        <DataTable :value="dataMaterials" scrollable scrollHeight="400px">
          <template #empty> No hay Materiales </template>
          <Column field="nombre" header="Nombre"></Column>
          <Column header="Actions">
            <template #body="data">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-info mr-2"
                  @click="editMaterial(data.data)"
                ></Button>
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="updateMaterial(data.data)"
                ></Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="flex justify-end gap-2 mt-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visibleVerDialog = false"
        ></Button>
      </div>
    </Dialog>
  </div>
  <DialogDeliteMaterial
    v-model:visibleEliminar="visibleEliminar"
    :dataMaterials="selectMaterial"
    @updateMaterials="updateChange"
  />
  <DialogEditMaterial
    v-model:visibleEditor="visibleEditor"
    :dataMaterials="selectMaterial"
    @updateMaterials="updateChange"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import DialogDeliteMaterial from "./DialogDeliteMaterial.vue";
import DialogEditMaterial from "./DialogEditMaterial.vue";

const visibleVerDialog = defineModel("visibleVerDialog");

const visibleEliminar = ref(false);
const dataMaterials = ref([]);
const selectMaterial = ref();
const visibleEditor = ref(false);
const props = defineProps({
  dataMaterials: {
    type: Array,
    default: [],
  },
});
async function updateMaterial(data) {
  selectMaterial.value = data;
  visibleEliminar.value = true;
}

async function editMaterial(data) {
  selectMaterial.value = data;
  visibleEditor.value = true;
}

const emit = defineEmits(["updateMaterials"]);

const updateChange = () => {
  emit("updateMaterials");
};

watch(props, () => {
  if (props.dataMaterials) {
    dataMaterials.value = props.dataMaterials;
  }
});
</script>
