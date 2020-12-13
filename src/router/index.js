import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import Aluno from '../components/Aluno'
import Professor from '../components/Professor'
import Funcionario from '../components/Funcionario'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/alunos',
    name: 'Aluno',
    component: Aluno
  },
  {
    path: '/professores',
    name: 'Professor',
    component: Professor
  },
  {
    path: '/funcionarios',
    name: 'Funcionario',
    component: Funcionario
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
