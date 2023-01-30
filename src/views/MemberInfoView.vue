<script setup>
import {onMounted, reactive, ref} from 'vue'

import {useRoute , useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

import {useUserStore} from "../stores/user";

const user = useUserStore();

import {useSessionStore} from "../stores/session";

const session = useSessionStore()

import {useMembersStore} from '../stores/members'


const membersStore = useMembersStore();
const idMember = route.params.id
const actualMember = membersStore.getMember(idMember);

let actualMemberMessages = reactive([])

import md5 from "md5";

onMounted(() => {
  if (session.isValid()) {
    console.log("C'est partie")

    api.get(`channels?token=${session.data.token}`)
        .then(response => {
          response.forEach(channel => {
            api.get(`channels/${channel.id}/posts?token=${session.data.token}`)
                .then(response => {
                  response.forEach(message => {
                    if (message.member_id === idMember) {
                      //console.log(channel)
                      //console.log(message)
                      actualMemberMessages.push({message: message, channel: channel})
                    }

                  })
                })
          })
          actualMemberMessages.sort((a,b) => new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime())
        })
  }
})

function delMember(){
  api.delete(`members/${idMember}?token=${session.data.token}`)
      .then(response => {
        router.push('/members-list')
      })
}


</script>


<template>
  <main class="m-3">
    <div class="m-3 p-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center justify-content-start">
          <figure class="my-1">
            <img :src="`${membersStore.avatarMember(actualMember)}`"
                 alt="..."
                 class="border border-4 rounded-circle"
                 width="96" height="96">
          </figure>
          <div>
            <h2 class="m-2">Nom: {{ actualMember.fullname }}<span v-if="actualMember.id === session.data.member.id"> (Vous)</span></h2>
            <p class="mx-2">@mail: {{ actualMember.email }}</p>
          </div>
        </div>
        <template v-if="actualMember.id !== session.data.member.id">
          <button @click="delMember()" class="btn btn-danger">Supprimer le membre</button>
        </template>
      </div>

      <hr class="m-3">
      <div class="m-2">
        <h3>Les 10 dernier messages:</h3>
        <ul>
          <template v-for="message in actualMemberMessages.slice(0,10)">
            <li>
              <router-link :to="{name: 'chat', params: {id: message.channel.id}}">
                <div class="card bg-dark text-white my-4 border-secondary">
                  <div class="card-header d-flex justify-content-between border-secondary">
                    <div>
                      Dans le chat:
                      <strong class="me-auto">{{ message.channel.topic }}</strong>
                    </div>
                    <div>
                      <small class="text-muted">{{ message.message.modified_at }}</small>
                    </div>
                  </div>
                  <div class="card-body">
                    {{ message.message.message }}
                  </div>
                </div>
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>


  </main>
</template>

<style scoped>

</style>