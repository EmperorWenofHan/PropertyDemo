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
    owners: createOwners('garden', ['1栋', '2栋'], 160),
  },
  {
    id: 'river',
    name: '滨河公馆小区',
    summary: '空置房较多，需强化触达记录。',
    owners: createOwners('river', ['3栋', '4栋'], 140),
  },
  {
    id: 'sunny',
    name: '阳光里小区',
    summary: '社区活动活跃，家庭标签完整度较高。',
    owners: createOwners('sunny', ['5栋', '6栋'], 120),
  },
  {
    id: 'central',
    name: '中央公园小区',
    summary: '高净值业主多，服务偏好需要精细维护。',
    owners: createOwners('central', ['8栋', '9栋'], 180),
  },
]

function createOwners(prefix, buildings, count) {
  const surnames = ['王', '李', '陈', '张', '周', '林', '何', '吴', '郑', '黄', '许', '马', '宋', '赵', '刘', '杨']
  const titles = ['先生', '女士']
  const tagGroups = [
    ['亲子家庭'],
    ['独居老人'],
    ['费用敏感'],
    ['高频咨询'],
    ['投诉关注'],
    ['活动积极'],
    ['高净值', '品质敏感'],
    ['装修中'],
  ]
  const vacancyOptions = ['自住', '出租', '空置', '自住+出租']
  const preferences = ['微信优先，晚间勿扰', '电话沟通，关注停车', '活动通知积极', '仅接受短信', '偏好邮件账单', '专属管家沟通']
  const touchRecords = ['生日关怀已完成', '本月已触达 2 次', '待确认周末活动意向', '承诺本周五回复', '上次触达未回复', '月度关系维护已完成']

  return Array.from({ length: count }, (_, index) => {
    const no = index + 1
    const surname = surnames[index % surnames.length]
    const title = titles[index % titles.length]
    const building = buildings[index % buildings.length]
    const floor = (index % 32) + 1
    const room = `${floor}${String((index % 4) + 1).padStart(2, '0')}`
    const homes = [`${building}${room}`]

    if (index % 17 === 0) {
      const secondBuilding = buildings[(index + 1) % buildings.length]
      const secondRoom = `${((index + 8) % 32) + 1}${String(((index + 2) % 4) + 1).padStart(2, '0')}`
      homes.push(`${secondBuilding}${secondRoom}`)
    }

    return createOwner(
      `${prefix}-owner-${String(no).padStart(3, '0')}`,
      `${surname}${title}`,
      homes,
      `${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
      `${2017 + (index % 7)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
      tagGroups[index % tagGroups.length],
      vacancyOptions[index % vacancyOptions.length],
      index % 9 === 0 ? '无' : `粤B·${String(index * 73).padStart(4, '0').slice(-4)}`,
      preferences[index % preferences.length],
      touchRecords[index % touchRecords.length],
    )
  })
}

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
