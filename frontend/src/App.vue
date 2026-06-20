<script setup>
import { computed, onMounted, ref } from 'vue'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedArea = ref('老板区')

const areas = [
  {
    name: '老板区',
    tag: '经营驾驶舱',
    icon: '董',
    accent: '#2f6f73',
    metric: '96.8%',
    metricLabel: '本月综合达成率',
    summary: '查看项目经营、满意度、收费率和风险事项，帮助老板快速判断整体运营健康度。',
    tasks: ['本月收入复盘', '重点项目风险跟进', '客户满意度分析'],
  },
  {
    name: '项目经理区',
    tag: '项目统筹',
    icon: '项',
    accent: '#4f6f52',
    metric: '18',
    metricLabel: '今日待协调事项',
    summary: '聚合项目进度、人力排班、服务质量和跨部门协同，适合项目负责人日常管理。',
    tasks: ['巡检计划确认', '部门晨会纪要', '供应商工单验收'],
  },
  {
    name: '客服工作台',
    tag: '业主服务',
    icon: '客',
    accent: '#8a5a44',
    metric: '42',
    metricLabel: '待处理诉求',
    summary: '集中处理报修、投诉、咨询、回访等客户触点，保障业主问题闭环。',
    tasks: ['新报事分派', '投诉回访', '公告发布审核'],
  },
  {
    name: '管家区',
    tag: '社区运营',
    icon: '管',
    accent: '#5a648c',
    metric: '126',
    metricLabel: '今日走访户数',
    summary: '面向楼栋管家，关注住户关系、房屋状态、空置房跟进和社区活动。',
    tasks: ['重点业主拜访', '空置房巡查', '活动报名统计'],
  },
  {
    name: '工程区',
    tag: '设备与维修',
    icon: '工',
    accent: '#956f2f',
    metric: '9',
    metricLabel: '紧急维修工单',
    summary: '跟踪设施设备、维修工单、巡检计划和能耗异常，保障园区安全运行。',
    tasks: ['电梯巡检', '水泵房点检', '超时工单处理'],
  },
  {
    name: '财务收费台',
    tag: '收缴管理',
    icon: '财',
    accent: '#6f4b7c',
    metric: '87.3%',
    metricLabel: '物业费收缴率',
    summary: '管理物业费、停车费、保证金和欠费催缴，支持收费员快速查询与收款。',
    tasks: ['欠费名单跟进', '收款日报核对', '发票申请处理'],
  },
]

const operationStats = [
  { label: '在管项目', value: '12', trend: '+2 本季' },
  { label: '服务住户', value: '8,426', trend: '覆盖 36 栋' },
  { label: '今日工单', value: '214', trend: '已完成 168' },
  { label: '本月收费', value: '¥326.8万', trend: '较上月 +8.6%' },
]

const workOrders = [
  { type: '客服', title: '3 栋 1202 空调漏水报修', owner: '客服工作台', level: '紧急', status: '待分派' },
  { type: '工程', title: '地下车库 B 区照明异常', owner: '工程区', level: '高', status: '处理中' },
  { type: '管家', title: '新入住业主资料确认', owner: '管家区', level: '普通', status: '待回访' },
  { type: '财务', title: '商铺 18 号租户欠费提醒', owner: '财务收费台', level: '高', status: '待催缴' },
]

const activeArea = computed(() => areas.find((area) => area.name === selectedArea.value) ?? areas[0])

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
          <h1>六大业务工作区</h1>
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
          <div class="panel-heading">
            <div>
              <p class="eyebrow">部门入口</p>
              <h2>六大功能区</h2>
            </div>
            <span>点击左侧或卡片切换</span>
          </div>

          <div class="module-grid">
            <button
              v-for="area in areas"
              :key="area.name"
              type="button"
              class="module-card"
              :class="{ selected: selectedArea === area.name }"
              @click="selectedArea = area.name"
            >
              <span class="module-icon" :style="{ backgroundColor: area.accent }">{{ area.icon }}</span>
              <span>
                <strong>{{ area.name }}</strong>
                <small>{{ area.tag }}</small>
              </span>
              <b>{{ area.metric }}</b>
            </button>
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
            <h2>今日重点工单</h2>
          </div>
          <span>跨部门协同</span>
        </div>

        <div class="work-table">
          <div class="table-row table-head">
            <span>类型</span>
            <span>事项</span>
            <span>负责区域</span>
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
