import {onMounted, reactive, ref} from 'vue'
import { defineStore } from 'pinia'
import {useRouter, useRoute} from 'vue-router'


export const useSessionStore = defineStore('session', () => {
  const router = useRouter()
  const route = useRoute()
  const data = reactive({
    member: {},
    token: false
  });


  const openRoot = ['login', 'create-account'];

  function setSession(member,token) {
    data.member = member;
    data.token = token;
    console.log(member)
  }

  function rmSession() {
    data.member = {};
    data.token = false;
  }

  function isOpenRoot (route) {
    return openRoot.includes(route.name)
  }

  async function isValid () {

    if (isOpenRoot(route)){
      return true
    }

    if (!data.token) {
      connect()
      return false
    } else {
      const mid = data.member.id;

      const response = await api.get(`members/${mid}/signedin?token=${data.token}`);

      const dataResp = await response;

      if (!dataResp.token){
        connect();
        return false
      }
      return true
    }
  }
  function connect() {
    router.push('/login')
  }

  return {data, setSession, rmSession, isValid}
},{
  persist: true
})
