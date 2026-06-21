<script setup>
import { onMounted, ref } from 'vue'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')

const feeProgress = {
  rate: 87.3,
  received: '¥326.8万',
  receivable: '¥374.2万',
  arrears: '¥47.4万',
  promise: '¥18.6万',
}

const riskStats = [
  { level: 'L3', label: '重点跟进风险', count: 7, tone: 'warning' },
  { level: 'L4', label: '需老板关注风险', count: 2, tone: 'danger' },
]

const managerExecution = [
  { name: '东区项目', manager: '周经理', score: 94, focus: '回款承诺兑现' },
  { name: '北苑项目', manager: '林经理', score: 88, focus: 'L3 投诉压降' },
  { name: '滨河项目', manager: '陈经理', score: 82, focus: '重点业主拜访' },
]

const keyOwners = [
  { name: '1-1201 王女士', reason: '欠费争议', status: '承诺本周五处理' },
  { name: '3-0508 李先生', reason: '连续投诉', status: '项目经理已介入' },
  { name: '商铺 18 号', reason: '大额欠费', status: '财务准备证据' },
]

const businessSummary = [
  '本月收费进度较上月提升 8.6%，但商铺欠费仍集中在 3 个重点对象。',
  'L4 风险主要来自群体反馈和安全隐患，需在 48 小时内完成升级处置闭环。',
  '项目经理执行力整体稳定，低分项目集中在回访滞后和承诺兑现延迟。',
]

const platformEntries = [
  {
    name: '收费台账与回款流程中心',
    desc: '房号、面积、费率、应收、实收、欠费、预收冲抵、滞纳金、分摊、缴费凭证、争议记录。',
    icon: '收',
    accent: '#2f6f73',
  },
  {
    name: '业主诉求与工单流转中心',
    desc: '报修、咨询、投诉入口，工单编号、派单、状态、超时、图片和回访记录。',
    icon: '工',
    accent: '#4f6f52',
  },
  {
    name: '业主关系档案与触达任务中心',
    desc: '生日、入住周年、家庭标签、空置状态、车辆、服务偏好和触达记录。',
    icon: '档',
    accent: '#8a5a44',
  },
  {
    name: '事件留痕与升级处置中心',
    desc: '投诉事件、群体反馈、安全隐患、处置节点、责任人、升级记录和证据附件。',
    icon: '事',
    accent: '#5a648c',
  },
  {
    name: '服务标准与案例知识库',
    desc: '标准话术、服务 SOP、禁止承诺清单、典型案例、培训任务和考核记录。',
    icon: '知',
    accent: '#956f2f',
  },
  {
    name: '经营数据仓与报表中心',
    desc: '收费、工单、风险、关怀、培训数据汇总，周报月报模板和导出材料。',
    icon: '报',
    accent: '#6f4b7c',
  },
]

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
  <main class="boss-home">
    <section class="dashboard">
      <header class="topbar">
        <div>
          <p class="eyebrow">老板端引导页</p>
          <h1>智慧物业经营驾驶舱</h1>
        </div>
        <div class="connection-pill">
          <span class="status-dot" :class="connectionStatus"></span>
          <span>{{ connectionMessage }}</span>
        </div>
      </header>

      <section class="summary-hero">
        <div>
          <p class="eyebrow">物业费收缴进度</p>
          <h2>{{ feeProgress.rate }}%</h2>
          <p>本月已收 {{ feeProgress.received }}，应收 {{ feeProgress.receivable }}。</p>
        </div>
        <div class="progress-panel">
          <div class="progress-track" aria-label="物业费收缴进度">
            <span :style="{ width: `${feeProgress.rate}%` }"></span>
          </div>
          <div class="fee-grid">
            <span>欠费 <strong>{{ feeProgress.arrears }}</strong></span>
            <span>承诺回款 <strong>{{ feeProgress.promise }}</strong></span>
          </div>
        </div>
      </section>

      <section class="insight-grid">
        <article class="panel risk-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">L3 / L4 风险</p>
              <h2>风险升级看板</h2>
            </div>
            <span>今日更新</span>
          </div>
          <div class="risk-grid">
            <div v-for="risk in riskStats" :key="risk.level" class="risk-card" :class="risk.tone">
              <strong>{{ risk.count }}</strong>
              <span>{{ risk.level }}</span>
              <p>{{ risk.label }}</p>
            </div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">项目经理执行力</p>
              <h2>执行排名</h2>
            </div>
            <span>按闭环率</span>
          </div>
          <div class="manager-list">
            <div v-for="item in managerExecution" :key="item.name" class="manager-row">
              <div>
                <strong>{{ item.name }}</strong>
                <span>{{ item.manager }} · {{ item.focus }}</span>
              </div>
              <b>{{ item.score }}</b>
            </div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">重点业主</p>
              <h2>需关注对象</h2>
            </div>
            <span>{{ keyOwners.length }} 位</span>
          </div>
          <div class="owner-list">
            <div v-for="owner in keyOwners" :key="owner.name" class="owner-row">
              <strong>{{ owner.name }}</strong>
              <span>{{ owner.reason }}</span>
              <p>{{ owner.status }}</p>
            </div>
          </div>
        </article>

        <article class="panel business-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">经营摘要</p>
              <h2>老板今日重点</h2>
            </div>
            <span>自动汇总</span>
          </div>
          <ul class="summary-list">
            <li v-for="item in businessSummary" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>
    </section>

    <aside class="platform-dock">
      <div class="dock-heading">
        <p class="eyebrow">平台入口</p>
        <h2>六大平台</h2>
      </div>

      <div class="platform-list">
        <button v-for="platform in platformEntries" :key="platform.name" type="button" class="platform-card">
          <span class="platform-icon" :style="{ backgroundColor: platform.accent }">{{ platform.icon }}</span>
          <span>
            <strong>{{ platform.name }}</strong>
            <small>{{ platform.desc }}</small>
          </span>
        </button>
      </div>
    </aside>
  </main>
</template>
