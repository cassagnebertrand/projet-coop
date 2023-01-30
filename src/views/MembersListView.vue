<script setup>
import { ref, onMounted, inject } from 'vue';
import { useMembersStore } from '../stores/members'
// const membersStore = inject('members');
const membersStore = useMembersStore();

</script>

<template>
  <main class="m-3">
    <h2 class="">Liste des membres</h2>
    <ul>
      <template v-for="members in membersStore.state.members">
        <li>
          <hr>
          <div class="d-flex flex-row justify-content-start m-2 p-2 align-items-center">
            <RouterLink :to="{name: 'member-info', params: {id: members.id}}">
              <button type="button" class="btn btn-outline-warning"><i class="fa-regular fa-eye"></i></button>
            </RouterLink>
            <h2 class="ms-4">{{ members.fullname }}</h2>
          </div>
        </li>
      </template>

    </ul>
  </main>
</template>

<style scoped>

</style>