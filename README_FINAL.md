# NUM Lost & Found — Final Fullstack Version

Энэ хувилбар нь хичээлийн лекц/лаб дээрх гол ойлголтуудыг ашигласан хамгаалалтын хувилбар юм. Кодыг хэт framework-heavy биш, оюутан өөрөө тайлбарлаж хамгаалж чадахуйц энгийн бүтэцтэй байлгасан.

## 1. Гол бүтэц

### Frontend
- Vanilla JavaScript SPA
- Hash routing: `#/`, `#/lost`, `#/found`, `#/details/:id`
- ES Modules, dynamic import
- DOM event listeners
- FormData, Regex validation
- Reusable card/filter/modal functions
- Web Component: `<num-status-badge>`
- React зөвхөн Admin dashboard-ийн жижиг statistics хэсэгт ашиглагдана

### React
- Source файл: `components/react/adminStatsWidget.js`
- React болон ReactDOM нь `index.html` дээр CDN script-ээр ачаалагдана.
- Ашигласан hooks: `useState`, `useEffect`, `useMemo`
- Үндсэн сайт React биш; зөвхөн Admin dashboard-ийн жижиг widget React ашиглана.
- `esbuild`, generated bundle, `npm run build` хэрэглэхгүй.

### Backend
- Node.js + Express
- REST API endpoints
- PostgreSQL database
- Session table + HttpOnly cookie
- Password hashing: Node `crypto.scryptSync`
- SQL injection хамгаалалт: parameterized query `$1, $2, ...`
- Backend validation
- Role/owner middleware
- Login/register rate limiting

## 2. Database tables

```text
users
items
claims
sessions
```

- `users`: хэрэглэгч, password hash, role
- `items`: Lost/Found report, Active/Resolved status
- `claims`: тухайн item дээр claim/request үүсгэх
- `sessions`: HttpOnly cookie session-ийн server-side хадгалалт

## 3. Анх ажиллуулах

```powershell
npm install
copy .env.example .env
```

`.env` дотор PostgreSQL connection string-ээ тохируулна.

```powershell
npm run db:setup
npm run db:seed
npm start
```

Browser:

```text
http://localhost:3000
```

## 4. Дараагийн удаа ажиллуулах

```powershell
npm start
```

Анхаарах: `npm run db:setup` хийх бүрд `users`, `items`, `claims`, `sessions` table reset болно.

## 5. Demo account

```text
Student: john.doe@stud.num.edu.mn / demo1234
Admin:   admin@num.edu.mn / admin1234
```

## 6. Сайжруулж цэвэрлэсэн зүйлс

- Frontend model дээр `status || reportType` fallback давхардал арилгасан.
- Backend API item response нэг хэлбэртэй болсон: `status`, `reportStatus`, `image`, `date`.
- React Admin widget-г CDN-based жижиг widget болгож, bundler/generated file-ийг хассан.
- Login/register route дээр rate limiter бодитоор холбосон.
- `initPageScripts()` бүх event listener-ийг page бүр дээр дуудахгүй, route бүрийн хэрэгтэй listener-ийг л дуудахаар болгосон.
- CSS-ийг 4 файл болгож цэгцэлсэн:
  - `css/base.css`
  - `css/layout.css`
  - `css/components.css`
  - `css/pages.css`

## 7. Search-ийн тайлбар

Одоогийн demo dataset жижиг тул backend search-д `ILIKE` ашигласан. Том production dataset дээр PostgreSQL full-text search (`tsvector`, `GIN index`) ашиглаж сайжруулж болно. Энэ хувилбарт хэт ахисан setup нэмэхгүй, хичээлийн project-д тайлбарлахад ойлгомжтой байдлаар үлдээсэн.

## 8. Хамгаалалт дээр хэлэх богино тайлбар

Үндсэн frontend нь Vanilla JavaScript SPA. Hash route ашиглаж page reload хийхгүйгээр `#app` дотор page-үүд солигддог. React-ийг бүх site дээр биш, зөвхөн Admin dashboard-ийн жижиг statistics widget дээр hooks ашиглах зорилгоор хэрэглэсэн. React болон ReactDOM-ийг CDN-ээр ачаалсан тул `esbuild` болон generated bundle хэрэггүй. Web Component ашиглаж Lost/Found badge-ийг `<num-status-badge>` custom tag болгосон. Backend нь Node.js + Express, database нь PostgreSQL. Authentication нь session table + HttpOnly cookie дээр ажилладаг. SQL injection-ээс хамгаалж parameterized query ашигласан, password plain text хадгалахгүй hash хэлбэрээр хадгалдаг.
