import { createRouter, createWebHistory } from 'vue-router'
import BossHome from '../views/BossHome.vue'
import FeeLedgerCenter from '../views/FeeLedgerCenter.vue'

const routes = [
  {
    path: '/',
    name: 'boss-home',
    component: BossHome,
  },
  {
    path: '/fee-ledger',
    name: 'fee-ledger',
    component: FeeLedgerCenter,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
