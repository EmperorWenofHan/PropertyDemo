<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedCommunityId = ref('garden')
const selectedOwnerId = ref('owner-001')

const communities = [
  {
    id: 'garden',
    name: '星河花园小区',
    summary: '重点业主 12 位，本周待触达 28 次。',
    owners: [
      createOwner('owner-001', '王女士', ['1栋301'], '03-18', '2021-09-01', ['老人同住', '费用敏感'], '自住', '粤B·A28Q1', '微信优先，晚间勿扰', '生日关怀已完成'),
      createOwner('owner-002', '李先生', ['1栋302', '2栋1503'], '11-02', '2020-06-15', ['多房业主', '高频咨询'], '自住+出租', '粤B·6M9K2', '电话沟通，关注停车', '本月已触达 2 次'),
      createOwner('owner-003', '陈女士', ['2栋902'], '07-26', '2022-01-10', ['亲子家庭'], '自住', '无', '活动通知积极', '待确认周末活动意向'),
      createOwner('owner-004', '赵先生', ['1栋2303'], '12-08', '2019-12-01', ['长期欠费', '重点跟进'], '出租', '粤B·P77D3', '仅接受短信', '承诺本周五回复'),
    ],
  },
  {
    id: 'river',
    name: '滨河公馆小区',
    summary: '空置房较多，需强化触达记录。',
    owners: [
      createOwner('owner-101', '周女士', ['3栋302'], '05-09', '2023-03-20', ['新业主'], '自住', '粤B·R21M8', '微信沟通', '入住周年关怀待执行'),
      createOwner('owner-102', '林先生', ['3栋1604', '4栋801'], '09-14', '2018-08-05', ['多车位', '多房业主'], '空置', '粤B·T88L6', '偏好邮件账单', '上次触达未回复'),
      createOwner('owner-103', '何女士', ['4栋302'], '01-22', '2021-11-18', ['投诉关注'], '自住', '粤B·K30S2', '电话回访', '已完成噪音投诉回访'),
    ],
  },
  {
    id: 'sunny',
    name: '阳光里小区',
    summary: '社区活动活跃，家庭标签完整度较高。',
    owners: [
      createOwner('owner-201', '吴先生', ['5栋603'], '08-30', '2020-10-01', ['亲子家庭', '活动积极'], '自住', '粤B·C18F5', '活动推送', '亲子活动已报名'),
      createOwner('owner-202', '郑女士', ['6栋1003'], '04-11', '2022-05-12', ['独居老人'], '自住', '无', '电话优先', '本周需管家上门关怀'),
      createOwner('owner-203', '黄先生', ['5栋1904', '6栋1702'], '06-06', '2017-07-07', ['企业高管', '多房业主'], '出租', '粤B·H66N0', '短信即可', '租户资料待更新'),
    ],
  },
  {
    id: 'central',
    name: '中央公园小区',
    summary: '高净值业主多，服务偏好需要精细维护。',
    owners: [
      createOwner('owner-301', '许女士', ['8栋3202'], '02-17', '2019-04-22', ['高净值', '品质敏感'], '自住', '粤B·V88S8', '专属管家沟通', '已安排节日问候'),
      createOwner('owner-302', '马先生', ['8栋1501'], '10-19', '2021-02-28', ['装修中'], '空置', '粤B·M12Q9', '装修事项电话确认', '装修巡查需跟进'),
      createOwner('owner-303', '宋女士', ['9栋2601', '8栋2803'], '12-25', '2016-12-01', ['多房业主', '重点关系'], '自住+空置', '粤B·S90D1', '重要事项提前预约', '月度关系维护已完成'),
    ],
  },
]

function createOwner(id, name, homes, birthday, anniversary, tags, vacancy, vehicles, preference, touchRecord) {
  return {
    id,
    name,
    homes,
    fields: [
      { label: '生日', value: birthday },
      { label: '入住周年', value: anniversary },
      { label: '家庭标签', value: tags.join('、') },
      { label: '空置状态', value: vacancy },
      { label: '车辆', value: vehicles },
      { label: '服务偏好', value: preference },
      { label: '触达记录', value: touchRecord },
    ],
  }
}

const selectedCommunity = computed(
  () => communities.find((community) => community.id === selectedCommunityId.value) ?? communities[0],
)

const selectedOwner = computed(
  () => selectedCommunity.value.owners.find((owner) => owner.id === selectedOwnerId.value) ?? selectedCommunity.value.owners[0],
)

function selectCommunity(community) {
  selectedCommunityId.value = community.id
  selectedOwnerId.value = community.owners[0].id
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
  <main class="owner-page">
    <header class="fee-topbar">
      <RouterLink to="/" class="back-button">返回</RouterLink>
      <div>
        <p class="eyebrow">关系平台</p>
        <h1>业主关系档案与触达任务中心</h1>
      </div>
      <div class="connection-pill">
        <span class="status-dot" :class="connectionStatus"></span>
        <span>{{ connectionMessage }}</span>
      </div>
    </header>

    <section class="owner-layout">
      <aside class="fee-community-rail">
        <div class="dock-heading">
          <p class="eyebrow">项目小区</p>
          <h2>小区列表</h2>
        </div>

        <button
          v-for="community in communities"
          :key="community.id"
          type="button"
          class="community-button"
          :class="{ active: selectedCommunityId === community.id }"
          @click="selectCommunity(community)"
        >
          <strong>{{ community.name }}</strong>
          <span>{{ community.summary }}</span>
        </button>
      </aside>

      <section class="owner-workspace">
        <section class="owner-selector-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">业主选择</p>
              <h2>{{ selectedCommunity.name }}</h2>
            </div>
            <span>{{ selectedCommunity.owners.length }} 位</span>
          </div>

          <div class="owner-card-grid">
            <button
              v-for="owner in selectedCommunity.owners"
              :key="owner.id"
              type="button"
              class="owner-profile-card"
              :class="{ active: selectedOwnerId === owner.id }"
              @click="selectedOwnerId = owner.id"
            >
              <strong>{{ owner.name }}</strong>
              <small>{{ owner.homes.join('、') }}</small>
            </button>
          </div>
        </section>

        <section class="panel ledger-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">关系档案</p>
              <h2>{{ selectedOwner.name }}</h2>
            </div>
            <span>{{ selectedOwner.homes.length }} 户</span>
          </div>

          <div class="room-field-grid owner-field-grid">
            <article v-for="field in selectedOwner.fields" :key="field.label" class="room-field-card">
              <span>{{ field.label }}</span>
              <strong>{{ field.value }}</strong>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
