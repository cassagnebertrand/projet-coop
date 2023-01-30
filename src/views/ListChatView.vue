<script setup>
import {onMounted, reactive, ref} from 'vue'
import {useUserStore} from "../stores/user";
const user = useUserStore();

import {useSessionStore} from "../stores/session";

const session = useSessionStore()

let channels = ref([])

onMounted( () => {
  if (session.isValid()){
    console.log("C'est partie")

    api.get(`channels?token=${session.data.token}`)
        .then(response => {
          channels.value = response;
        })
  }
})

</script>

<template>
  <main>
    <div class="container">
      <h2>Liste des conversations</h2>
      <h3>
        <small class="text-muted">
          <RouterLink to="/create-chat">Créer une conversation</RouterLink>
        </small>
      </h3>
      <div class="container">
        <div class="row g-2">
          <template v-for="channel in channels">
            <router-link :to="{name: 'chat', params: {id: channel.id}}" class="col-4">
              <div class="card bg-dark text-white border-secondary">
                <div class="card-header border-secondary">
                  <h5 class="card-title">{{channel.topic}}</h5>
                </div>
                <div class="card-body">
                  <p class="card-text">{{channel.label}}</p>
                </div>
              </div>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>
