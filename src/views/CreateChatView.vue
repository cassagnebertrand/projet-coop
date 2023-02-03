<script setup>
import {onMounted, reactive, ref} from 'vue'

import {useUserStore} from "../stores/user";
const user = useUserStore();

import {useSessionStore} from "../stores/session";
const session = useSessionStore()

import {useRouter} from 'vue-router'
const router = useRouter()

onMounted( () => {
  if (session.isValid()){
    console.log("Hé zé bartie")
  }
})

let channel = reactive({
  topic: '',
  label: ''
})

function validateForm(){
  api.post(`channels?token=${session.data.token}`,{
    body: channel
  }).then(response => {
    if (response.message){
      alert(response.message)
    } else {
      console.log(response)
      router.push(`/chat/${response.id}`)
    }
  })
}

</script>

<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-4 offset-4 border border-light rounded-1 p-4 mt-4">
          <h1>Créer une conversation</h1>
          <form @submit.prevent="validateForm">

            <div class="mb-3">
              <label  class="form-label">Topic</label>
              <input type="text" class="form-control" v-model="channel.topic" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Label</label>
              <input type="text" class="form-control" v-model="channel.label" required>
            </div>

            <button type="submit" class="btn btn-success">Créer</button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
