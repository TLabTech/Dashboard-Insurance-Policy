# 🧾 Policy Insurance Dashboard

A React-based web application for managing and processing policy insurance workflows efficiently.

---

## 📦 Tech Stack
- **React** (Vite or CRA-based frontend)
- **TypeScript** (if applicable)
- **Axios** for API calls
- **Tailwind CSS & Shadcn**
- **Docker** for production deployment

---

## 🚀 Getting Started (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/TLabTech/Dashboard-Insurance-Policy.git policy-insurance-dashboard
cd policy-insurance-dashboard
```

### 2. Install Dependencies
Pastikan Node.js (versi 20 atau lebih baru) dan npm/yarn/pnpm sudah terinstal.

```bash
# Menggunakan npm
npm install

# atau menggunakan yarn
yarn install
```

### 3. Konfigurasi Environment
Buat file `.env` di root project, contoh:
```bash
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Policy Insurance Dashboard
```

### 4. Jalankan Aplikasi
```bash
# npm
npm run dev

# atau yarn
yarn dev
```

Akses di browser:
```
http://localhost:5173
```

---

## 🧱 Build for Production

### 1. Build Static Files
```bash
# npm
npm run build

# atau yarn
yarn build
```

Hasil build akan berada di folder:
```
dist/
```

### 2. Preview (optional)
Untuk melihat hasil build sebelum di-deploy:
```bash
npm run preview
```

---

## 🐳 Running with Docker (Production)

### 1. Build Docker Image
Pastikan Docker sudah terinstal.

```bash
docker build -t policy-insurance-dashboard .
```

### 2. Jalankan Container
```bash
docker run -d \
  -p 8080:80 \
  --name policy-insurance-dashboard \
  policy-insurance-dashboard
```

Akses aplikasi di browser:
```
http://localhost:8080
```

### 3. Contoh Dockerfile
Jika belum ada `Dockerfile`, berikut contoh dasar untuk React (Vite):

```dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🐙 Docker Compose Setup

Untuk menjalankan bersama backend API (misalnya di port 3000), gunakan file `docker-compose.yml` berikut:

```yaml
version: '3.9'
services:
  frontend:
    container_name: policy-insurance-dashboard
    build: .
    ports:
      - "8080:80"
    environment:
      - VITE_API_URL=http://backend:3000
    depends_on:
      - backend

  backend:
    image: node:20-alpine
    working_dir: /app
    command: ["npm", "run", "start"]
    volumes:
      - ./backend:/app
    ports:
      - "3000:3000"
```

Jalankan dengan:
```bash
docker compose up -d --build
```

---

## 🧰 Additional Scripts

| Command | Deskripsi |
|----------|------------|
| `npm run lint` | Menjalankan ESLint untuk memastikan code style |
| `npm run build` | Build production-ready assets |
| `npm run preview` | Menjalankan server lokal untuk hasil build |
| `npm run dev` | Menjalankan aplikasi dalam mode pengembangan |

---

## 👥 Author
Developed by **PT Teknologi Kode Indonesia (TLab)**  
Section: *Web Development — Fullstack & Frontend*

---

## 📝 License
This project is **proprietary** and internal to **PT Teknologi Kode Indonesia (TLab)**.  
Unauthorized distribution is strictly prohibited.
