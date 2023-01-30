<script setup>
import {onMounted, reactive, ref} from 'vue'

import {useRoute} from "vue-router";

const route = useRoute();

import {useUserStore} from "../stores/user";

const user = useUserStore();

import {useSessionStore} from "../stores/session";

const session = useSessionStore()

console.log(session.data.member.id)

import {useMembersStore} from '../stores/members'

const membersStore = useMembersStore();

import md5 from 'md5';

const idChat = route.params.id

let data = reactive({
  channel: {},
  messages: [],
  //members: []
})

let dataMessage = reactive({
  member_id: session.data.member.id,
  channel_id: data.channel.id,
  message: ''
})

function loadMessages() {
  api.get(`channels/${idChat}/posts?token=${session.data.token}`)
      .then(response => {
        data.messages = response;
        //console.log(response)
      })
}

onMounted(() => {
  if (session.isValid()) {
    console.log("C'est partie")


    api.get(`channels/${idChat}?token=${session.data.token}`)
        .then(response => {
          data.channel = response;
          //console.log(response)
        })

    loadMessages()

    /*
    api.get(`members?token=${session.data.token}`)
        .then(response => {
          data.members = response;
          console.log(response)
        })
    */
  }

  // scroll au dernier message
  window.setInterval(function () {
    var elem = document.getElementById('message-container');
    if (elem !== null) {
      elem.scrollTop = elem.scrollHeight;
    }

  }, 5000);
})


function validateForm() {
  api.post(`channels/${data.channel.id}/posts?token=${session.data.token}`, {
    body: dataMessage
  }).then(response => {
    dataMessage.message = '';
    loadMessages()
  })
}

function findMember(msg) {
  const idMember = msg.member_id
  const actualMember = membersStore.getMember(idMember)
  //console.log(actualMember.fullname)

  return actualMember
}

function avatarMember(member) {
  return `https://www.gravatar.com/avatar/${md5(member.email)}d=404`
}

</script>

<template>
  <main>
    <div class="container">
      <h2>Liste des messages de {{ data.channel.topic }}</h2>
      <p>
        {{ data.channel.label }}
      </p>
      <div class="container">
        <div class="d-flex overflow-auto" id="message-container" style="flex-direction: column-reverse; height: 50vh">
          <template v-for="message in data.messages">
            <div v-bind:class="[findMember(message).id === session.data.member.id ? 'justify-content-end': 'justify-content-start', 'd-flex']">
              <div class="card bg-dark text-white border-secondary my-3" style="width: 90%">
                <div class="card-header d-flex justify-content-between border-secondary py-0 ps-0">
                  <router-link :to="{name: 'member-info', params: {id: findMember(message).id}}">
                    <div class="d-flex align-items-center">
                      <figure class="m-1">
                        <img :src="`${avatarMember(findMember(message))}`"
                             alt="..."
                             class="border border-4 rounded-circle"
                             width="48" height="48">
                      </figure>
                      <strong class="">{{ findMember(message).fullname }} <span v-if="findMember(message).id === session.data.member.id"> (Vous)</span></strong>
                    </div>
                  </router-link>
                  <div>
                    <small class="text-muted">{{ message.modified_at }}</small>
                  </div>
                </div>
                <div class="card-body">
                  {{ message.message }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <form @submit.prevent="validateForm" class="row g-0 mt-4">
          <div class="col-md-9 col-sm-8">
            <input type="text" class="form-control" placeholder="Message" v-model="dataMessage.message" required>
          </div>
          <button type="submit" class="btn btn-success offset-1 col-md-2 col-sm-3">Envoyer</button>
        </form>
      </div>
    </div>
  </main>
</template>
