<template>
  <div class="card flex justify-center">
    <Toast />
    <Button label="Agregar Producto a Material" @click="openDialog" />
    <Dialog v-model:visible="visible" modal :style="{ width: '25rem' }">
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Crear Producto de Material</span>
        </div>
      </template>

      <div class="flex items-center gap-4 mb-4">
        <label for="material" class="font-semibold w-24">Material</label>
        <Select v-model="selectedMaterial" :options="materials" filter optionLabel="nombre" optionValue="id"
          placeholder="Seleccionar Material" class="w-full" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="nombre" class="font-semibold w-24">Nombre</label>
        <InputText id="nombre" class="flex-auto w-full" v-model="name" placeholder="Nombre del Producto"/>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="unidad" class="font-semibold w-24">Unidad</label>
        <InputText id="unidad" class="flex-auto w-full" v-model="unidad"  placeholder="Unidad del Producto"/>
      </div>

      <template #footer>
        <Button label="Cancel" severity="secondary" @click="cancel" autofocus />

        <Button label="Crear Producto" autofocus @click="createProduct"
          :disabled="!name.trim() || !selectedMaterial || !(unidad ?? '').trim()" />

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
const dataProductos = ref([]);
const selectedMaterial = ref(null);
const unidad = ref(null);

const optionsM = {
  enabled: false,
};
const optionsP = {
  enabled: false,
};

const { data, refetch } = materialsService.useListQuery({}, optionsM);

const { data: dataProduct, refetch: refetchProduct } =
  productsService.useListQuery({}, optionsP);

const { mutateAsync } = productsService.useCreateMutation();

async function createProduct() {
  const payload = {
    nombre: name.value,
    material_id: selectedMaterial.value,
    unidad: unidad.value,
  };
  try {
    const existe = dataProductos.value.find(
      (producto) =>
        producto.material_id === selectedMaterial.value &&
        producto.nombre.toLowerCase() === name.value.toLowerCase() &&
        producto.unidad.toLowerCase() === unidad.value.toLowerCase()
    );
    if (existe) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Producto ya existe",
        life: 3000,
      });
    } else {
      await mutateAsync(payload);
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Producto creado",
        life: 3000,
      });
      cancel();
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Producto no creado",
      life: 3000,
    });
  }
}
const openDialog = async () => {
  optionsM.enabled = true;
  optionsP.enabled = true;
  await refetch();
  await refetchProduct();
  visible.value = true;
};
const cancel = () => {
  visible.value = false;
  name.value = "";
  unidad.value = null;
  selectedMaterial.value = null;
};

watch(data, () => {
  if (data.value) {
    materials.value = data.value;
  }
});

watch(dataProduct, () => {
  if (dataProduct.value) {
    dataProductos.value = dataProduct.value;
    console.log(dataProductos.value);
  }
});
</script>
