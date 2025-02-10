<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div>
    <div>
      <router-view />
    </div>
  </div>
</template>
