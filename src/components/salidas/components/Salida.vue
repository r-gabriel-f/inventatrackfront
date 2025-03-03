<template>
  <div class="card flex justify-center">
    <Toast />
    <Button label="Registrar Pedido" @click="handleButtonClick" />
    <Dialog v-model:visible="visible" modal @hide="handleClose">
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">{{
            isEditMode
              ? "Editar salida de material"
              : "Crear salida de material"
          }}</span>
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
            placeholder="Seleccionar Nivel"
            class="w-full"
          />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24">Cantidad</label>
          <InputText id="nombre" class="flex-auto w-full" v-model="cantidad" type="number" :min="0" placeholder="Cantidad de Pedido"/>
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24"
            >Nombre Responsable</label
          >
          <InputText
            id="nombre"
            class="flex-auto w-full"
            v-model="nameResponsable"
            placeholder="Nombre del Responsable"
          />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="nombre" class="font-semibold w-24">Rumpero</label>
          <InputText
            id="nombre"
            class="flex-auto w-full"
            v-model="nameRumpero"
            placeholder="Nombre del Rumpero"
          />
        </div>
        <div
          class="flex items-center gap-4 mb-4"
        >
          <label for="nombre" class="font-semibold w-24">Trabajador</label>
          <InputText
            id="nombre"
            class="flex-auto w-full"
            v-model="nameTrabajador"
            placeholder="Nombre del Trabajador"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          severity="secondary"
          @click="handleClose"
          autofocus
        />
        <Button
          :label="isEditMode ? 'Editar Salida' : 'Crear Salida'"
          autofocus
          @click="handleSubmit"
          :disabled="!selectedMaterial || !selectedProducto || !selectedNivel || !cantidad || !nameResponsable || !nameRumpero || ( nameSelectedMaterial === 'EQUIPOS')"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import materialsService from "../../../services/client/materials.service";
import productsService from "../../../services/client/products.service";
import salidaService from "../../../services/client/salida.service";
import { useToast } from "primevue/usetoast";
import { min } from "moment";

const toast = useToast();
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
const isEditMode = ref(false);

const props = defineProps({
  dataEdit: {
    type: Object,
    default: null,
  },
});

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
  { id: 15, name: "ABC" },
  { id: 16, name: "HSI" },
  { id: 17, name: "ADMINISTRACION" },
]);

const emit = defineEmits(["change", "clearEdit"]);

const paramts = {
  enabled: false,
};
const paramtsMaterial = {
  enabled: false,
};

const {
  data,
  isFetching,
  refetch: refetchMaterials,
} = materialsService.useListQuery({}, paramts);

const {
  data: dataProduct,
  isFetching: isFetchingProduct,
  refetch,
} = productsService.useListQuery({}, paramtsMaterial);
const idData = ref(0);
const { mutateAsync: createMutation } = salidaService.useCreateMutation();
const { mutateAsync: updateMutation } = salidaService.useUpdateMutation(idData);

const clearForm = () => {
  selectedMaterial.value = null;
  selectedProducto.value = null;
  selectedNivel.value = null;
  nameResponsable.value = "";
  cantidad.value = 0;
  nameRumpero.value = "";
  nameTrabajador.value = "";
  nameSelectedMaterial.value = "";
  isEditMode.value = false;
};

const handleClose = () => {
  visible.value = false;
  clearForm();
  emit("clearEdit");
};

const filteredProductos = computed(() => {
  if (!selectedMaterial.value) return productos.value;
  return productos.value.filter(
    (producto) => producto.material_id === selectedMaterial.value
  );
});

async function handleSubmit() {
  const payload = {
    material_id: selectedMaterial.value ?? null,
    producto_id: selectedProducto.value ?? null,
    nivel: selectedNivel.value ?? null,
    responsable_nombre: nameResponsable.value ?? null,
    cantidad: cantidad.value ?? null,
    rumpero: nameRumpero.value ?? null,
    trabajador: nameTrabajador.value ?? null,
    status: 1,
  };

  try {
    if (isEditMode.value) {
      await updateMutation(payload);
      toast.add({
        severity: "success",
        summary: "Salida actualizada",
        detail: "Salida actualizada exitosamente",
        life: 3000,
      });
    } else {
      await createMutation(payload);
      toast.add({
        severity: "success",
        summary: "Salida creada",
        detail: "Salida creada exitosamente",
        life: 3000,
      });
    }
    handleClose();
    emit("change");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: isEditMode.value
        ? "Error al actualizar la salida"
        : "Error al crear la salida",
      life: 3000,
    });
  }
}

const openDialog = async (isEdit = false) => {
  clearForm();
  isEditMode.value = isEdit;
  paramts.enabled = true;
  paramtsMaterial.enabled = true;
  await Promise.all([refetch(), refetchMaterials()]);
  visible.value = true;
};
const handleButtonClick = () => {
  openDialog(false);
};

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

watch(isFetchingProduct, () => {
  if (dataProduct.value) {
    productos.value = dataProduct.value;
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

watch(
  () => props.dataEdit,
  async (newVal) => {
    if (newVal) {
      console.log(newVal);
      await openDialog(true);
      idData.value = newVal.id;

      if (
        materials.value &&
        materials.value.length > 0 &&
        productos.value &&
        productos.value.length > 0
      ) {
        const selectedMaterialObject = materials.value.find(
          (material) => material.nombre === newVal.material
        );

        if (selectedMaterialObject) {
          selectedMaterial.value = selectedMaterialObject.id;
        }
        const selectedProductoObject = productos.value.find(
          (producto) => producto.nombre === newVal.producto
        );
        if (selectedProductoObject) {
          selectedProducto.value = selectedProductoObject.id;
        }
        selectedNivel.value = newVal.nivel;
        nameResponsable.value = newVal.responsable_nombre;
        cantidad.value = newVal.cantidad;
        nameRumpero.value = newVal.rumpero;
        nameTrabajador.value = newVal.trabajador;
      }
    }
  }
);
</script>
