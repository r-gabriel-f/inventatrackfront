<template>
  <div class="card flex justify-center">
    <Button label="Crear salida de material" @click="visible = true" />
    <Dialog v-model:visible="visible" modal>
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap"
            >Crear salida de material</span
          >
        </div>
      </template>
      <div class="grid grid-cols-2 gap-2">
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
          <label for="nombre" class="font-semibold w-24"
            >Material Producto</label
          >
          <Select
            v-model="selectedProducto"
            :options="filteredProductos"
            filter
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccionar Producto"
            class="w-full"
          >
            <template #option="slotProps">
              {{ slotProps.option.nombre }} ({{ slotProps.option.unidad }})
            </template>
          </Select>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="material" class="font-semibold w-24">Nivel</label>
          <Select
            v-model="selectedNivel"
            :options="niveles"
            filter
            optionLabel="name"
            optionValue="name"
            placeholder="Seleccionar Material"
            class="w-full"
          />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24">Cantidad</label>
          <InputText id="nombre" class="flex-auto w-full" v-model="cantidad" />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24"
            >Nombre Responsable</label
          >
          <InputText
            id="nombre"
            class="flex-auto w-full"
            v-model="nameResponsable"
          />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24">Rumpero</label>
          <InputText
            id="nombre"
            class="flex-auto w-full"
            v-model="nameRumpero"
          />
        </div>
        <div v-if="nameSelectedMaterial === 'EQUIPOS'" class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24">Trabajador</label>
          <InputText
            id="nombre"
            class="flex-auto w-full"
            v-model="nameTrabajador"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="visible = false"
          autofocus
        />
        <Button label="Crear Salida" autofocus @click="createSalida" />
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import materialsService from "../services/client/materials.service";
import productsService from "../services/client/products.service";
import salidaService from "../services/client/salida.service";

const visible = ref(false);
const materials = ref([]);
const productos = ref([]);
const selectedProducto = ref(null);
const selectedMaterial = ref(null);
const nameSelectedMaterial = ref("");
const selectedNivel = ref(null);
const nameResponsable = ref("");
const cantidad = ref(0);
const nameRumpero = ref("");
const nameTrabajador = ref("");
const niveles = ref([
  { id: 1, name: "HARRISON" },
  { id: 2, name: "PATIÑO" },
  { id: 3, name: "-160" },
  { id: 4, name: "-200" },
  { id: 5, name: "-240" },
  { id: 6, name: "-280" },
  { id: 7, name: "-320" },
  { id: 8, name: "-360" },
  { id: 9, name: "-400" },
  { id: 10, name: "-440" },
  { id: 11, name: "PROF RAMPA" },
  { id: 12, name: "VIGILANCIA" },
  { id: 13, name: "RELAVES" },
  { id: 14, name: "PLANTA PILOTO" },
]);

const { data, isFetching } = materialsService.useListQuery();

const { data: dataProduct, isFetching: isFetchingProduct } =
  productsService.useListQuery();

const filteredProductos = computed(() => {
  if (!selectedMaterial.value) return productos.value;
  return productos.value.filter(
    (producto) => producto.material_id === selectedMaterial.value
  );
});

const { mutateAsync } = salidaService.useCreateMutation();

async function createSalida() {
  const payload = {
    material_id: selectedMaterial.value,
    producto_id: selectedProducto.value,
    nivel: selectedNivel.value,
    responsable_nombre: nameResponsable.value,
    cantidad: cantidad.value,
    rumpero: nameRumpero.value,
    trabajador: nameTrabajador.value,
  };
  try {
    await mutateAsync(payload);
  } catch (error) {
    console.log(error);
  }
  visible.value = false;
}

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
onMounted(() => {
  if (dataProduct.value) {
    productos.value = dataProduct.value;
  }
});
watch(isFetchingProduct, () => {
  if (dataProduct.value) {
    productos.value = dataProduct.value;
    console.log(productos.value);
  }
});
watch(selectedMaterial, (newValue) => {
  if (newValue) {
    const selectedMaterialObject = materials.value.find(
      (material) => material.id === newValue
    );
    if (selectedMaterialObject) {
      nameSelectedMaterial.value = selectedMaterialObject.nombre;
    }
  }
});

</script>
