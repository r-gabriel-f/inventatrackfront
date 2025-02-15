<template>
  <div class="card m-5">
    <Toast />
    <div class="flex justify-between">
      <div class="flex gap-2">
        <Materials />
        <Products />
        <Salida
          @change="refetch"
          :dataEdit="dataEdit"
          @clearEdit="dataEdit = null"
        />
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
    <div class="h-[700px]">
      <div class="card flex justify-end my-2">
        <Calendar v-model="dateFecha" view="month" dateFormat="mm/yy" />
      </div>
      <DataTable
        :value="filteredSalidas"
        stripedRows
        scrollable
        scrollHeight="650px"
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
                @click="deleteData(data.data.id)"
              ></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <div class="flex justify-end mt-5">
      <Button label="Salir" @click="logout" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { applyFormat } from "../../../helpers/utils";
import salidaService from "../../../services/client/salida.service";
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

const parans = ref({
  todas: false,
});

const { data, isFetching, refetch } = salidaService.useListQuery(parans);

// New computed property to filter salidas based on selected date
const filteredSalidas = computed(() => {
  let filtered = [...salidas.value];
  
  if (formattedDate.value) {
    filtered = filtered.filter(salida => {
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

const { mutateAsync: deleteDataMutation } = salidaService.useRemoveMutation();

async function deleteData(id) {
  try {
    await deleteDataMutation(id);
    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Salida eliminada",
      life: 3000,
    });
    refetch();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Salida no eliminada",
      life: 3000,
    });
  }
}

const dataEdit = ref();
const edit = (data) => {
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
  refetch();
});

watch(dateFecha, (newDate) => {
  if (newDate) {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    formattedDate.value = `${year}-${month}`;
  } else {
    formattedDate.value = null;
  }
});
</script>