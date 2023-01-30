<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

let member = reactive({
  fullname: '',
  email: '',
  password: ''
})

function validateForm(){
  console.log(member);
  api.post('members',{
    body: member
  }).then(response => {
    if (response.message){
      alert(response.message)
    } else {
      if (confirm("Votrer compte a été créé. Voulez-vous vous connecter ?")){
          router.push('/login')
      }
    }
  })
}

</script>

<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-4 offset-4  border border-light rounded-1 p-4 mt-4">
          <h1>Créer un compte</h1>
          <form @submit.prevent="validateForm">

            <div class="mb-3">
              <label  class="form-label">Pseudo</label>
              <input type="text" class="form-control" v-model="member.fullname" required>
            </div>

            <div class="mb-3">
              <label class="form-label">E-mail</label>
              <input type="email" class="form-control" v-model="member.email" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Mot de passe</label>
              <input type="password" class="form-control" v-model="member.password" required>
            </div>

            <button type="submit" class="btn btn-success">Créer</button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
