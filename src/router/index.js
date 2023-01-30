import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/create-account',
      name: 'create-account',
      component: () => import('../views/CreateAccountView.vue')
    },
    {
      path: '/list-chat',
      name: 'list-chat',
      component: () => import('../views/ListChatView.vue')
    },
    {
      path: '/create-chat',
      name: 'create-chat',
      component: () => import('../views/CreateChatView.vue')
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('../views/ChatView.vue')
    },
    {
      path: '/members-list',
      name: 'members-list',
      component: () => import('../views/MembersListView.vue')
    },
    {
      path: '/member-info/:id',
      name: 'member-info',
      component: () => import('../views/MemberInfoView.vue')
    },
  ]
})

export default router
