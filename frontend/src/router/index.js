import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import LoginPage from '../components/LoginPage.vue';
import OpenPage from '../components/OpenFolder.vue';

const routes = [
  { path: '/', component: LoginPage }, 
  { path: '/home', component: HomePage }, 
  {
    path: '/open/:folderId',
    component: OpenPage,
    name: 'openFolder',
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
