<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const connectionMessage = ref('正在连接 Java 后端...')
const connectionStatus = ref('checking')
const selectedCommunityId = ref('garden')
const selectedBuildingId = ref('garden-1')
const selectedRoomId = ref('garden-1-301')

const communities = [
  {
    id: 'garden',
    name: '星河花园小区',
    summary: '本月收缴率 89.2%，重点跟进 18 户。',
    buildings: [
      {
        id: 'garden-1',
        name: '1 栋',
        rooms: [
          createRoom('garden-1-301', '301', '86.20㎡', '2.60 元/㎡', '224.12', '224.12', '0.00'),
          createRoom('garden-1-302', '302', '96.40㎡', '2.60 元/㎡', '250.64', '0.00', '250.64'),
          createRoom('garden-1-401', '401', '112.00㎡', '2.60 元/㎡', '291.20', '191.20', '100.00'),
          createRoom('garden-1-402', '402', '88.50㎡', '2.60 元/㎡', '230.10', '230.10', '0.00'),
        ],
      },
      {
        id: 'garden-2',
        name: '2 栋',
        rooms: [
          createRoom('garden-2-301', '301', '91.00㎡', '2.50 元/㎡', '227.50', '227.50', '0.00'),
          createRoom('garden-2-302', '302', '102.30㎡', '2.50 元/㎡', '255.75', '100.00', '155.75'),
          createRoom('garden-2-501', '501', '118.60㎡', '2.50 元/㎡', '296.50', '0.00', '296.50'),
        ],
      },
    ],
  },
  {
    id: 'river',
    name: '滨河公馆小区',
    summary: '本月收缴率 84.7%，商铺欠费占比较高。',
    buildings: [
      {
        id: 'river-3',
        name: '3 栋',
        rooms: [
          createRoom('river-3-301', '301', '79.80㎡', '2.80 元/㎡', '223.44', '223.44', '0.00'),
          createRoom('river-3-302', '302', '105.00㎡', '2.80 元/㎡', '294.00', '0.00', '294.00'),
          createRoom('river-3-601', '601', '128.00㎡', '2.80 元/㎡', '358.40', '258.40', '100.00'),
        ],
      },
      {
        id: 'river-4',
        name: '4 栋',
        rooms: [
          createRoom('river-4-301', '301', '83.60㎡', '2.80 元/㎡', '234.08', '234.08', '0.00'),
          createRoom('river-4-302', '302', '99.90㎡', '2.80 元/㎡', '279.72', '0.00', '279.72'),
        ],
      },
    ],
  },
]

function createRoom(id, roomNo, area, rate, receivable, received, arrears) {
  return {
    id,
    roomNo,
    fields: [
      { label: '房号', value: roomNo },
      { label: '面积', value: area },
      { label: '费率', value: rate },
      { label: '应收', value: receivable },
      { label: '实收', value: received },
      { label: '欠费', value: arrears },
      { label: '预收冲抵', value: arrears === '0.00' ? '0.00' : '100.00' },
      { label: '滞纳金', value: arrears === '0.00' ? '0.00' : '8.20' },
      { label: '分摊', value: '12.00' },
      { label: '缴费凭证', value: received === '0.00' ? '待上传' : '已归档' },
      { label: '争议记录', value: arrears === '0.00' ? '无' : '1 条' },
    ],
  }
}

const selectedCommunity = computed(
  () => communities.find((community) => community.id === selectedCommunityId.value) ?? communities[0],
)

const selectedBuilding = computed(
  () =>
    selectedCommunity.value.buildings.find((building) => building.id === selectedBuildingId.value) ??
    selectedCommunity.value.buildings[0],
)

const selectedRoom = computed(
  () => selectedBuilding.value.rooms.find((room) => room.id === selectedRoomId.value) ?? selectedBuilding.value.rooms[0],
)

function selectCommunity(community) {
  selectedCommunityId.value = community.id
  selectedBuildingId.value = community.buildings[0].id
  selectedRoomId.value = community.buildings[0].rooms[0].id
}

function selectBuilding(building) {
  selectedBuildingId.value = building.id
  selectedRoomId.value = building.rooms[0].id
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
  <main class="fee-page">
    <header class="fee-topbar">
      <RouterLink to="/" class="back-button">返回</RouterLink>
      <div>
        <p class="eyebrow">收费平台</p>
        <h1>收费台账与回款流程中心</h1>
      </div>
      <div class="connection-pill">
        <span class="status-dot" :class="connectionStatus"></span>
        <span>{{ connectionMessage }}</span>
      </div>
    </header>

    <section class="fee-layout">
      <aside class="fee-community-rail">
        <div class="dock-heading">
          <p class="eyebrow">项目小区</p>
          <h2>小区与楼栋</h2>
        </div>

        <section v-for="community in communities" :key="community.id" class="community-card">
          <button
            type="button"
            class="community-button"
            :class="{ active: selectedCommunityId === community.id }"
            @click="selectCommunity(community)"
          >
            <strong>{{ community.name }}</strong>
            <span>{{ community.summary }}</span>
          </button>

          <div v-if="selectedCommunityId === community.id" class="building-list">
            <button
              v-for="building in community.buildings"
              :key="building.id"
              type="button"
              class="building-button"
              :class="{ active: selectedBuildingId === building.id }"
              @click="selectBuilding(building)"
            >
              {{ building.name }}
            </button>
          </div>
        </section>
      </aside>

      <section class="fee-workspace">
        <section class="room-selector-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">房号选择</p>
              <h2>{{ selectedCommunity.name }} · {{ selectedBuilding.name }}</h2>
            </div>
            <span>{{ selectedBuilding.rooms.length }} 户</span>
          </div>

          <div class="room-grid">
            <button
              v-for="room in selectedBuilding.rooms"
              :key="room.id"
              type="button"
              class="room-card"
              :class="{ active: selectedRoomId === room.id }"
              @click="selectedRoomId = room.id"
            >
              {{ room.roomNo }}
            </button>
          </div>
        </section>

        <section class="panel ledger-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">收费属性</p>
              <h2>{{ selectedBuilding.name }} {{ selectedRoom.roomNo }} 室</h2>
            </div>
            <span>当前房屋</span>
          </div>

          <div class="room-field-grid">
            <article v-for="field in selectedRoom.fields" :key="field.label" class="room-field-card">
              <span>{{ field.label }}</span>
              <strong>{{ field.value }}</strong>
            </article>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
