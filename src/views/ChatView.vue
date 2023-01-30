<script setup>
import {onMounted, reactive, ref} from 'vue'

import {useRoute , useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

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

let editDataMessage = reactive({
  channel_id: data.channel.id,
  id: '',
  message: ''
})

let editDataChannel = reactive({
  id: idChat,
  label: '',
  topic: ''
})

function loadMessages() {
  api.get(`channels/${idChat}/posts?token=${session.data.token}`)
      .then(response => {
        data.messages = response;
        //console.log(response)
        // scroll au dernier message
        var elem = document.getElementById('message-container');
        if (elem !== null) {
          elem.scrollTop = elem.scrollHeight;
        }
      })
}

function delChat(){
  api.delete(`channels/${idChat}?token=${session.data.token}`)
      .then(response => {
          router.push('/list-chat')
      })
}
function delMessage(message){
  api.delete(`channels/${idChat}/posts/${message.id}?token=${session.data.token}`)
      .then(response => {
        loadMessages()
      })
}
function changeEditMessage(message){
  editDataMessage.id = message.id
}
function editMessage(){

  api.put(`channels/${idChat}/posts/${editDataMessage.id}?token=${session.data.token}`,{
    body: editDataMessage
  }).then(response => {
    loadMessages()
  })
}

function editChannel(){
  api.put(`channels/${idChat}?token=${session.data.token}`,{
    body: editDataChannel
  }).then(response => {
    location.reload();
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

</script>

<template>
  <main>


    <div class="modal fade" id="editChannel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content text-bg-dark">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Edition de conversation</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editChannel()" class="row g-0 mt-4">

              <div class="mb-3">
                <label  class="form-label">Topic</label>
                <input type="text" class="form-control" v-model="editDataChannel.topic" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Label</label>
                <input type="text" class="form-control" v-model="editDataChannel.label" required>
              </div>

              <button type="button" class="mt-3 btn btn-secondary col-4" data-bs-dismiss="modal">Annuler</button>
              <button type="submit" class="mt-3 btn btn-success offset-4 col-4" data-bs-dismiss="modal">Modifier</button>
            </form>
          </div>
        </div>
      </div>
    </div>


    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <h2>Liste des messages de {{ data.channel.topic }}</h2>
        <div class="d-flex flex-column justify-content-end ">
          <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editChannel">Modifier la conversation</button>
          <button @click="delChat()" class="btn btn-danger mt-1">Supprimer la conversation</button>
        </div>
      </div>
      <p>
        {{ data.channel.label }}
      </p>

      <div class="modal fade" id="editMessage" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content text-bg-dark">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Edition de message</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="editMessage()" class="row g-0 mt-4">
                <div class="col-12">
                  <input type="text" class="form-control" placeholder="Message" v-model="editDataMessage.message" required>
                </div>
                <button type="button" class="mt-3 btn btn-secondary col-4" data-bs-dismiss="modal">Annuler</button>
                <button type="submit" class="mt-3 btn btn-success offset-4 col-4" data-bs-dismiss="modal">Modifier</button>
              </form>
            </div>
          </div>
        </div>
      </div>



      <div class="container">
        <div class="d-flex overflow-auto" id="message-container" style="flex-direction: column-reverse; height: 50vh">
          <template v-for="message in data.messages">
            <div v-bind:class="[findMember(message).id === session.data.member.id ? 'justify-content-end': 'justify-content-start', 'd-flex']">
              <div class="card bg-dark text-white border-secondary m-3" style="width: 80%">
                <div class="card-header d-flex justify-content-between align-items-center border-secondary py-0 ps-0">
                  <router-link :to="{name: 'member-info', params: {id: findMember(message).id}}">
                    <div class="d-flex align-items-center">
                      <figure class="m-1 ms-2">
                        <img :src="`${membersStore.avatarMember(findMember(message))}`"
                             alt="..."
                             class="border border-4 rounded-circle"
                             width="48" height="48">
                      </figure>
                      <strong class="">{{ findMember(message).fullname }} <span v-if="findMember(message).id === session.data.member.id"> (Vous)</span></strong>
                    </div>
                  </router-link>
                  <div>
                    <div>
                      <small class="text-muted">{{ message.modified_at }}</small>
                    </div>
                    <template v-if="findMember(message).id === session.data.member.id">
                      <div class="d-flex justify-content-end">
                        <button class="m-1 btn btn-outline-warning" @click="changeEditMessage(message)" data-bs-toggle="modal" data-bs-target="#editMessage"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="m-1 btn btn-outline-danger" @click="delMessage(message)"><i class="fa-solid fa-trash-can"></i></button>
                      </div>
                    </template>
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
