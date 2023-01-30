<script setup>
import {useUserStore} from "../stores/user";
const user = useUserStore();

import {useSessionStore} from "../stores/session";
import {onMounted} from "vue";
const session = useSessionStore()
onMounted(() => {
  api.get('ping').then(response => {
    console.log("L'api fonctionne !")
  })
  if (session.isValid()){
    console.log("C'est partie")
  }
})
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>

    <p>
      <template v-if="user.isConnected">
        Un utilisateur est connecté
        <div>
          <button @click="user.disconnect">Se déconnecter</button>
        </div>
      </template>
      <template v-else>
        Aucun utilisateur n'est connecté
        <div>
          <button @click="user.setConnected">Se connecter</button>
        </div>
      </template>
    </p>
  </div>
</template>

<style>
</style>
