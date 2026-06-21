<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedCategory = ref('sop')
const selectedRecordId = ref('sop-001')

const categories = [
  {
    id: 'sop',
    name: '服务 SOP',
    desc: '接待、处理、回访、异常升级等标准流程。',
    records: createSopRecords(),
  },
  {
    id: 'promise',
    name: '禁止承诺清单',
    desc: '不能说的话、不能承诺的时间、不能越权的事项。',
    records: createSimpleRecords('promise', '禁止承诺', ['承诺免收物业费', '承诺当天完成复杂维修', '承诺替业主认定责任', '承诺删除投诉记录']),
  },
  {
    id: 'case',
    name: '典型案例',
    desc: '优秀服务案例、投诉复盘、风险化解案例。',
    records: createSimpleRecords('case', '典型案例', ['高频投诉安抚案例', '欠费争议化解案例', '空置房漏水协调案例', '群体反馈沟通案例']),
  },
  {
    id: 'training',
    name: '培训任务',
    desc: '客服、管家、项目经理的服务标准培训安排。',
    records: createSimpleRecords('training', '培训任务', ['新员工接待规范培训', '投诉升级处理演练', '工单填写规范训练', '回访话术抽查']),
  },
  {
    id: 'assessment',
    name: '考核记录',
    desc: '质检抽查、话术评分、案例复盘和培训结果。',
    records: createSimpleRecords('assessment', '考核记录', ['客服话术质检', '管家触达记录抽查', '工单闭环率考核', '投诉复盘评分']),
  },
]

const activeCategory = computed(() => categories.find((category) => category.id === selectedCategory.value) ?? categories[0])
const selectedRecord = computed(
  () => activeCategory.value.records.find((record) => record.id === selectedRecordId.value) ?? activeCategory.value.records[0],
)

function createSopRecords() {
  const scenes = ['客户来电接待', '前台现场接待', '微信群咨询接待', '报修进线处理', '投诉初次接待']

  return Array.from({ length: 32 }, (_, index) => {
    const no = index + 1

    return {
      id: `sop-${String(no).padStart(3, '0')}`,
      title: `${scenes[index % scenes.length]} SOP ${String(no).padStart(2, '0')}`,
      owner: ['客服主管', '项目经理', '管家主管'][index % 3],
      status: index % 5 === 0 ? '待复训' : '已发布',
      fields: [
        { label: '接待规范', value: '开场白、称呼、语气、礼貌用语' },
        { label: '流程步骤', value: '客户进线 → 询问需求 → 核实信息 → 处理问题 → 确认结果 → 收尾回访' },
        { label: '异常处理', value: '客户投诉、客户发火、处理不了的问题按规则转接 / 上报' },
        { label: '时效标准', value: '消息 10 分钟内回复，普通工单 24 小时内处理，完成后 48 小时内回访' },
        { label: '禁止行为', value: '不能说推责话术，不能承诺越权事项，不能私自删除或关闭工单' },
        { label: '配套模板', value: '回复话术、表单、工单填写规范' },
      ],
    }
  })
}

function createSimpleRecords(prefix, type, titles) {
  return Array.from({ length: 30 }, (_, index) => {
    const no = index + 1

    return {
      id: `${prefix}-${String(no).padStart(3, '0')}`,
      title: `${titles[index % titles.length]} ${String(no).padStart(2, '0')}`,
      owner: ['客服主管', '项目经理', '品质专员', '管家主管'][index % 4],
      status: index % 6 === 0 ? '待复盘' : '有效',
      fields: [
        { label: '记录类型', value: type },
        { label: '适用对象', value: ['客服', '管家', '项目经理'][index % 3] },
        { label: '使用场景', value: titles[index % titles.length] },
        { label: '处理要求', value: '按标准记录、复核、归档，并在晨会或培训中同步。' },
      ],
    }
  })
}

function selectCategory(category) {
  selectedCategory.value = category.id
  selectedRecordId.value = category.records[0].id
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
  <main class="knowledge-page">
    <header class="fee-topbar">
      <RouterLink to="/" class="back-button">返回</RouterLink>
      <div>
        <p class="eyebrow">知识平台</p>
        <h1>服务标准与案例知识库</h1>
      </div>
      <div class="connection-pill">
        <span class="status-dot" :class="connectionStatus"></span>
        <span>{{ connectionMessage }}</span>
      </div>
    </header>

    <section class="knowledge-layout">
      <aside class="knowledge-category-rail">
        <div class="dock-heading">
          <p class="eyebrow">选项卡</p>
          <h2>知识分类</h2>
        </div>

        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="knowledge-category-card"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category)"
        >
          <strong>{{ category.name }}</strong>
          <span>{{ category.desc }}</span>
          <b>{{ category.records.length }} 条</b>
        </button>
      </aside>

      <section class="knowledge-workspace">
        <section class="event-list-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">记录列表</p>
              <h2>{{ activeCategory.name }}</h2>
            </div>
            <span>{{ activeCategory.records.length }} 条</span>
          </div>

          <div class="knowledge-record-list">
            <button
              v-for="record in activeCategory.records"
              :key="record.id"
              type="button"
              class="knowledge-record-row"
              :class="{ active: selectedRecordId === record.id }"
              @click="selectedRecordId = record.id"
            >
              <strong>{{ record.title }}</strong>
              <span>{{ record.owner }}</span>
              <b>{{ record.status }}</b>
            </button>
          </div>
        </section>

        <section class="panel ledger-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">详情</p>
              <h2>{{ selectedRecord.title }}</h2>
            </div>
            <span>{{ selectedRecord.owner }}</span>
          </div>

          <div class="room-field-grid knowledge-field-grid">
            <article v-for="field in selectedRecord.fields" :key="field.label" class="room-field-card">
              <span>{{ field.label }}</span>
              <strong>{{ field.value }}</strong>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
