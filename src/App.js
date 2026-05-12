import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './App.css';

const STORAGE_KEY = 'kq-kamote-orders';
const ADMIN_PASSWORD = 'admin2026';

const product = {
  name: 'Kamote Chips',
  category: 'Snacks',
  description:
    'Crispy homemade kamote chips, thinly sliced and fried until golden for a naturally sweet, crunchy snack.',
  price: 35,
  variants: [
    {
      name: 'BBQ',
      color: 'Gold / Yellow Pack',
      image: '/images/kamote-bbq.jpg',
      accent: '#d6a735',
    },
    {
      name: 'Spicy BBQ',
      color: 'Red Pack',
      image: '/images/kamote-spicy-bbq.jpg',
      accent: '#db342d',
    },
    {
      name: 'Cheese',
      color: 'Blue Pack',
      image: '/images/kamote-cheese.jpg',
      accent: '#27a9d8',
    },
    {
      name: 'Sourcream',
      color: 'Green Pack',
      image: '/images/kamote-sourcream.jpg',
      accent: '#70c927',
    },
  ],
  stock: 'Available / Pre-order',
};

const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'];
const statusColors = {
  Pending: '#d99b2b',
  Confirmed: '#467c59',
  Preparing: '#9b5c2e',
  Delivered: '#2e6e8f',
  Cancelled: '#a23e36',
};
const logoMoods = ['happy', 'wink', 'love', 'surprised', 'sleepy'];

const initialOrder = {
  name: '',
  contact: '',
  email: '',
  fulfillment: 'Delivery',
  address: '',
  variant: 'BBQ',
  quantity: 1,
  notes: '',
  payment: 'GCash',
  deliveryDate: '',
};

function money(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH')}`;
}

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function makeOrderNumber() {
  const stamp = new Date().toISOString().slice(2, 10).replaceAll('-', '');
  return `KQ-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function downloadCsv(orders) {
  const headers = [
    'Order Number',
    'Date',
    'Customer',
    'Contact',
    'Email',
    'Items',
    'Total',
    'Payment',
    'Fulfillment',
    'Address',
    'Status',
    'Notes',
  ];
  const rows = orders.map((order) => [
    order.orderNumber,
    order.createdAt,
    order.name,
    order.contact,
    order.email,
    `${order.quantity} x ${product.name} - ${order.variant}`,
    order.total,
    order.payment,
    order.fulfillment,
    order.address,
    order.status,
    order.notes,
  ]);
  const escape = (value) => `"${String(value || '').replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kq-kamote-orders.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [page, setPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState(loadOrders);
  const [orderForm, setOrderForm] = useState(initialOrder);
  const [confirmation, setConfirmation] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [logoMoodIndex, setLogoMoodIndex] = useState(0);
  const [selectedFlavor, setSelectedFlavor] = useState(initialOrder.variant);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const analytics = useMemo(() => {
    const activeOrders = orders.filter((order) => order.status !== 'Cancelled');
    const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
    const now = new Date();
    const monthRevenue = activeOrders
      .filter((order) => {
        const date = new Date(order.createdAt);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, order) => sum + order.total, 0);

    const bestSellers = product.variants.map((variant) => ({
      name: variant.name,
      accent: variant.accent,
      quantity: activeOrders
        .filter((order) => order.variant === variant.name)
        .reduce((sum, order) => sum + Number(order.quantity), 0),
    }));

    const statusData = statusOptions.map((status) => ({
      name: status,
      value: orders.filter((order) => order.status === status).length,
    }));

    const dailyMap = activeOrders.reduce((map, order) => {
      const day = new Date(order.createdAt).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
      });
      map[day] = (map[day] || 0) + 1;
      return map;
    }, {});

    const dailyVolume = Object.entries(dailyMap).map(([day, count]) => ({ day, count }));

    const customerMap = activeOrders.reduce((map, order) => {
      map[order.name] = (map[order.name] || 0) + 1;
      return map;
    }, {});
    const topCustomers = Object.entries(customerMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      revenue,
      monthRevenue,
      totalOrders: orders.length,
      averageOrder: activeOrders.length ? revenue / activeOrders.length : 0,
      bestSellers,
      statusData,
      dailyVolume,
      topCustomers,
    };
  }, [orders]);

  const navigate = (nextPage) => {
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pokeLogo = () => {
    setLogoMoodIndex((current) => (current + 1) % logoMoods.length);
  };

  const viewProductsForFlavor = (flavor) => {
    setSelectedFlavor(flavor);
    setOrderForm((current) => ({ ...current, variant: flavor }));
    navigate('products');
  };

  const previewFlavor = (flavor) => {
    setSelectedFlavor(flavor);
    setOrderForm((current) => ({ ...current, variant: flavor }));
  };

  const orderFlavor = (flavor) => {
    setSelectedFlavor(flavor);
    setConfirmation(null);
    setOrderForm((current) => ({ ...current, variant: flavor }));
    navigate('order');
  };

  const updateOrderForm = (event) => {
    const { name, value } = event.target;
    setOrderForm((current) => ({
      ...current,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : value,
    }));
  };

  const submitOrder = (event) => {
    event.preventDefault();
    const total = product.price * Number(orderForm.quantity);
    const order = {
      ...orderForm,
      quantity: Number(orderForm.quantity),
      total,
      status: 'Pending',
      orderNumber: makeOrderNumber(),
      createdAt: new Date().toISOString(),
    };
    setOrders((current) => [order, ...current]);
    setConfirmation(order);
    setOrderForm(initialOrder);
  };

  const loginAdmin = (event) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setPassword('');
      setPasswordError('');
      return;
    }
    setPasswordError('Incorrect password. Please try again.');
  };

  const updateStatus = (orderNumber, status) => {
    setOrders((current) =>
      current.map((order) => (order.orderNumber === orderNumber ? { ...order, status } : order))
    );
  };

  const deleteOrder = (orderNumber) => {
    setOrders((current) => current.filter((order) => order.orderNumber !== orderNumber));
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <button
            className={`brand-mark ${logoMoods[logoMoodIndex]}`}
            type="button"
            onClick={pokeLogo}
            aria-label="Poke the cute kamote logo"
            title="Poke me"
          >
            <span className="brand-potato">
              <span className="brand-eye left" />
              <span className="brand-eye right" />
              <span className="brand-smile" />
              <span className="brand-cheek left" />
              <span className="brand-cheek right" />
              <span className="brand-leaf" />
            </span>
          </button>
          <button className="brand-name" type="button" onClick={() => navigate('home')} aria-label="Go home">
            <strong>K&amp;Q Kamote Chips</strong>
            <small>Fresh &amp; Crunchy</small>
          </button>
        </div>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {[
            ['home', 'Home'],
            ['products', 'Products'],
            ['order', 'Order'],
            ['admin', 'Admin'],
          ].map(([key, label]) => (
            <button
              className={page === key ? 'active' : ''}
              key={key}
              type="button"
              onClick={() => navigate(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {page === 'home' && (
          <HomePage
            logoMood={logoMoods[logoMoodIndex]}
            onOrder={() => navigate('order')}
            onPokeLogo={pokeLogo}
            onProducts={viewProductsForFlavor}
          />
        )}
        {page === 'products' && (
          <ProductsPage
            onOrder={() => orderFlavor(selectedFlavor)}
            onPreviewFlavor={previewFlavor}
            onSelectFlavor={orderFlavor}
            selectedFlavor={selectedFlavor}
          />
        )}
        {page === 'order' && (
          <OrderPage
            confirmation={confirmation}
            form={orderForm}
            onChange={updateOrderForm}
            onSubmit={submitOrder}
            onNewOrder={() => setConfirmation(null)}
          />
        )}
        {page === 'admin' && (
          <AdminPage
            adminUnlocked={adminUnlocked}
            analytics={analytics}
            deleteOrder={deleteOrder}
            downloadCsv={() => downloadCsv(orders)}
            loginAdmin={loginAdmin}
            orders={orders}
            password={password}
            passwordError={passwordError}
            setPassword={setPassword}
            updateStatus={updateStatus}
          />
        )}
      </main>

      <a className="floating-contact" href="tel:09957995205" aria-label="Call K and Q Kamote Chips">
        Call
      </a>
    </div>
  );
}

function HomePage({ logoMood, onOrder, onPokeLogo, onProducts }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Online food shop in Piape III, Hamtic, Antique</p>
          <h1>Crunchy Homemade Kamote chips, Perfect for every snack time!</h1>
          <p>
            Order your favorite flavors: BBQ, Spicy BBQ, Cheese, and Sourcream. Made fresh for
            everyday snacks, pasalubong, and bulk orders.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={onOrder}>
              Order Now
            </button>
            <a className="secondary-btn" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              Message on Facebook
            </a>
          </div>
          <div className="hero-stats" aria-label="K and Q highlights">
            <span>
              <strong>PHP 35</strong>
              per pack
            </span>
            <span>
              <strong>4</strong>
              flavors
            </span>
            <span>
              <strong>COD</strong>
              Piape III
            </span>
          </div>
        </div>
        <div className="hero-visual mascot-hero" aria-label="Cute K and Q kamote mascot logo">
          <div className="animated-chips" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="royal-potatoes">
            <button
              className={`cute-potato-logo king ${logoMood}`}
              type="button"
              onClick={onPokeLogo}
              aria-label="Poke the king kamote mascot"
              title="Poke me"
            >
              <CrownIcon />
              <span className="potato-shine" />
              <span className="potato-eye left" />
              <span className="potato-eye right" />
              <span className="potato-cheek left" />
              <span className="potato-cheek right" />
              <span className="potato-smile" />
              <span className="potato-sprout" />
            </button>
            <button
              className={`cute-potato-logo queen ${logoMood}`}
              type="button"
              onClick={onPokeLogo}
              aria-label="Poke the queen kamote mascot"
              title="Poke me"
            >
              <CrownIcon />
              <span className="potato-shine" />
              <span className="potato-eye left" />
              <span className="potato-eye right" />
              <span className="potato-cheek left" />
              <span className="potato-cheek right" />
              <span className="potato-smile" />
              <span className="potato-sprout" />
            </button>
          </div>
          <div className="logo-caption">
            <strong>K&amp;Q</strong>
            <span>Fresh &amp; Crunchy</span>
          </div>
        </div>
      </section>

      <section className="promo-band">
        <strong>Cash on delivery within Piape III, Hamtic, Antique</strong>
        <span>Business hours: Monday-Friday, 8AM-5PM</span>
      </section>

      <section className="flavor-showcase">
        <div>
          <p className="eyebrow">Flavor Guide</p>
          <h2>Pick your pack by color.</h2>
        </div>
        <div className="home-flavor-row">
          {product.variants.map((variant) => (
            <button
              className="home-flavor"
              key={variant.name}
              onClick={() => onProducts(variant.name)}
              style={{ '--accent': variant.accent }}
              type="button"
            >
              <span />
              <strong>{variant.name}</strong>
              <small>{variant.color}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="section-grid">
        <div>
          <p className="eyebrow">About</p>
          <h2>Sweetness, crunch, and comfort in every pack.</h2>
          <p>
            Welcome to K&amp;Q Kamote Chips, your go-to snack for homemade crunch and simple
            happiness. Every pack is made to bring a crispy, comforting bite to your day.
          </p>
        </div>
        <div className="reasons">
          {[
            'Made from fresh sweet potatoes',
            'Crispy and delicious',
            'Affordable price',
            'Perfect for pasalubong and snacks',
            'Available for delivery and bulk orders',
          ].map((reason) => (
            <div className="reason" key={reason}>
              <span />
              {reason}
            </div>
          ))}
        </div>
      </section>

      <section className="home-process">
        {[
          ['Choose', 'Select BBQ, Spicy BBQ, Cheese, or Sourcream.'],
          ['Order', 'Send your contact details and delivery notes.'],
          ['Enjoy', 'Receive fresh, crispy kamote chips at your door.'],
        ].map(([title, text]) => (
          <article key={title}>
            <span>{title.slice(0, 1)}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="testimonial-band">
        <div>
          <h2>Homey flavor, modern ordering.</h2>
          <p>
            Choose a flavor, send your delivery details, and K&amp;Q will contact you to confirm
            your fresh batch.
          </p>
        </div>
        <button className="primary-btn" type="button" onClick={onOrder}>
          Start an Order
        </button>
      </section>
    </>
  );
}

function ProductsPage({ onOrder, onPreviewFlavor, onSelectFlavor, selectedFlavor }) {
  const selectedIndex = Math.max(
    0,
    product.variants.findIndex((variant) => variant.name === selectedFlavor)
  );
  const selectedVariant = product.variants[selectedIndex];
  const moveFlavor = (direction) => {
    const nextIndex = (selectedIndex + direction + product.variants.length) % product.variants.length;
    onPreviewFlavor(product.variants[nextIndex].name);
  };

  return (
    <section className="page-section">
      <p className="eyebrow">Products</p>
      <h1>Fresh kamote chips for snacks, sharing, and pasalubong.</h1>
      <div className="product-layout">
        <article className="product-card">
          <div className="product-image" style={{ '--accent': selectedVariant.accent }}>
            <button
              className="slider-btn previous"
              type="button"
              onClick={() => moveFlavor(-1)}
              aria-label="Previous flavor"
            >
              &lt;
            </button>
            <img src={selectedVariant.image} alt={`${selectedVariant.name} K&Q Kamote Chips pack`} />
            <button
              className="slider-btn next"
              type="button"
              onClick={() => moveFlavor(1)}
              aria-label="Next flavor"
            >
              &gt;
            </button>
            <div className="product-image-label">
              <strong>{selectedVariant.name}</strong>
              <span>{selectedVariant.color}</span>
            </div>
            <div className="product-image-dots" aria-label="Flavor photo slider">
              {product.variants.map((variant) => (
                <button
                  className={selectedFlavor === variant.name ? 'selected' : ''}
                  key={variant.name}
                  onClick={() => onPreviewFlavor(variant.name)}
                  style={{ '--accent': variant.accent }}
                  type="button"
                  aria-label={`Show ${variant.name} pack`}
                />
              ))}
            </div>
          </div>
          <div className="product-body">
            <div className="product-title">
              <div>
                <p>{product.category}</p>
                <h2>{product.name}</h2>
              </div>
              <strong>{money(product.price)}</strong>
            </div>
            <p>{product.description}</p>
            <div className="variant-list">
              {product.variants.map((variant) => (
                <button
                  className={selectedFlavor === variant.name ? 'selected' : ''}
                  key={variant.name}
                  onClick={() => onPreviewFlavor(variant.name)}
                  style={{ '--accent': variant.accent }}
                  type="button"
                >
                  {variant.name}
                </button>
              ))}
            </div>
            <p className="stock">{product.stock}</p>
            <button className="primary-btn" type="button" onClick={onOrder}>
              Order This
            </button>
          </div>
        </article>
        <aside className="info-panel">
          <h2>Ordering Details</h2>
          <p>Payment accepted through GCash or Cash on Delivery.</p>
          <p>GCash: 09957995205 - Aizzy Pearl Feril</p>
          <p>Delivery: Cash on delivery within Piape III, Hamtic, Antique.</p>
        </aside>
      </div>
      <div className="flavor-grid" aria-label="Kamote chips flavor photos">
        {product.variants.map((variant) => (
          <button
            className={selectedFlavor === variant.name ? 'flavor-card selected' : 'flavor-card'}
            key={variant.name}
            onClick={() => onSelectFlavor(variant.name)}
            style={{ '--accent': variant.accent }}
            type="button"
          >
            <img src={variant.image} alt={`${variant.name} K&Q Kamote Chips pack`} />
            <div>
              <span>{variant.color}</span>
              <h2>{variant.name}</h2>
              <p>{money(product.price)} per pack</p>
              <strong>Choose this flavor</strong>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function CrownIcon() {
  return (
    <svg className="potato-crown" viewBox="0 0 120 92" aria-hidden="true" focusable="false">
      <circle cx="20" cy="24" r="7" />
      <circle cx="60" cy="9" r="7" />
      <circle cx="100" cy="24" r="7" />
      <path d="M22 38 C37 55 50 58 60 28 C70 58 83 55 98 38 C90 52 86 65 84 76 C68 70 52 70 36 76 C34 64 30 51 22 38 Z" />
      <path d="M36 80 C50 76 73 76 88 80" />
      <path d="M32 84 C43 90 77 90 92 84 C78 79 45 79 32 84 Z" />
    </svg>
  );
}

function OrderPage({ confirmation, form, onChange, onNewOrder, onSubmit }) {
  if (confirmation) {
    return (
      <section className="page-section narrow">
        <div className="confirmation">
          <p className="eyebrow">Order received</p>
          <h1>Thank you, {confirmation.name}!</h1>
          <p>
            Your order has been received. We will contact you within 24 hours to confirm. For urgent
            orders, message us on Facebook or call 09957995205.
          </p>
          <div className="summary-list">
            <span>Order Number</span>
            <strong>{confirmation.orderNumber}</strong>
            <span>Items</span>
            <strong>
              {confirmation.quantity} x {product.name} - {confirmation.variant}
            </strong>
            <span>Total</span>
            <strong>{money(confirmation.total)}</strong>
            <span>Payment</span>
            <strong>{confirmation.payment}</strong>
            <span>Address</span>
            <strong>{confirmation.address || confirmation.fulfillment}</strong>
          </div>
          <button className="primary-btn" type="button" onClick={onNewOrder}>
            Place Another Order
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section narrow">
      <p className="eyebrow">Checkout</p>
      <h1>Order K&amp;Q Kamote Chips</h1>
      <form className="order-form" onSubmit={onSubmit}>
        <label>
          Customer Full Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          Contact Number
          <input name="contact" value={form.contact} onChange={onChange} required />
        </label>
        <label>
          Email Address <span>optional</span>
          <input name="email" type="email" value={form.email} onChange={onChange} />
        </label>
        <label>
          Delivery or Pick-up
          <select name="fulfillment" value={form.fulfillment} onChange={onChange}>
            <option>Delivery</option>
            <option>Pick-up</option>
          </select>
        </label>
        <label className="wide">
          Delivery Address or Pick-up Notes
          <textarea name="address" value={form.address} onChange={onChange} required />
        </label>
        <label>
          Flavor
          <select name="variant" value={form.variant} onChange={onChange}>
            {product.variants.map((variant) => (
              <option key={variant.name}>{variant.name}</option>
            ))}
          </select>
        </label>
        <label>
          Quantity
          <input name="quantity" min="1" type="number" value={form.quantity} onChange={onChange} />
        </label>
        <label>
          Payment Method
          <select name="payment" value={form.payment} onChange={onChange}>
            <option>GCash</option>
            <option>Cash on Delivery</option>
          </select>
        </label>
        <label>
          Preferred Delivery Date <span>optional</span>
          <input name="deliveryDate" type="date" value={form.deliveryDate} onChange={onChange} />
        </label>
        <label className="wide">
          Special Instructions / Notes
          <textarea name="notes" value={form.notes} onChange={onChange} />
        </label>
        <div className="checkout-total">
          <span>Total</span>
          <strong>{money(product.price * Number(form.quantity || 1))}</strong>
        </div>
        <button className="primary-btn wide" type="submit">
          Submit Order
        </button>
      </form>
    </section>
  );
}

function AdminPage({
  adminUnlocked,
  analytics,
  deleteOrder,
  downloadCsv,
  loginAdmin,
  orders,
  password,
  passwordError,
  setPassword,
  updateStatus,
}) {
  if (!adminUnlocked) {
    return (
      <section className="page-section narrow">
        <div className="admin-login">
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Aizzy Pearl Feril</h1>
          <form onSubmit={loginAdmin}>
            <label>
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                required
              />
            </label>
            {passwordError && <p className="form-error">{passwordError}</p>}
            <button className="primary-btn" type="submit">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Aizzy Pearl Feril</h1>
        </div>
        <button className="secondary-btn" type="button" onClick={downloadCsv} disabled={!orders.length}>
          Export CSV
        </button>
      </div>

      <div className="stat-grid">
        <Stat label="Total Revenue" value={money(analytics.revenue)} />
        <Stat label="This Month" value={money(analytics.monthRevenue)} />
        <Stat label="Orders" value={analytics.totalOrders} />
        <Stat label="Average Order" value={money(analytics.averageOrder)} />
      </div>

      <div className="orders-panel sales-panel">
        <div className="orders-heading">
          <div>
            <h2>Customer Orders / Sales</h2>
            <p>All submitted customer orders appear here first.</p>
          </div>
          <strong>{orders.length} total</strong>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order.orderNumber}>
                    <td>{order.orderNumber}</td>
                    <td>{new Date(order.createdAt).toLocaleString('en-PH')}</td>
                    <td>
                      <strong>{order.name}</strong>
                      <span>{order.contact}</span>
                    </td>
                    <td>
                      {order.quantity} x {order.variant}
                    </td>
                    <td>{money(order.total)}</td>
                    <td>{order.payment}</td>
                    <td>{order.address}</td>
                    <td>
                      <select value={order.status} onChange={(event) => updateStatus(order.orderNumber, event.target.value)}>
                        {statusOptions.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button className="danger-btn" type="button" onClick={() => deleteOrder(order.orderNumber)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No customer orders yet. New checkout submissions will show here.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-grid">
        <ChartPanel title="Best-Selling Flavors">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={analytics.bestSellers}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                {analytics.bestSellers.map((entry) => (
                  <Cell key={entry.name} fill={entry.accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Orders by Status">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={analytics.statusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                {analytics.statusData.map((entry) => (
                  <Cell key={entry.name} fill={statusColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Daily Order Volume">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={analytics.dailyVolume}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line dataKey="count" stroke="#467c59" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Top Customers">
          <ol className="ranked-list">
            {analytics.topCustomers.length ? (
              analytics.topCustomers.map((customer) => (
                <li key={customer.name}>
                  <span>{customer.name}</span>
                  <strong>{customer.count} orders</strong>
                </li>
              ))
            ) : (
              <li>No customer orders yet</li>
            )}
          </ol>
        </ChartPanel>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ChartPanel({ children, title }) {
  return (
    <article className="chart-panel">
      <h2>{title}</h2>
      {children}
    </article>
  );
}

export default App;
