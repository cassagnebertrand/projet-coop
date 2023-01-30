import {onMounted, reactive, ref} from 'vue'
import { defineStore } from 'pinia'
import {useRouter} from 'vue-router'



export const useSessionStore = defineStore('session', () => {
  const router = useRouter()
  const data = reactive({
    member: {},
    token: false
  });

  function setSession(member,token) {
    data.member = member;
    data.token = token;
    console.log(member)
  }

  function rmSession() {
    data.member = {};
    data.token = false;
  }

  async function isValid () {

    if (!data.token) {
      connect();
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
