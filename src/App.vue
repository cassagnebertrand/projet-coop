<script setup>

import {useUserStore} from "./stores/user";
import {useSessionStore} from "./stores/session";
import {onMounted, reactive} from "vue";
import {useMembersStore} from "./stores/members";
import router from "./router";
import {useRoute} from "vue-router";

import md5 from "md5";

const state = reactive({appReady: false, sessionValid: false})

const user = useUserStore();
const session = useSessionStore();
const members = useMembersStore();
const route = useRoute();




function disconnect() {
  user.disconnect();
  session.rmSession()
}

watch(route,(to)=>{
  start()
})

onMounted(()=>{
  start()
})
function start(){
  if (session.isValid()){
    members.loadMembers().then(()=>{
      state.sessionValid = true;
      state.appReady = true;
    });
  }else {
    state.sessionValid = false;
    state.appReady = false;
  }
}


</script>

<template>
  <header class="mb-3 border-bottom border-light">
    <nav class="navbar navbar-expand-lg bg-dark text-light">
      <div class="container-fluid">
        <ul class="d-flex m-0">
          <li class="ms-3">
            <RouterLink to="/">Accueil</RouterLink>
          </li>
          <li class="ms-3">
            <RouterLink to="/list-chat">Chat</RouterLink>
          </li>
          <li class="ms-3">
            <RouterLink to="/members-list">Liste des membres</RouterLink>
          </li>
        </ul>
        <div>
          <template v-if="user.isConnected">
            <div class="d-flex align-items-center">
              <div class="dropdown me-3">
                <button class="btn btn-warning dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                  {{ session.data.member.fullname }}
                </button>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                  <RouterLink :to="{name: 'member-info', params: {id: session.data.member.id}}">
                    <li><span class="dropdown-item">Mon profil</span></li>
                  </RouterLink>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <RouterLink to="/login">
                      <a class="dropdown-item" @click="disconnect">Se déconnecter</a>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <figure class="my-1">
                <img :src="`${members.avatarMember(session.data.member)}`"
                     alt="..."
                     class="border border-4 rounded-circle"
                     width="64" height="64">
              </figure>
            </div>
          </template>
          <template v-else>
            <div>
              <RouterLink to="/login">
                <button type="button" class="btn btn-warning">Se connecter</button>
              </RouterLink>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </header>

 

  <RouterView />
</template>

<style scoped>


</style>
