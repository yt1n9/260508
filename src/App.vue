<template>
  <div class="app">
    <!-- 標題 -->
    <header class="header">
      <h1>🍜 阿龍小吃店</h1>
      <span class="cart-icon" @click="showCart = !showCart">
        🛒 {{ totalQty }} 項
      </span>
    </header>

    <!-- 桌號輸入 -->
    <div class="table-input">
      <label>桌號：</label>
      <input v-model="tableNumber" placeholder="請輸入桌號，例：A3" />
    </div>

    <!-- 分類 Tabs -->
    <div class="tabs">
      <button
        v-for="cat in categories" :key="cat"
        :class="['tab', { active: activeCategory === cat }]"
        @click="activeCategory = cat"
      >{{ cat }}</button>
    </div>

    <!-- 菜單格 -->
    <div class="menu-grid">
      <div
        v-for="item in filteredMenu" :key="item.id"
        class="menu-card"
        :class="{ 'in-cart': getQty(item.id) > 0 }"
      >
        <span class="emoji">{{ item.emoji }}</span>
        <p class="name">{{ item.name }}</p>
        <p class="desc">{{ item.desc }}</p>
        <div class="card-footer">
          <span class="price">${{ item.price }}</span>
          <!-- 未加入：顯示加入按鈕 -->
          <button v-if="getQty(item.id) === 0" class="btn-add" @click="add(item)">+ 加入</button>
          <!-- 已加入：顯示數量控制 -->
          <div v-else class="qty-control">
            <button @click="minus(item.id)">－</button>
            <span>{{ getQty(item.id) }}</span>
            <button @click="add(item)">＋</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 購物車浮層 -->
    <div class="cart-panel" v-if="showCart && cart.length > 0">
      <h3>訂單明細</h3>
      <div v-for="item in cart" :key="item.id" class="cart-row">
        <span>{{ item.name }}</span>
        <span>×{{ item.qty }}</span>
        <span>${{ item.price * item.qty }}</span>
      </div>
      <div class="cart-note">
        <label>備註：</label>
        <input v-model="note" placeholder="例：不加辣、少油" />
      </div>
      <div class="cart-total">合計：${{ totalAmount }}</div>
      <button class="btn-order" @click="submit" :disabled="!tableNumber">送出訂單</button>
      <p v-if="!tableNumber" style="color:red;font-size:12px">請先填入桌號</p>
    </div>

    <!-- 送出成功畫面 -->
    <div class="success" v-if="orderDone">
      <div class="success-card">
        <div class="icon">🎉</div>
        <h2>訂單已送出！</h2>
        <p>桌號：{{ lastOrder.table }}</p>
        <ul>
          <li v-for="item in lastOrder.items" :key="item.id">
            {{ item.name }} × {{ item.qty }}　${{ item.price * item.qty }}
          </li>
        </ul>
        <p><strong>合計：${{ lastOrder.total }}</strong></p>
        <button @click="reset">繼續點餐</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 資料
const tableNumber  = ref('')
const note         = ref('')
const activeCategory = ref('全部')
const showCart     = ref(false)
const orderDone    = ref(false)
const lastOrder    = ref(null)
const cart         = ref([])

const menu = [
  { id: 1, category: '麵飯', emoji: '🍜', name: '滷肉飯', desc: '祖傳配方香滷豬肉',  price: 50  },
  { id: 2, category: '麵飯', emoji: '🍲', name: '牛肉麵', desc: '紅燒湯頭燉四小時',  price: 130 },
  { id: 3, category: '麵飯', emoji: '🥣', name: '排骨飯', desc: '酥炸排骨附泡菜',    price: 90  },
  { id: 4, category: '小菜', emoji: '🥚', name: '滷蛋',   desc: '入味滷蛋兩顆',      price: 20  },
  { id: 5, category: '小菜', emoji: '🥬', name: '燙青菜', desc: '當日市場新鮮時蔬',  price: 30  },
  { id: 6, category: '湯品', emoji: '🍥', name: '貢丸湯', desc: '手工貢丸Q彈有勁',   price: 35  },
  { id: 7, category: '飲料', emoji: '🧋', name: '紅茶',   desc: '自製冷泡大葉紅茶',  price: 25  },
]

// 計算屬性
const categories   = computed(() => ['全部', ...new Set(menu.map(i => i.category))])
const filteredMenu = computed(() =>
  activeCategory.value === '全部' ? menu : menu.filter(i => i.category === activeCategory.value)
)
const totalQty     = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const totalAmount  = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))

// 方法
function getQty(id) {
  return cart.value.find(i => i.id === id)?.qty ?? 0
}
function add(item) {
  const found = cart.value.find(i => i.id === item.id)
  if (found) found.qty++
  else cart.value.push({ ...item, qty: 1 })
  showCart.value = true
}
function minus(id) {
  const found = cart.value.find(i => i.id === id)
  if (!found) return
  found.qty--
  if (found.qty === 0) cart.value = cart.value.filter(i => i.id !== id)
}
function submit() {
  lastOrder.value = {
    table: tableNumber.value,
    items: [...cart.value],
    total: totalAmount.value,
    note:  note.value,
  }
  orderDone.value = true
  cart.value = []
  showCart.value = false
}
function reset() {
  orderDone.value  = false
  tableNumber.value = ''
  note.value = ''
}
</script>

<style scoped>
.app  { max-width: 900px; margin: 0 auto; padding: 1rem; font-family: sans-serif; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
h1 { color: #c84b2f; margin: 0; }
.cart-icon { cursor: pointer; font-size: 18px; background: #2a1f14; color: white; padding: 6px 14px; border-radius: 99px; }
.table-input { margin-bottom: 1rem; }
.table-input input { padding: 6px 10px; border: 1px solid #ccc; border-radius: 6px; width: 200px; }
.tabs { display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap; }
.tab { padding: 5px 14px; border: 1px solid #ccc; border-radius: 99px; background: white; cursor: pointer; }
.tab.active { background: #2a1f14; color: white; border-color: #2a1f14; }
.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.menu-card { background: white; border: 1px solid #ddd; border-radius: 12px; padding: 12px; }
.menu-card.in-cart { border-color: #c9962a; background: #fef9ec; }
.emoji { font-size: 28px; }
.name  { font-weight: bold; margin: 4px 0; }
.desc  { font-size: 12px; color: #888; margin-bottom: 8px; }
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.price { color: #c84b2f; font-weight: bold; }
.btn-add { padding: 4px 10px; background: #c84b2f; color: white; border: none; border-radius: 6px; cursor: pointer; }
.qty-control { display: flex; gap: 6px; align-items: center; }
.qty-control button { width: 24px; height: 24px; border-radius: 50%; background: #2a1f14; color: white; border: none; cursor: pointer; }
.cart-panel { position: fixed; right: 20px; bottom: 20px; width: 300px; background: white; border: 1px solid #ddd; border-radius: 12px; padding: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
.cart-row   { display: flex; justify-content: space-between; font-size: 14px; padding: 4px 0; }
.cart-note  { margin: 10px 0; }
.cart-note input { width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 6px; }
.cart-total { font-size: 18px; font-weight: bold; color: #c84b2f; margin: 8px 0; }
.btn-order  { width: 100%; padding: 10px; background: #2a1f14; color: white; border: none; border-radius: 6px; cursor: pointer; }
.btn-order:disabled { opacity: 0.4; cursor: not-allowed; }
.success    { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.success-card { background: white; border-radius: 16px; padding: 2rem; text-align: center; max-width: 360px; width: 90%; }
.icon { font-size: 48px; }
</style>
