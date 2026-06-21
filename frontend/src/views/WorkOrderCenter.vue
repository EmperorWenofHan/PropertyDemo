<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedCategory = ref('repair')

const categories = [
  {
    id: 'repair',
    name: '报修',
    desc: '设施设备、户内维修、公共区域维修工单。',
    orders: createOrders('报修', 'WX', ['工程维修班-王师傅', '工程维修班-赵师傅', '弱电维保-刘工']),
  },
  {
    id: 'consult',
    name: '咨询',
    desc: '费用咨询、装修咨询、停车咨询、业务办理咨询。',
    orders: createOrders('咨询', 'ZX', ['客服中心-李娜', '客服中心-陈静', '管家组-周洁']),
  },
  {
    id: 'complaint',
    name: '投诉',
    desc: '服务投诉、噪音投诉、环境投诉、邻里纠纷。',
    orders: createOrders('投诉', 'TS', ['客服主管-何敏', '项目经理-林峰', '管家主管-吴倩']),
  },
]

const activeCategory = computed(() => categories.find((category) => category.id === selectedCategory.value) ?? categories[0])
const abnormalCount = computed(() => activeCategory.value.orders.filter((order) => order.abnormal).length)

function createOrders(type, prefix, handlers) {
  const statusOptions = ['已处理', '未处理', '已处理', '不满意']
  const sourceMap = {
    报修: ['水管漏水', '电梯异响', '门禁故障', '楼道照明异常', '空调排水堵塞', '地下车库积水'],
    咨询: ['物业费账单', '车位办理', '装修手续', '门禁授权', '发票申请', '公共收益查询'],
    投诉: ['夜间噪音', '垃圾清运', '保洁不到位', '车辆占位', '服务态度', '犬只扰民'],
  }

  return Array.from({ length: 36 }, (_, index) => {
    const no = index + 1
    const status = statusOptions[index % statusOptions.length]
    const overdue = index % 7 === 0 || status === '未处理'
    const abnormal = overdue || status !== '已处理'

    return {
      id: `${prefix}-${String(no).padStart(4, '0')}`,
      title: sourceMap[type][index % sourceMap[type].length],
      handler: handlers[index % handlers.length],
      status,
      overdue: overdue ? '是' : '否',
      visit: status === '未处理' ? '待回访' : status === '不满意' ? '业主不满意，需二次跟进' : '已回访，业主认可',
      abnormal,
    }
  })
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8080/api/hello')
    const data = await response.json()
    connectionMessage.value = data.message
    connectionStatus.value = 'ok'
  } catch (error) {
    connectionMessage.value = '前端已打开。启动 Java 后端后，这里会显示接口返回的数据。'
    connectionStatus.value = 'offline'
  }
})
</script>

<template>
  <main class="workorder-page">
    <header class="fee-topbar">
      <RouterLink to="/" class="back-button">返回</RouterLink>
      <div>
        <p class="eyebrow">工单平台</p>
        <h1>业主诉求与工单流转中心</h1>
      </div>
      <div class="connection-pill">
        <span class="status-dot" :class="connectionStatus"></span>
        <span>{{ connectionMessage }}</span>
      </div>
    </header>

    <section class="workorder-layout">
      <aside class="workorder-category-rail">
        <div class="dock-heading">
          <p class="eyebrow">项目卡</p>
          <h2>诉求类型</h2>
        </div>

        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="workorder-category-card"
          :class="{ active: selectedCategory === category.id }"
          @click="selectedCategory = category.id"
        >
          <strong>{{ category.name }}</strong>
          <span>{{ category.desc }}</span>
          <b>{{ category.orders.length }} 条</b>
        </button>
      </aside>

      <section class="workorder-workspace">
        <section class="room-selector-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">当前项目</p>
              <h2>{{ activeCategory.name }}工单</h2>
            </div>
            <span>异常 {{ abnormalCount }} 条</span>
          </div>

          <div class="order-list">
            <article
              v-for="order in activeCategory.orders"
              :key="order.id"
              class="order-card"
              :class="{ abnormal: order.abnormal, normal: !order.abnormal }"
            >
              <div class="order-main">
                <strong>{{ order.id }}</strong>
                <span>{{ order.title }}</span>
              </div>
              <div class="order-field">
                <span>派单</span>
                <strong>{{ order.handler }}</strong>
              </div>
              <div class="order-field">
                <span>状态</span>
                <strong>{{ order.status }}</strong>
              </div>
              <div class="order-field">
                <span>超时</span>
                <strong>{{ order.overdue }}</strong>
              </div>
              <div class="order-visit">
                <span>回访记录</span>
                <strong>{{ order.visit }}</strong>
              </div>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
