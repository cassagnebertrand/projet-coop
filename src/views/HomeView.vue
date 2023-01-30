<script setup>
import TheWelcome from '../components/TheWelcome.vue';

import {useUserStore} from "../stores/user";
const user = useUserStore();

import {useSessionStore} from "../stores/session";
import {onMounted} from "vue";
const session = useSessionStore()




onMounted( () => {
  if (session.isValid()){
    console.log("C'est partie")
  }

})


</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
