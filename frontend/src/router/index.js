import { createRouter, createWebHistory } from 'vue-router'
import BossHome from '../views/BossHome.vue'
import EventTraceCenter from '../views/EventTraceCenter.vue'
import FeeLedgerCenter from '../views/FeeLedgerCenter.vue'
import KnowledgeBaseCenter from '../views/KnowledgeBaseCenter.vue'
import OwnerRelationCenter from '../views/OwnerRelationCenter.vue'
import ReportCenter from '../views/ReportCenter.vue'
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
  {
    path: '/owner-relations',
    name: 'owner-relations',
    component: OwnerRelationCenter,
  },
  {
    path: '/event-trace',
    name: 'event-trace',
    component: EventTraceCenter,
  },
  {
    path: '/knowledge-base',
    name: 'knowledge-base',
    component: KnowledgeBaseCenter,
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportCenter,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
