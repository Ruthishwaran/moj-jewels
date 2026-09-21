# 💎 MOJ Jewels - Royal E-Commerce & Luxury Storefront

A high-end, responsive luxury E-commerce application for **MOJ Jewels**, built with React 18, Vite, and Tailwind CSS.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Interactive Offer Banners & Coupons**: Hero carousel with 1-click coupon code copy (`ROYAL10`, `MOJGLAM20`, `FIRSTJEWEL`).
- **Luxury Jewelry Catalog**: Diamond Rings, Kundan Necklaces, Rose Gold Earrings, and White Gold Tennis Bracelets with search, category filtering & price sorting.
- **Wishlist & Cart Drawers**: Save favorite jewels or add to cart with real-time tax and coupon calculation.
- **Manual UPI QR Payment**:
  1. Customer scans store's UPI QR Code (GPay / PhonePe / Paytm / BHIM) or copies UPI ID (`mojjewels@hdfcbank`).
  2. Customer enters their 12-digit **UTR / Transaction Reference ID**.
  3. Order is submitted with status `Pending Verification`.
- **Live Order Tracking**: Search Order ID (e.g. `MOJ-98421`) to track milestone progress (`Placed` ➔ `Confirmed` ➔ `Packing` ➔ `Shipped` ➔ `Delivered`).
- **100% Free App Installation (PWA)**: Built-in Service Worker & Web App Manifest. Customers can install MOJ Jewels on Mobile (Android/iOS) or Desktop with 1-click!

---

### 👑 Admin Management Portal
- **Manual Payment Verification Desk**: Inspect customer UTR numbers, view total order value, and click **Approve Payment** (automatically marks order as `Confirmed`) or **Reject Payment**.
- **Order Dispatch & Shipping**: Assign Courier Partner (e.g. `BlueDart Express`) and Tracking Numbers to update live customer tracking.
- **Product Inventory Manager**: Add new jewelry items, adjust stock levels, gold karat, prices, and images.
- **Coupons & Banner Manager**: Generate promo codes (percentage or flat discount, minimum order value, expiration).
- **Payment QR Settings**: Update store UPI ID, Bank Name, Account Number, IFSC Code, and custom QR code image.
- **Role Switcher**: Instant top menu toggle between **Customer View** and **Admin View** for easy demonstration.

---

## 🚀 How to Run Locally

1. Open terminal in the project directory:
   ```bash
   cd "d:/Ruthi/Project/MOJ Jewels"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`

---

## 🐙 Step-by-Step GitHub Setup

1. Initialize git repository in project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MOJ Jewels E-Commerce platform"
   ```

2. Create a new repository on GitHub named `moj-jewels`.

3. Link local repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/moj-jewels.git
   git branch -M main
   git push -u origin main
   ```

---

## ⚡ How to Deploy on Vercel (100% FREE)

1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New"** ➔ **"Project"**.
3. Import your `moj-jewels` repository.
4. Keep standard settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will automatically build and publish your live website URL (e.g., `https://moj-jewels.vercel.app`).

> Note: The included `vercel.json` ensures smooth single-page client-side routing on Vercel.

---

## 📱 Installing the PWA App (Free for Customers)

Customers visiting your website can click the **"Install App FREE"** button in the header bar or browser menu (*Add to Home Screen*) to install the MOJ Jewels web app directly to their home screen without paying any app store fees!
