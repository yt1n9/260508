import { useState, useMemo } from 'react'

// 菜單資料（放在元件外面，因為不會改變）
const MENU = [
  { id: 1, category: '麵飯', emoji: '🍜', name: '滷肉飯', price: 50  },
  { id: 2, category: '麵飯', emoji: '🍲', name: '牛肉麵', price: 130 },
  { id: 3, category: '小菜', emoji: '🥚', name: '滷蛋',   price: 20  },
  { id: 4, category: '小菜', emoji: '🥬', name: '燙青菜', price: 30  },
  { id: 5, category: '湯品', emoji: '🍥', name: '貢丸湯', price: 35  },
  { id: 6, category: '飲料', emoji: '🧋', name: '紅茶',   price: 25  },
]

export default function App() {
  // useState：定義狀態（相當於 Vue 的 ref）
  const [activeCategory, setActiveCategory] = useState('全部')
  const [cart, setCart] = useState([])  // [{ id, name, price, qty }]

  // useMemo：計算屬性（相當於 Vue 的 computed）
  const categories = useMemo(() =>
    ['全部', ...new Set(MENU.map(i => i.category))], []
  )

  const filteredMenu = useMemo(() =>
    activeCategory === '全部' ? MENU : MENU.filter(i => i.category === activeCategory),
    [activeCategory]
  )

  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  // 加入購物車
  function addToCart(item) {
    setCart(prev => {
      const found = prev.find(c => c.id === item.id)
      if (found) {
        // 已存在：更新數量（React 不能直接改 state，要回傳新陣列）
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  // 移除
  function removeFromCart(id) {
    setCart(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#c84b2f' }}>🍜 阿龍小吃店（React 版）</h1>

      {/* 分類 Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '5px 14px',
              borderRadius: 99,
              border: '1px solid #ccc',
              background: activeCategory === cat ? '#2a1f14' : 'white',
              color:      activeCategory === cat ? 'white'   : '#333',
              cursor: 'pointer'
            }}
          >{cat}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
        {/* 菜單 */}
        <div>
          {filteredMenu.map(item => (
            <div key={item.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: 12, marginBottom: 8,
              background: 'white', border: '1px solid #ddd', borderRadius: 8
            }}>
              <span>{item.emoji} {item.name}</span>
              <span style={{ color: '#c84b2f', fontWeight: 'bold' }}>${item.price}</span>
              <button
                onClick={() => addToCart(item)}
                style={{ padding: '5px 12px', background: '#c84b2f', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >加入</button>
            </div>
          ))}
        </div>

        {/* 購物車 */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 12, padding: 16, height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}>訂單明細</h3>
          {cart.length === 0
            ? <p style={{ color: '#aaa', textAlign: 'center' }}>尚未點餐</p>
            : <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0', borderBottom: '1px dashed #eee' }}>
                    <span>{item.name} ×{item.qty}</span>
                    <span>${item.price * item.qty}</span>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#c84b2f', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <div style={{ fontWeight: 'bold', fontSize: 18, color: '#c84b2f', margin: '12px 0' }}>
                  合計：${totalAmount}
                </div>
                <button
                  onClick={() => { alert('訂單送出！合計 $' + totalAmount); setCart([]) }}
                  style={{ width: '100%', padding: 10, background: '#2a1f14', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >送出訂單</button>
              </>
          }
        </div>
      </div>
    </div>
  )
}
