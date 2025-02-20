<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <Toast />
    <h1 class="text-2xl font-bold mb-6">Iniciar Sesión</h1>
    <div class="card flex justify-center">
      <div v-focustrap class="w-full sm:w-80 flex flex-col gap-6">
        <InputText
          id="user"
          v-model="user"
          type="user"
          placeholder="Usuario"
          autofocus
          fluid
        />

        <InputText
          id="password"
          v-model="password"
          type="text"
          placeholder="Contraseña"
          fluid
        />

        <Button label="Iniciar" class="mt-2" @click="loginObtener" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const router = useRouter();

const user = ref("");
const password = ref("");

const loginObtener = async () => {
  try {
    if (user.value === "a" && password.value === "a") {
      localStorage.setItem("token", "usuario_autenticado");

      toast.add({
        severity: "success",
        summary: "Inicio de sesión exitoso",
        detail: "Bienvenido",
        life: 3000,
      });

      setTimeout(() => {
        router.push({ name: "Home" });
      }, 2000);
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Credenciales incorrectas",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Hubo un problema al iniciar sesión",
      life: 3000,
    });
  }
};
</script>
