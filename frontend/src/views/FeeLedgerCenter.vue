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
        rooms: createRooms('garden-1', 24, 4, '2.60 元/㎡', [302, 701, 1204, 1802, 2303]),
      },
      {
        id: 'garden-2',
        name: '2 栋',
        rooms: createRooms('garden-2', 24, 3, '2.50 元/㎡', [501, 902, 1503, 2101]),
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
        rooms: createRooms('river-3', 32, 4, '2.80 元/㎡', [302, 1001, 1604, 2402, 3103]),
      },
      {
        id: 'river-4',
        name: '4 栋',
        rooms: createRooms('river-4', 32, 3, '2.80 元/㎡', [801, 1402, 2203, 3001]),
      },
    ],
  },
  {
    id: 'sunny',
    name: '阳光里小区',
    summary: '本月收缴率 91.5%，整体回款较稳定。',
    buildings: [
      {
        id: 'sunny-5',
        name: '5 栋',
        rooms: createRooms('sunny-5', 24, 4, '2.40 元/㎡', [603, 1102, 1904]),
      },
      {
        id: 'sunny-6',
        name: '6 栋',
        rooms: createRooms('sunny-6', 18, 4, '2.40 元/㎡', [401, 1003, 1702]),
      },
    ],
  },
  {
    id: 'central',
    name: '中央公园小区',
    summary: '本月收缴率 82.6%，高层欠费户需要集中跟进。',
    buildings: [
      {
        id: 'central-8',
        name: '8 栋',
        rooms: createRooms('central-8', 32, 4, '3.10 元/㎡', [302, 902, 1501, 2104, 2803, 3202]),
      },
      {
        id: 'central-9',
        name: '9 栋',
        rooms: createRooms('central-9', 30, 3, '3.10 元/㎡', [701, 1202, 2003, 2601]),
      },
    ],
  },
]

function createRooms(prefix, floors, roomsPerFloor, rate, arrearsRooms) {
  const rooms = []

  for (let floor = 1; floor <= floors; floor += 1) {
    for (let unit = 1; unit <= roomsPerFloor; unit += 1) {
      const roomNo = `${floor}${String(unit).padStart(2, '0')}`
      const areaNumber = 78 + ((floor * 7 + unit * 11) % 54)
      const rateNumber = Number.parseFloat(rate)
      const receivable = (areaNumber * rateNumber).toFixed(2)
      const hasArrears = arrearsRooms.includes(Number(roomNo))
      const received = hasArrears ? (Number(receivable) * 0.35).toFixed(2) : receivable
      const arrears = hasArrears ? (Number(receivable) - Number(received)).toFixed(2) : '0.00'

      rooms.push(createRoom(`${prefix}-${roomNo}`, roomNo, `${areaNumber.toFixed(2)}㎡`, rate, receivable, received, arrears))
    }
  }

  return rooms
}

function createRoom(id, roomNo, area, rate, receivable, received, arrears) {
  const hasArrears = Number(arrears) > 0

  return {
    id,
    roomNo,
    hasArrears,
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
      { label: '争议记录', value: hasArrears ? '1 条' : '无' },
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
              :class="{ active: selectedRoomId === room.id, arrears: room.hasArrears, normal: !room.hasArrears }"
              @click="selectedRoomId = room.id"
            >
              <strong>{{ room.roomNo }}</strong>
              <span>{{ room.hasArrears ? '欠费' : '正常' }}</span>
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
