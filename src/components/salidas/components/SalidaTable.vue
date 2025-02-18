<template>
  <div class="card m-5">
    <Toast />
    <div class="flex justify-between">
      <div class="flex gap-2">
        <div>
          <Materials @updateMaterials="refetch" />
        </div>
        <div>
          <Products />
        </div>
        <div>
          <Salida
            @change="refetch"
            :dataEdit="dataEdit"
            @clearEdit="dataEdit = null"
          />
        </div>
      </div>
      <div>
        <Reportes />
      </div>
    </div>
    <div class="card flex justify-center m-5 space-x-3">
      <span>Ver del Dia</span>
      <InputSwitch v-model="checked" />
      <span>Ver Todos</span>
    </div>
    <div class="h-[850px]">
      <div class="card flex justify-end items-center gap-2 my-2">
        <p>Buscar por Mes</p>
        <Calendar
          v-model="dateFecha"
          view="month"
          dateFormat="mm/yy"
          :disabled="!checked"
        />
      </div>
      <DataTable
        :value="filteredSalidas"
        stripedRows
        scrollable
        scrollHeight="750px"
      >
        <template #empty> No hay Salidas de Material </template>
        <Column field="codigo" header="Codigo"></Column>
        <Column field="nivel" header="Nivel"></Column>
        <Column field="material" header="Material"></Column>
        <Column field="producto" header="Producto"></Column>
        <Column field="unidad" header="Unidad"></Column>
        <Column field="cantidad" header="Cantidad"></Column>
        <Column field="responsable_nombre" header="Responsable"></Column>
        <Column field="rumpero" header="Rumpero"></Column>
        <Column field="trabajador" header="Trabajador">
          <template #body="data">
            {{
              data.data.trabajador && data.data.trabajador.trim() !== ""
                ? data.data.trabajador
                : "-"
            }}
          </template>
        </Column>
        <Column field="fecha_salida" header="Fecha">
          <template #body="data">
            {{
              data.data.fecha_salida ? applyFormat(data.data.fecha_salida) : "-"
            }}
          </template>
        </Column>
        <Column header="Acciones">
          <template #body="data">
            <div>
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(data.data)"
              ></Button>
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger"
                @click="deleteData(data.data)"
              ></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <div class="flex justify-end mt-5">
      <Button label="Salir" severity="danger" @click="logout" />
    </div>
  </div>
  <DialogDelitePedido v-model:visibleEliminarProducto="visibleEliminarProducto" :dataPedido="dataPedido" @updateMaterials="refetch" />
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { applyFormat } from "../../../helpers/utils";
import salidaService from "../../../services/client/salida.service";
import DialogDelitePedido from "./DialogDelitePedido.vue";
import Reportes from "./Reportes.vue";
import Materials from "./Materials.vue";
import Products from "./Productos.vue";
import Salida from "./Salida.vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const salidas = ref([]);
const checked = ref(false);
const dateFecha = ref(null);
const formattedDate = ref(null);
const visibleEliminarProducto = ref(false);

const parans = ref({
  todas: false,
});

const { data, isFetching, refetch } = salidaService.useListQuery(parans);

// New computed property to filter salidas based on selected date
const filteredSalidas = computed(() => {
  let filtered = [...salidas.value];

  if (formattedDate.value) {
    filtered = filtered.filter((salida) => {
      const salidaDate = salida.fecha_salida.substring(0, 7); // Get YYYY-MM from date
      return salidaDate === formattedDate.value;
    });
  }

  return filtered.sort((a, b) => {
    if (a.material !== b.material) {
      return a.material.localeCompare(b.material);
    }
    if (a.nivel !== b.nivel) {
      return a.nivel.localeCompare(b.nivel);
    }
    return new Date(b.fecha_salida) - new Date(a.fecha_salida);
  });
});

const dataPedido = ref();
async function deleteData(data) {
  dataPedido.value = data;
  console.log(dataPedido.value);
  visibleEliminarProducto.value = true;
}

const dataEdit = ref();
const edit = (data) => {
  console.log(data);
  dataEdit.value = data;
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

onMounted(() => {
  if (data.value) {
    salidas.value = data.value;
  }
});

watch(isFetching, () => {
  if (data.value) {
    salidas.value = data.value;
  }
});

watch(checked, () => {
  parans.value.todas = checked.value;
  if (!checked.value) {
    dateFecha.value = null;
  }
  refetch();
});

watch(dateFecha, (newDate) => {
  if (newDate) {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    formattedDate.value = `${year}-${month}`;
  } else {
    formattedDate.value = null;
  }
});
</script>
