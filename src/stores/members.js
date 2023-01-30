import { inject, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useSessionStore } from '../stores/session'

export const useMembersStore = defineStore('members', () => {
    const session = useSessionStore();
    const state = reactive({
        members: []
    });

    /**
     * Charge les membres dans le store
     */
    function loadMembers() {
        return new Promise(async (resolve, reject) => {
            const response = await api.get(`members?token=${session.data.token}`);
            const membersData = await response;
            state.members = membersData;
            console.log(membersData)
            resolve(membersData);
        });
    }



    /**
     * Retourne le nom d'un membre à partir de son id
     * @param {int} id
     * @returns
     */
    function getMember(id) {
        for (const member of state.members) {
            if(member.id === id){
                return member;
            }
        }
    }

    return { state, loadMembers, getMember }
}, {
    persist: false,
})