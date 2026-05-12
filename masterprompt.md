# 🛒 E-Commerce Website — Master Prompt Template
> Copy this entire template, fill in all the `[BRACKETS]`, and paste it to Claude to build your complete e-commerce website.

---

## ✏️ HOW TO USE THIS TEMPLATE
1. Replace every `[PLACEHOLDER]` with your actual business details.
2. Remove any section you don't need by deleting the whole block.
3. Paste the completed prompt into a new Claude chat.
4. Claude will build your full website as a single React or HTML artifact.

---

---
# ======= START OF PROMPT (Copy everything below this line) =======
---

Build me a complete, fully functional **multi-page e-commerce website** as a single React artifact with the following specifications. Use React state for navigation between pages (no external routing). The site should be visually polished, mobile-responsive, and production-ready.

---

## 🏢 BUSINESS INFORMATION

- **Business Name:** [K&Q Kamote chips]
- **Tagline / Slogan:** ["Fresh & Crunchy"]
- **Business Type:** [Online Food Shop]
- **Location / Area Served:** [Piape III, Hamtic, Antique]
- **Contact Number:** [9957995205]
- **Email Address:** [aizzyferil@gmail.com]
- **Facebook / Social Media:** [Aizzy Pearl Feril]
- **Business Hours:** [Monday–Friday, 8AM–5PM]
- **Currency:** [Philippine Peso (₱)]
- **Payment Methods Accepted:** [GCash, Cash on Delivery]
- **GCash / Maya Number (if any):** [09957995205 — Aizzy Pearl Feril]
- **Delivery / Shipping Policy:** [Cash on delivery within San Jose, Antique]

---

## 🎨 DESIGN PREFERENCES

- **Color Scheme:** [Warm browns gold and cream]
- **Overall Vibe / Aesthetic:** [modern homey and warm]
- **Logo or Icon (describe it):** [ A cute chibi kamote/sweet potato mascot icon]
- **Any fonts you like:** [Clean and modern]

---

## 📄 PAGE 1 — HOME PAGE

### Hero Section
- **Headline:** ["Crunchy Homemade Kamote chips, Perfect for Every Snack"]
- **Sub-headline:** ["Order your favorites flavors — BBQ chips, Spicy BBQ, Cheese, and Sourcream!"]
- **Call-to-Action Button Text:** ["Order Now"]

### About the Business Section
- **Story / Description:** [Welcome to K&Q kamote chips your go-to snack for sweetness, crunch, and comfort in every pack. We aim to bring happiness through every crunchy bite!"]
- **Why Choose Us (3–5 bullet points):**
  - [Made from fresh sweet potatoes]
  - [Crispy and delicious]
  - [Affordable price]
  - [perfect for pasalubong and snacks]
  - [Available for delivery and bulk orders]

---

## 📦 PAGE 2 — PRODUCTS & SERVICES PAGE

List all your products/services below. Follow this format for each item:

### Product/Service 1
- **Name:** [Kamote chips]
- **Category:** [Snacks]
- **Description:** [Crispy Homemade kamote chips-The perfect guilt-free snack. Packed with natural flavor, thinly sliced and fried to perfection!]
- **Price:** [₱35 per piece]
- **Available Variants (if any):** [BBQ, Spicy BBQ, Cheese and Sourcream]
- **Stock Status:** [Available / Pre-order]

> 🔁 **Repeat the block above for as many products/services as you have.**

---

## 🛍️ PAGE 3 — ORDERING PAGE (Checkout)

- **Order Form Fields to Include:**
  - [x] Customer Full Name
  - [x] Contact Number
  - [x] Email Address (optional)
  - [x] Delivery Address OR Pick-up
  - [x] Product Selection + Quantity
  - [x] Special Instructions / Notes
  - [x] Preferred Payment Method
  - [x] Preferred Delivery Date (optional)

- **Order Confirmation Message:** [e.g. "Thank you, [Name]! Your order has been received. We will contact you within 24 hours to confirm. For urgent orders, message us on Facebook or call [number]."]

- **After Order Submission — What should happen?**
  - [x] Show a confirmation screen with order summary
  - [x] Save order to the admin dashboard
  - [ ] (Optional) Send to a Google Form or external link: [paste URL if any]

---

## 🔐 PAGE 4 — ADMIN DASHBOARD (Password Protected)

- **Admin Password:** [admin2026]
- **Admin Page Title:** ["Aizzy Pearl Feril"]

### Orders Section (Auto-populated from customer orders)
The admin should see a table with all submitted orders showing:
  - [x] Order Number (auto-generated)
  - [x] Date & Time of Order
  - [x] Customer Name & Contact
  - [x] Items Ordered + Quantities
  - [x] Total Amount
  - [x] Payment Method
  - [x] Delivery Address
  - [x] Order Status (Pending / Confirmed / Preparing / Delivered / Cancelled)
  - [x] Admin can update order status via dropdown
  - [x] Admin can delete/remove orders

### Export / Download Orders
  - [x] Export orders as CSV file (downloadable spreadsheet)

### Business Analytics Dashboard
Show the following charts and stats based on order data:
  - [x] Total Revenue (all time + this month)
  - [x] Total Number of Orders
  - [x] Best-Selling Products (bar chart or ranked list)
  - [x] Orders by Status (pie chart — Pending / Confirmed / Delivered / Cancelled)
  - [x] Daily/Weekly Order Volume (line chart)
  - [x] Average Order Value
  - [x] Top Customers by order count (optional)

---

## ⚙️ TECHNICAL REQUIREMENTS

- **Framework:** React (single artifact, no external router)
- **Charts Library:** Use Recharts for analytics charts
- **Data Storage:** Use React state + localStorage so orders persist across page refreshes
- **Navigation:** Top navigation bar with links to all pages; mobile hamburger menu
- **Responsive:** Must work on mobile, tablet, and desktop
- **Admin Access:** Hidden or separate nav item labeled "Admin" that asks for a password
- **No backend needed** — all data stored in localStorage for now

---

## 📝 ADDITIONAL NOTES / SPECIAL REQUESTS

[Write anything else you want — e.g.:
- "Add a floating WhatsApp or Messenger button"
- "Include a photo gallery section on the Home page"
- "Add a promo banner at the top saying FREE DELIVERY this weekend"
- "Make the site bilingual — English and Filipino"
- "Add a FAQ section"
- "Add a minimum order requirement of ₱300"]

---
# ======= END OF PROMPT =======
---

---

## 📌 QUICK REFERENCE — WHAT EACH PAGE DOES

| Page | Purpose |
|---|---|
| **Home Page** | First impression — Hero, About, Why Us, Testimonials |
| **Products & Services** | Full catalog with descriptions, prices, variants |
| **Ordering / Checkout** | Customer fills order form; submits order |
| **Admin Dashboard** | View all orders, update status, download CSV, see analytics |

---

## 💡 TIPS FOR BEST RESULTS

- **The more detail you give, the better the output.** Don't leave brackets empty — fill in everything.
- **For products**, write clear, appetizing descriptions. Good descriptions = better-looking product cards.
- **For the color scheme**, you can say things like: "colors of a sunset", "tropical green and yellow", "earthy tones like coffee and cream".
- **Admin password** — change it to something only you know before using the site for real.
- **Want changes after?** Just tell Claude: *"Change the color to blue"* or *"Add a new product: Sapin-sapin, ₱200"* and it will update the artifact.
- **For a real website**, copy the final code and host it on Netlify, Vercel, or GitHub Pages for free.
- **GitHub repository:** https://github.com/Donhe-P/K-QKamoteChips.git

---


