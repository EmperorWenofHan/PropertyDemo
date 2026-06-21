<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedCategory = ref('fee')
const selectedRecordId = ref('fee-001')

const categories = [
  { id: 'fee', name: '收费数据汇总', desc: '收缴率、欠费、预收、争议金额等经营数据。', records: createRecords('fee', '收费', ['月度收缴率', '欠费结构', '预收冲抵', '争议金额']) },
  { id: 'work', name: '工单数据汇总', desc: '工单量、闭环率、超时率、满意度等服务数据。', records: createRecords('work', '工单', ['工单闭环率', '超时工单', '回访满意度', '派单效率']) },
  { id: 'risk', name: '风险数据汇总', desc: 'L3/L4 风险、升级事件、责任链和证据状态。', records: createRecords('risk', '风险', ['L3 风险趋势', 'L4 风险清单', '升级处置', '证据完整度']) },
  { id: 'care', name: '关怀数据汇总', desc: '业主触达、生日关怀、入住周年和重点业主维护。', records: createRecords('care', '关怀', ['触达完成率', '生日关怀', '重点业主维护', '空置房回访']) },
  { id: 'training', name: '培训数据汇总', desc: '培训任务、考核记录、质检结果和案例复盘。', records: createRecords('training', '培训', ['培训完成率', '质检得分', '案例复盘', 'SOP 掌握度']) },
  { id: 'template', name: '周报/月报模板', desc: '老板周报、项目月报、续约证据包和经营汇报模板。', records: createRecords('template', '模板', ['老板周报', '项目月报', '续约证据包', '经营汇报']) },
]

const exportMaterials = [
  { name: '老板周报 PDF', format: 'PDF', status: '可导出' },
  { name: '项目月报 Excel', format: 'XLSX', status: '可导出' },
  { name: '续约证据包', format: 'ZIP', status: '生成中' },
  { name: '风险处置附件汇总', format: 'PDF', status: '可导出' },
]

const activeCategory = computed(() => categories.find((category) => category.id === selectedCategory.value) ?? categories[0])
const selectedRecord = computed(
  () => activeCategory.value.records.find((record) => record.id === selectedRecordId.value) ?? activeCategory.value.records[0],
)

function createRecords(prefix, type, subjects) {
  return Array.from({ length: 32 }, (_, index) => {
    const no = index + 1
    const value = prefix === 'template' ? `${(index % 6) + 1} 个章节` : `${72 + ((index * 7) % 24)}.${index % 10}%`

    return {
      id: `${prefix}-${String(no).padStart(3, '0')}`,
      title: `${subjects[index % subjects.length]} ${String(no).padStart(2, '0')}`,
      owner: ['老板端', '项目经理', '财务', '客服主管'][index % 4],
      status: index % 5 === 0 ? '待校验' : '已汇总',
      fields: [
        { label: '数据类型', value: type },
        { label: '统计周期', value: index % 2 === 0 ? '本周' : '本月' },
        { label: '核心指标', value },
        { label: '数据来源', value: '收费台账、工单流转、风险留痕、关怀触达、培训记录' },
        { label: '经营判断', value: index % 5 === 0 ? '需项目经理复核后进入汇报材料。' : '可直接纳入经营报表。' },
        { label: '更新时间', value: `2026-06-${String((index % 28) + 1).padStart(2, '0')}` },
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
  <main class="report-page">
    <header class="fee-topbar">
      <RouterLink to="/" class="back-button">返回</RouterLink>
      <div>
        <p class="eyebrow">经营平台</p>
        <h1>经营数据仓与报表中心</h1>
      </div>
      <div class="connection-pill">
        <span class="status-dot" :class="connectionStatus"></span>
        <span>{{ connectionMessage }}</span>
      </div>
    </header>

    <section class="report-layout">
      <aside class="report-category-rail">
        <div class="dock-heading">
          <p class="eyebrow">选项卡</p>
          <h2>数据分类</h2>
        </div>

        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="report-category-card"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category)"
        >
          <strong>{{ category.name }}</strong>
          <span>{{ category.desc }}</span>
          <b>{{ category.records.length }} 条</b>
        </button>
      </aside>

      <section class="report-workspace">
        <section class="event-list-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">具体条目</p>
              <h2>{{ activeCategory.name }}</h2>
            </div>
            <span>{{ activeCategory.records.length }} 条</span>
          </div>

          <div class="knowledge-record-list">
            <button
              v-for="record in activeCategory.records"
              :key="record.id"
              type="button"
              class="report-record-row"
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
              <p class="eyebrow">经营属性</p>
              <h2>{{ selectedRecord.title }}</h2>
            </div>
            <span>{{ selectedRecord.owner }}</span>
          </div>

          <div class="room-field-grid report-field-grid">
            <article v-for="field in selectedRecord.fields" :key="field.label" class="room-field-card">
              <span>{{ field.label }}</span>
              <strong>{{ field.value }}</strong>
            </article>
          </div>
        </section>

        <section class="panel export-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">导出材料</p>
              <h2>可导出材料</h2>
            </div>
            <span>{{ exportMaterials.length }} 项</span>
          </div>

          <div class="export-grid">
            <article v-for="material in exportMaterials" :key="material.name" class="export-card">
              <strong>{{ material.name }}</strong>
              <span>{{ material.format }}</span>
              <b>{{ material.status }}</b>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
