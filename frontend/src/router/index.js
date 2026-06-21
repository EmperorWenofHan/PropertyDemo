import { createRouter, createWebHistory } from 'vue-router'
import BossHome from '../views/BossHome.vue'
import FeeLedgerCenter from '../views/FeeLedgerCenter.vue'
import WorkOrderCenter from '../views/WorkOrderCenter.vue'

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
  {
    path: '/work-orders',
    name: 'work-orders',
    component: WorkOrderCenter,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
