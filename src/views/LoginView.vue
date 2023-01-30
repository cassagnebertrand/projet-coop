<script setup>
import {useRouter} from 'vue-router'
import {useUserStore} from "../stores/user";
import {useSessionStore} from "../stores/session";

const router = useRouter()
const user = useUserStore();
const session = useSessionStore()

let member = reactive({
  email: '',
  password: ''
})

function validateForm(){
  console.log(member);
  api.post('members/signin',{
    body: member
  }).then(response => {
    if (response.message){
      alert(response.message)
    } else {
      session.setSession(response.member,response.token);
      user.setConnected();
      router.push('/');

    }

  })
}
</script>

<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-4 offset-4 border border-light rounded-1 p-4 mt-4">
          <h1>Conexion</h1>
          <form @submit.prevent="validateForm">

            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input type="email" class="form-control" v-model="member.email" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" v-model="member.password" required>
            </div>

            <button type="submit" class="btn btn-success">Se connecter</button>
          </form>
          <div class="d-flex justify-content-center">
            <RouterLink to="/create-account">
              <button type="button" class="btn btn-warning mt-2">Créer un compte</button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
