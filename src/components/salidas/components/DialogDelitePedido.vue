<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="visibleEliminarProducto"
      modal
      header="Eliminar Material"
    >
      <div class="card my-2">
        <span
          >Estas seguro de eliminar el Pedido con el codigo
          {{ selectMaterial.codigo }}</span
        >
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visibleEliminarProducto = false"
        ></Button>
        <Button
          type="button"
          label="Eliminar"
          severity="danger"
          @click="updateMaterial()"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useToast } from "primevue";
import salidaService from "../../../services/client/salida.service";
const toast = useToast();

const visibleEliminarProducto = defineModel("visibleEliminarProducto");
const selectMaterial = ref();
const idMaterial = ref(0);
const salidas = ref();

const props = defineProps({
  dataPedido: {
    type: Object,
    default: null,
  },
});
const options = {
  enabled: false,
};
const {
  data: dataget,
  isFetching,
  refetch,
} = salidaService.useGetQuery(idMaterial, {}, options);
const { mutateAsync } = salidaService.useUpdateMutation(idMaterial);
const emit = defineEmits(["updateMaterials"]);

async function updateMaterial() {
  idMaterial.value = selectMaterial.value.id;
  console.log(salidas.value.data);
  const materialId = salidas.value.data.material_id;
  const productoId = salidas.value.data.producto_id;
  const nivel = salidas.value.data.nivel;
  const responsableNombre = salidas.value.data.responsable_nombre;
  const cantidad = salidas.value.data.cantidad;
  const rumpero = salidas.value.data.rumpero;
  const trabajador = salidas.value.data.trabajador;
  const payload = {
    material_id: materialId ?? null,
    producto_id: productoId ?? null,
    nivel: nivel ?? null,
    responsable_nombre: responsableNombre ?? null,
    cantidad: cantidad ?? null,
    rumpero: rumpero ?? null,
    trabajador: trabajador ?? null,
    status: 0,
  };

  try {
    await mutateAsync(payload);
    toast.add({
      severity: "success",
      summary: "Salida Eliminada",
      detail: "Salida Eliminada exitosamente",
      life: 3000,
    });
    visibleEliminarProducto.value = false;
    emit("updateMaterials");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error al eliminar la salida",
      life: 3000,
    });
  }
}
watch(dataget, () => {
  if (dataget.value) {
    salidas.value = dataget.value;
  }
});

watch(isFetching, () => {
  if (dataget.value) {
    salidas.value = dataget.value;
  }
});

watch(props, () => {
  if (props.dataPedido) {
    selectMaterial.value = props.dataPedido;
    idMaterial.value = props.dataPedido.id;
    options.enabled = true;
    refetch();
  }
});
</script>
