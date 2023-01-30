<script setup>
import {useUserStore} from "../stores/user";
import {useSessionStore} from "../stores/session";

const user = useUserStore();
const session = useSessionStore()
</script>

<template>
    <template v-if="session.data.member.fullname">
      <h1>Bienvenue {{session.data.member.fullname}} dans Coop</h1>
    </template>
    <template v-else>
      <h1>Bienvenue dans Coop</h1>
    </template>

</template>
