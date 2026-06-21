<script setup>
import { computed, onMounted, ref } from 'vue'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedArea = ref('收费台账与回款流程中心')

const areas = [
  {
    name: '收费台账与回款流程中心',
    tag: '财务 / 客服 / 项目经理',
    icon: '收',
    accent: '#2f6f73',
    metric: '87.3%',
    metricLabel: '物业费收缴率',
    summary: '管理房号、面积、费率、应收、实收、欠费、预收冲抵、滞纳金、分摊、缴费凭证和争议记录。',
    responsibilities: [
      '房号',
      '面积',
      '费率',
      '应收',
      '实收',
      '欠费',
      '预收冲抵',
      '滞纳金',
      '分摊',
      '缴费凭证',
      '争议记录',
    ],
    tasks: ['回款记录核对', '争议证据归档', '承诺兑现跟进'],
  },
  {
    name: '业主诉求与工单流转中心',
    tag: '客服 / 工程 / 管家',
    icon: '工',
    accent: '#4f6f52',
    metric: '42',
    metricLabel: '待处理诉求',
    summary: '统一承接报修、咨询、投诉入口，跟踪工单编号、派单、状态、超时、图片和回访记录。',
    responsibilities: ['报修/咨询/投诉入口', '工单编号', '派单', '状态', '超时', '图片', '回访记录'],
    tasks: ['工单闭环检查', '现场照片补全', '回访满意度确认'],
  },
  {
    name: '业主关系档案与触达任务中心',
    tag: '管家 / 客服 / 项目经理',
    icon: '档',
    accent: '#8a5a44',
    metric: '126',
    metricLabel: '今日触达任务',
    summary: '沉淀生日、入住周年、家庭标签、空置状态、车辆、服务偏好和触达记录，形成持续服务关系。',
    responsibilities: ['生日', '入住周年', '家庭标签', '空置状态', '车辆', '服务偏好', '触达记录'],
    tasks: ['关怀任务执行', '触达结果登记', '业主反馈整理'],
  },
  {
    name: '事件留痕与升级处置中心',
    tag: '项目经理 / 主管 / 老板',
    icon: '事',
    accent: '#5a648c',
    metric: '9',
    metricLabel: '重点风险事件',
    summary: '记录投诉事件、群体反馈、安全隐患、处置节点、责任人、升级记录和证据附件。',
    responsibilities: ['投诉事件', '群体反馈', '安全隐患', '处置节点', '责任人', '升级记录', '证据附件'],
    tasks: ['风险台账更新', '处置过程补录', '责任链确认'],
  },
  {
    name: '服务标准与案例知识库',
    tag: '项目经理 / 客服 / 管家',
    icon: '知',
    accent: '#956f2f',
    metric: '36',
    metricLabel: '在训服务标准',
    summary: '维护标准话术、服务 SOP、禁止承诺清单、典型案例、培训任务和考核记录。',
    responsibilities: ['标准话术', '服务 SOP', '禁止承诺清单', '典型案例', '培训任务', '考核记录'],
    tasks: ['培训记录归档', '质检结果复盘', '典型案例沉淀'],
  },
  {
    name: '经营数据仓与报表中心',
    tag: '老板 / 项目经理',
    icon: '报',
    accent: '#6f4b7c',
    metric: '12',
    metricLabel: '本月报表材料',
    summary: '汇总收费、工单、风险、关怀、培训数据，沉淀周报、月报模板和可导出经营材料。',
    responsibilities: ['收费数据', '工单数据', '风险数据', '关怀数据', '培训数据', '周报/月报模板', '导出材料'],
    tasks: ['老板周报生成', '月报数据校验', '续约证据整理'],
  },
]

const operationStats = [
  { label: '在管项目', value: '12', trend: '+2 本季' },
  { label: '服务住户', value: '8,426', trend: '覆盖 36 栋' },
  { label: '今日工单', value: '214', trend: '已完成 168' },
  { label: '本月收费', value: '¥326.8万', trend: '较上月 +8.6%' },
]

const workOrders = [
  { type: '收费', title: '商铺 18 号租户欠费承诺兑现', owner: '收费台账与回款流程中心', level: '高', status: '待催缴' },
  { type: '工单', title: '3 栋 1202 空调漏水报修', owner: '业主诉求与工单流转中心', level: '紧急', status: '待分派' },
  { type: '触达', title: '新入住业主资料与服务偏好确认', owner: '业主关系档案与触达任务中心', level: '普通', status: '待回访' },
  { type: '风险', title: '地下车库 B 区照明隐患升级处置', owner: '事件留痕与升级处置中心', level: '高', status: '处理中' },
]

const activeArea = computed(() => areas.find((area) => area.name === selectedArea.value) ?? areas[0])

const fieldSamples = {
  房号: '1-1201',
  面积: '96.40㎡',
  费率: '2.60 元/㎡',
  应收: '250.64',
  实收: '0.00',
  欠费: '250.64',
  预收冲抵: '100.00',
  滞纳金: '8.20',
  分摊: '12.00',
  缴费凭证: '查看凭证',
  争议记录: '1 条',
}

const activeFields = computed(() =>
  (activeArea.value.responsibilities ?? []).map((field) => ({
    label: field,
    value: fieldSamples[field] ?? '待录入',
  })),
)

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
  <main class="property-app">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">P</span>
        <div>
          <p>Property Demo</p>
          <strong>智慧物业系统</strong>
        </div>
      </div>

      <nav class="area-nav" aria-label="物业系统功能区">
        <button
          v-for="area in areas"
          :key="area.name"
          type="button"
          :class="{ active: selectedArea === area.name }"
          @click="selectedArea = area.name"
        >
          <span class="nav-icon" :style="{ backgroundColor: area.accent }">{{ area.icon }}</span>
          <span>
            <strong>{{ area.name }}</strong>
            <small>{{ area.tag }}</small>
          </span>
        </button>
      </nav>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">物业运营中心</p>
          <h1>六大业务中心</h1>
        </div>
        <div class="connection-pill">
          <span class="status-dot" :class="connectionStatus"></span>
          <span>{{ connectionMessage }}</span>
        </div>
      </header>

      <section class="overview-band">
        <div class="overview-copy">
          <p class="eyebrow">当前选中</p>
          <h2>{{ activeArea.name }}</h2>
          <p>{{ activeArea.summary }}</p>
        </div>
        <div class="focus-metric" :style="{ borderColor: activeArea.accent }">
          <span>{{ activeArea.metricLabel }}</span>
          <strong>{{ activeArea.metric }}</strong>
        </div>
      </section>

      <section class="stat-grid" aria-label="运营概览">
        <article v-for="stat in operationStats" :key="stat.label" class="stat-card">
          <span>{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
          <small>{{ stat.trend }}</small>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel area-panel">
          <div class="field-preview">
            <div class="field-preview-heading">
              <p class="eyebrow">界面显示项</p>
              <h3>{{ activeArea.name }}</h3>
            </div>
            <div class="field-grid">
              <label v-for="field in activeFields" :key="field.label" class="field-card">
                <span>{{ field.label }}</span>
                <strong>{{ field.value }}</strong>
              </label>
            </div>
          </div>
        </article>

        <article class="panel task-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">待办事项</p>
              <h2>{{ activeArea.name }}</h2>
            </div>
            <span>{{ activeArea.tasks.length }} 项</span>
          </div>

          <ul class="task-list">
            <li v-for="task in activeArea.tasks" :key="task">
              <span></span>
              <p>{{ task }}</p>
            </li>
          </ul>
        </article>
      </section>

      <section class="panel table-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">实时流转</p>
            <h2>今日重点事项</h2>
          </div>
          <span>跨部门协同</span>
        </div>

        <div class="work-table">
          <div class="table-row table-head">
            <span>类型</span>
            <span>事项</span>
            <span>所属中心</span>
            <span>级别</span>
            <span>状态</span>
          </div>
          <div v-for="order in workOrders" :key="order.title" class="table-row">
            <span>{{ order.type }}</span>
            <strong>{{ order.title }}</strong>
            <span>{{ order.owner }}</span>
            <span>{{ order.level }}</span>
            <span>{{ order.status }}</span>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>
