<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedCategory = ref('complaint')
const selectedEventId = ref('complaint-001')

const categories = [
  {
    id: 'complaint',
    name: '投诉事件',
    desc: '业主投诉、服务争议、重复投诉等事件。',
    events: createEvents('complaint', '投诉事件', 'TS', ['服务态度争议', '保洁不到位', '停车占位', '噪音扰民']),
  },
  {
    id: 'group',
    name: '群体反馈',
    desc: '多户联名、业主群集中反馈、公共议题。',
    events: createEvents('group', '群体反馈', 'QT', ['停车规则调整', '公共收益公示', '电梯等待时间', '装修噪音集中反馈']),
  },
  {
    id: 'safety',
    name: '安全隐患',
    desc: '设施安全、消防通道、设备异常等隐患。',
    events: createEvents('safety', '安全隐患', 'AQ', ['消防通道占用', '电梯异响', '地下车库积水', '配电房温度异常']),
  },
]

const activeCategory = computed(() => categories.find((category) => category.id === selectedCategory.value) ?? categories[0])
const selectedEvent = computed(
  () => activeCategory.value.events.find((event) => event.id === selectedEventId.value) ?? activeCategory.value.events[0],
)

function createEvents(categoryId, type, prefix, titles) {
  const owners = ['张主管', '李经理', '王主任', '陈经理', '周主管']
  const nodes = ['已登记', '已派责', '处理中', '待复核', '已闭环']
  const upgradeLevels = ['未升级', '升级至项目经理', '升级至区域主管', '升级至老板关注']

  return Array.from({ length: 28 }, (_, index) => {
    const no = index + 1
    const level = index % 9 === 0 ? 'L4' : index % 4 === 0 ? 'L3' : 'L2'
    const title = titles[index % titles.length]

    return {
      id: `${categoryId}-${String(no).padStart(3, '0')}`,
      code: `${prefix}-${String(no).padStart(4, '0')}`,
      title: `${title} #${String(no).padStart(2, '0')}`,
      level,
      fields: [
        { label: '处置节点', value: nodes[index % nodes.length] },
        { label: '责任人', value: owners[index % owners.length] },
        { label: '升级记录', value: upgradeLevels[index % upgradeLevels.length] },
        { label: '证据附件', value: `${type}照片${(index % 5) + 1}张、沟通记录${(index % 3) + 1}条` },
      ],
    }
  })
}

function selectCategory(category) {
  selectedCategory.value = category.id
  selectedEventId.value = category.events[0].id
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
  <main class="event-page">
    <header class="fee-topbar">
      <RouterLink to="/" class="back-button">返回</RouterLink>
      <div>
        <p class="eyebrow">风险平台</p>
        <h1>事件留痕与处理中心</h1>
      </div>
      <div class="connection-pill">
        <span class="status-dot" :class="connectionStatus"></span>
        <span>{{ connectionMessage }}</span>
      </div>
    </header>

    <section class="event-layout">
      <aside class="event-category-rail">
        <div class="dock-heading">
          <p class="eyebrow">选项卡</p>
          <h2>事件类型</h2>
        </div>

        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="event-category-card"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category)"
        >
          <strong>{{ category.name }}</strong>
          <span>{{ category.desc }}</span>
          <b>{{ category.events.length }} 条</b>
        </button>
      </aside>

      <section class="event-workspace">
        <section class="event-list-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">具体事件</p>
              <h2>{{ activeCategory.name }}</h2>
            </div>
            <span>{{ activeCategory.events.length }} 条</span>
          </div>

          <div class="event-list">
            <button
              v-for="event in activeCategory.events"
              :key="event.id"
              type="button"
              class="event-row"
              :class="{ active: selectedEventId === event.id, severe: event.level === 'L4', warning: event.level === 'L3' }"
              @click="selectedEventId = event.id"
            >
              <strong>{{ event.code }}</strong>
              <span>{{ event.title }}</span>
              <b>{{ event.level }}</b>
            </button>
          </div>
        </section>

        <section class="panel ledger-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">处置详情</p>
              <h2>{{ selectedEvent.title }}</h2>
            </div>
            <span>{{ selectedEvent.code }}</span>
          </div>

          <div class="room-field-grid event-field-grid">
            <article v-for="field in selectedEvent.fields" :key="field.label" class="room-field-card">
              <span>{{ field.label }}</span>
              <strong>{{ field.value }}</strong>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
