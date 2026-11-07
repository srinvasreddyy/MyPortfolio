# Project 1: OD_Backend (`srinvasreddyy/od_backend`) — Exhaustive Pin-Point Technical Specification

- **Repository / Archive Commit:** `238367d86d13ef0ba469a7994b876445169ca95c`
- **Project Name (`package.json`):** `orderdabba_backend` (`v1.0.0`)
- **Application Entrypoint:** `index.js`
- **Module System:** ES Modules (`"type": "module"`)
- **Core Domain:** Multi-tenant Food Delivery, Restaurant Onboarding, Dining Table Reservation (with concurrency locking), Dynamic Cart/Order Calculation, and Razorpay Webhook Reconciliation Platform ("OrderDabba").

---

## 1. Dependencies & Runtime Configuration (`package.json` & `.env.example`)

### 1.1 Production & Development Dependencies
- **Web Framework & Routing:** `express` (`^5.1.0`), `cors` (`^2.8.5`), `cookie-parser` (`^1.4.7`)
- **Database ODM:** `mongoose` (`^8.18.0`)
- **Authentication & Security:** `jsonwebtoken` (`^9.0.2`), `bcrypt` (`^6.0.0`), `passport` (`^0.7.0`), `passport-google-oauth20` (`^2.0.0`)
- **Payment Gateway:** `razorpay` (`^2.9.6`), Node native `crypto` (HMAC-SHA256 verification)
- **File Ingestion & Cloud Storage:** `multer` (`^2.0.2`), `cloudinary` (`^1.41.3`), `multer-storage-cloudinary` (`^4.0.0`)
- **Document & Email Generation:** `pdfkit` (`^0.17.2`), `nodemailer` (`^6.10.1`)
- **Logging & Scheduling:** `winston` (`^3.19.0`), `node-cron` (`^4.2.1`)
- **Utilities:** `dotenv` (`^17.2.1`), `axios` (`^1.13.4`), `validator` (`^13.15.15`)
- **Dev Tooling:** `nodemon` (`^3.1.10`) — scripts: `"start": "node index.js"`, `"dev": "nodemon index.js"`

### 1.2 Environment Variables (`.env.example` & `src/config/env.js`)
`src/config/env.js` validates that two mandatory secrets exist at startup (`MONGO_URL`, `JWT_SECRET`); if either is missing, it logs `FATAL ERROR` via `logger.error` and terminates the process with `process.exit(1)`.
- **Server & Database:** `PORT` (defaults to `5000`), `MONGO_URL`, `FRONTEND_URL` (`http://localhost:5173`), `BACKEND_URL` (`http://localhost:5000`), `NODE_ENV`
- **JWT & Auth:** `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **SMTP / Nodemailer:** `EMAIL_USER`, `EMAIL_PASS` (Gmail service)
- **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Razorpay:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- **Platform Feature Flags:** `ENABLE_TABLE_BOOKINGS` (`true`), `ENABLE_ANNOUNCEMENTS` (`true`), `ENABLE_PROMO_CODES` (`true`)
- **Super Admin Seed Script:** `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_PHONE`, `SUPER_ADMIN_NAME`

---

## 2. Application Bootstrap & Background Cron Jobs (`index.js`)

1. **Webhook Raw Body Interception:**
   - Before mounting `express.json()`, `index.js` explicitly mounts:
     `app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleRazorpayWebhook)`
   - This preserves the unparsed `Buffer` in `req.body` required for Razorpay HMAC-SHA256 signature verification.
2. **Global Middlewares:**
   - `express.json()`, `express.urlencoded({ extended: true })`, `cookieParser()`
   - `cors({ origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"], credentials: true })`
   - `passport.initialize()`
   - Request logger middleware that logs every incoming HTTP method and URL (`Incoming Request: ${req.method} ${req.url}`).
3. **Database Initialization:** Invokes `connectDb()` (`src/config/db.js`).
4. **Mounted Route Prefixes (17 Routers):**
   - `/api/auth` $\rightarrow$ `authRoutes.js`
   - `/api/owner/register` $\rightarrow$ `ownerRegistration.routes.js`
   - `/api/owner` $\rightarrow$ `owner.routes.js`
   - `/api/admin` $\rightarrow$ `admin.routes.js`
   - `/api/restaurants` $\rightarrow$ `restaurant.routes.js`
   - `/api/menu` $\rightarrow$ `menuItem.routes.js`
   - `/api/announcements` $\rightarrow$ `announcements.routes.js`
   - `/api/tables` $\rightarrow$ `table.routes.js`
   - `/api/bookings` $\rightarrow$ `booking.routes.js`
   - `/api/cart` $\rightarrow$ `cart.routes.js`
   - `/api/user` $\rightarrow$ `user.routes.js`
   - `/api/orders` $\rightarrow$ `order.routes.js`
   - `/api/payments` $\rightarrow$ `payment.routes.js`
   - `/api/delivery` $\rightarrow$ `delivery.routes.js`
   - `/api/promos` $\rightarrow$ `promo.routes.js`
   - `/api/config` $\rightarrow$ `config.routes.js`
   - `/api/location` $\rightarrow$ `location.routes.js`
5. **Automated Cron Job (`node-cron`):**
   - Runs every 5 minutes (`*/5 * * * *`).
   - Queries `Booking.updateMany` where `status === "Pending Payment"` and `lockExpiresAt < new Date()`, transitioning them to `status: "Payment Failed"` with `cancellationReason: "Payment timer expired"`.
6. **Global Error Handler:** Catches unhandled route/middleware errors (including Multer upload exceptions) and returns HTTP `500` with stack trace in `development` mode.

---

## 3. Configuration Layer (`src/config/`)

### 3.1 `src/config/cloudinary.js`
- Configures `cloudinary.v2` using `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- Instantiates `CloudinaryStorage` with folder `"orderdabba_restaurants"` and `allowed_formats: ["jpg", "png", "jpeg", "pdf"]`.

### 3.2 `src/config/db.js`
- Connects to MongoDB via `mongoose.connect(process.env.MONGO_URL)` with `logger.info` and `logger.error` reporting.

### 3.3 `src/config/featureFlags.js`
- Helper function `isEnabled(envVarValue, defaultValue = true)` parses boolean strings (`"true"` / `"false"`).
- Exports `featureFlags`:
  - `ENABLE_TABLE_BOOKINGS`: defaults to `true`
  - `ENABLE_ANNOUNCEMENTS`: defaults to `true`
  - `ENABLE_PROMO_CODES`: defaults to `true`
- Exports middleware factory `requireFeature(flagName)` which returns HTTP `403` (`"This feature (${flagName}) is currently disabled by the administrator."`) if the flag is false.

### 3.4 `src/config/passport-setup.js`
- Configures `GoogleStrategy` from `passport-google-oauth20` with callback URL `${BACKEND_URL}/api/auth/google/callback`.
- **Account Linking Logic:**
  1. Checks if a `User` exists with `googleId: profile.id`. If found, returns that user.
  2. Otherwise searches by email (`profile.emails[0].value`). If an existing email account is found, links `googleId = profile.id`, sets `isVerified = true`, saves, and returns the user.
  3. If no user exists, creates a new `User` with `fullName: profile.displayName`, `email`, `googleId: profile.id`, `isVerified: true`, and `role: "user"`.

---

## 4. Complete Data Models & Mongoose Schemas (`src/models/`)

### 4.1 `User.js` (`User` Model)
- **Identity & Auth Fields:**
  - `fullName` (`String`, required)
  - `email` (`String`, required, unique, lowercase, validated via `validator.isEmail`)
  - `phone` (`String`, unique, sparse, validated via `validator.isMobilePhone`)
  - `googleId` (`String`, unique, sparse)
  - `password` (`String`, optional for OAuth users, min length 6)
  - `otp` (`String`), `otpExpires` (`Date`), `isVerified` (`Boolean`, default `false`)
  - `role` (`String`, enum: `["user", "delivery_partner", "super_admin"]`, default `"user"`, required)
- **Embedded `addresses` Array (`addressSchema`):**
  - `addressLine` (`String`, required), `city` (`String`, required), `state` (`String`, required), `pincode` (`String`, required), `landmark` (`String`)
  - `addressType` (`String`, enum: `["Home", "Work", "Other"]`, default `"Home"`)
  - `coordinates`: `{ lat: Number, lon: Number }`
- **Embedded `cart` Object (`cartItemSchema`):**
  - `restaurantId` (`ObjectId` ref `Restaurant`, default `null`)
  - `items`: Array of `{ menuItemId (ObjectId ref MenuItem, required), name (String, required), price (Number, required), quantity (Number, required, min 1), isVeg (Boolean, default true) }`

### 4.2 `Restaurant.js` (`Restaurant` Model)
- **Core Fields:**
  - `restaurantName` (`String`, required, trim)
  - `ownerName` (`String`, required, trim)
  - `ownerPhone` (`String`, required, unique, trim)
  - `ownerEmail` (`String`, required, unique, lowercase, trim)
  - `password` (`String`, required when `status === "approved"`)
- **Embedded `address` Object:**
  - `street`, `city`, `state`, `pincode` (all required strings)
  - `coordinates`: GeoJSON Point `{ type: "Point", coordinates: [longitude, latitude] }`
- **References & Status:**
  - `documents`: `ObjectId` ref `RestaurantDocuments`
  - `timings`: `ObjectId` ref `RestaurantTimings`
  - `media`: `ObjectId` ref `RestaurantMedia`
  - `status`: `String`, enum: `["pending", "approved", "rejected"]`, default `"pending"`
  - `isActive`: `Boolean`, default `true`
  - `HandlingCharge`: `Number`, default `0`
- **Indexes:** `restaurantSchema.index({ "address.coordinates": "2dsphere" })` for geospatial proximity queries.

### 4.3 `RestaurantDocuments.js` (`RestaurantDocuments` Model)
- `restaurantId` (`ObjectId` ref `Restaurant`)
- `panNumber` (`String`, required, unique), `panPhotoUrl` (`String`, required)
- `fssaiLicenseNumber` (`String`, required, unique), `fssaiPhotoUrl` (`String`, required)
- `gstNumber` (`String`, unique, sparse), `gstPhotoUrl` (`String`)
- `bankAccountNumber` (`String`, required), `ifscCode` (`String`, required)

### 4.4 `RestaurantMedia.js` (`RestaurantMedia` Model)
- `restaurantId` (`ObjectId` ref `Restaurant`)
- `profileImageUrl` (`String`, required)
- `menuImagesUrl` (`[String]`, required)

### 4.5 `RestaurantTimings.js` (`RestaurantTimings` Model)
- `restaurantId` (`ObjectId` ref `Restaurant`)
- `deliveryTimings`: `{ openTime: String (required), closeTime: String (required) }`
- `dineInTimings`: `{ openTime: String, closeTime: String }`
- `openDays`: `[String]`, enum of days Monday–Sunday.

### 4.6 `Category.js` (`Category` Model)
- `name` (`String`, required, trim)
- `restaurantId` (`ObjectId` ref `Restaurant`, required)
- `isActive` (`Boolean`, default `true`)
- **Compound Index:** `{ name: 1, restaurantId: 1 }` (`unique: true`) ensuring category names are unique per restaurant.

### 4.7 `MenuItem.js` (`MenuItem` Model)
- `name` (`String`, required, trim), `description` (`String`, trim), `price` (`Number`, required, min 0), `imageUrl` (`String`)
- `isVeg` (`Boolean`, default `true`), `inStock` (`Boolean`, default `true`)
- `category` (`ObjectId` ref `Category`, required)
- `restaurantId` (`ObjectId` ref `Restaurant`, required)
- `preparationTime` (`Number`, default `15` minutes)
- `addons`: Array of `{ name: String, price: Number }`

### 4.8 `Announcements.js` (`Announcement` Model)
- `restaurantId` (`ObjectId` ref `Restaurant`, required)
- `announcementType` (`String`, enum: `["Discount", "Special Event", "New Menu", "General Info", "Combo Offer"]`, default `"General Info"`)
- `title` (`String`, required, maxLength 100), `content` (`String`, required, maxLength 500), `imageUrl` (`String`)
- `isActive` (`Boolean`, default `true`)
- **Embedded `discountDetails` Object:**
  - `code` (`String`, uppercase, trim)
  - `discountType` (`String`, enum: `["FLAT", "PERCENTAGE"]`)
  - `discountValue` (`Number`, min 0)
  - `minOrderValue` (`Number`, default `0`)
  - `maxDiscountAmount` (`Number`, default `null`)
  - `validUntil` (`Date`)

### 4.9 `Table.js` (`Table` Model)
- `restaurantId` (`ObjectId` ref `Restaurant`, required)
- `tableNumber` (`String`, required, trim)
- `capacity` (`Number`, required, min 1)
- `area` (`String`, enum: `["Main Dining", "Outdoor", "Rooftop", "Private Pod", "Bar"]`, default `"Main Dining"`)
- `isAvailable` (`Boolean`, default `true`)
- **Compound Index:** `{ restaurantId: 1, tableNumber: 1 }` (`unique: true`).

### 4.10 `SlotLock.js` (`SlotLock` Model — Concurrency Control)
- Prevents race-condition double bookings during checkout.
- `tableId` (`ObjectId` ref `Table`, required)
- `date` (`Date`, required — normalized to UTC midnight)
- `time` (`String`, required — e.g., `"19:00"`)
- `bookingId` (`ObjectId` ref `Booking`, required)
- `expiresAt` (`Date`, required)
- **Indexes:**
  - Unique compound index `{ tableId: 1, date: 1, time: 1 }` (`unique: true`) — guarantees MongoDB atomically rejects simultaneous reservations for the same table/date/time.
  - TTL index `{ expiresAt: 1 }` (`expireAfterSeconds: 0`) — MongoDB automatically purges expired locks once `expiresAt` passes (10-minute payment window) while sets `expiresAt: new Date("2099-01-01")` for confirmed bookings.

### 4.11 `Booking.js` (`Booking` Model)
- `restaurantId` (`ObjectId` ref `Restaurant`, required)
- `userId` (`ObjectId` ref `User`, required)
- `tableId` (`ObjectId` ref `Table`, required)
- `bookingDate` (`Date`, required), `timeSlot` (`String`, required), `guests` (`Number`, required, min 1)
- `status` (`String`, enum: `["Pending Payment", "Confirmed", "Rejected", "Cancelled", "Completed", "Payment Failed"]`, default `"Pending Payment"`)
- `specialRequests` (`String`, maxLength 250), `bookingFee` (`Number`, default `0`)
- `paymentStatus` (`String`, enum: `["Pending", "Paid", "Failed", "Refunded"]`, default `"Pending"`)
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` (`String`)
- `lockExpiresAt` (`Date`), `cancellationReason` (`String`)
- **Compound Index:** `{ tableId: 1, bookingDate: 1, timeSlot: 1 }`.

### 4.12 `Order.js` (`Order` Model)
- `userId` (`ObjectId` ref `User`, required), `restaurantId` (`ObjectId` ref `Restaurant`, required)
- `items`: Array of `{ menuItemId, name, price, quantity, isVeg }`
- `deliveryAddress`: `{ addressLine, city, state, pincode, landmark, addressType }`
- `billDetails`: `{ itemTotal (required), promoCode (default null), discountAmount (default 0), deliveryFee (default 0), handlingCharge (default 0), platformFee (default 0), taxesAndCharges (default 0), finalAmount (required) }`
- `paymentMethod` (`String`, enum: `["COD", "ONLINE"]`, required)
- `paymentStatus` (`String`, enum: `["Pending", "Paid", "Failed", "Refunded"]`, default `"Pending"`)
- `orderStatus` (`String`, enum: `["Pending Payment", "Placed", "Accepted", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled", "Payment Failed"]`, default `"Placed"`)
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` (`String`)
- `deliveryPartnerId` (`ObjectId` ref `User`, default `null`)
- `deliveryOtp` (`String`), `specialInstructions` (`String`, maxLength 250), `cancellationReason` (`String`)

---

## 5. Middleware Layer (`src/middleware/`)

1. **`multer.middleware.js`:**
   - Exports `upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })` (5 MB limit) backed by Cloudinary storage.
2. **`validateUser.js`:**
   - Reads JWT from `req.cookies.token` or `Authorization: Bearer <token>`.
   - Verifies with `JWT_SECRET`, fetches `User.findById(decoded.id).select("-password -otp -otpExpires")`, and attaches `req.user`.
3. **`validateRestaurant.js`:**
   - Reads JWT from `req.cookies.owner_token` or `Authorization: Bearer <token>`.
   - Verifies `decoded.role === "restaurant_owner"`.
   - Fetches `Restaurant.findById(decoded.id).select("-password")`, verifies `restaurant.status === "approved"`, and attaches `req.restaurant`.
4. **`validateDeliveryPartner.js`:**
   - Reads JWT from `req.cookies.token` or `Authorization: Bearer <token>`.
   - Fetches `User.findById(decoded.id)` and enforces `user.role === "delivery_partner"`. Attaches `req.deliveryPartner`.
5. **`validateSuperAdmin.js`:**
   - Reads JWT from `req.cookies.token` or `Authorization: Bearer <token>`.
   - Fetches `User.findById(decoded.id)` and enforces `user.role === "super_admin"`. Attaches `req.admin`.

---

## 6. Utilities & Helper Engines (`src/utils/` & `src/scripts/`)

### 6.1 `src/utils/orderCalculation.js` (Deterministic Pricing & Distance Engine)
- **`calculateOrderBill({ cartItems, restaurant, userCoordinates, promoCode })`:**
  1. Validates every cart item against live `MenuItem` documents in MongoDB (`inStock` check, restaurant ownership check, and live price lookup).
  2. Computes `itemTotal` = $\sum (\text{livePrice} \times \text{quantity})$.
  3. **Promo Validation:** If `promoCode` is supplied and `featureFlags.ENABLE_PROMO_CODES` is active, queries `Announcement` for matching `discountDetails.code`, checks `validUntil` and `minOrderValue`, and computes `discountAmount` (`FLAT` or `PERCENTAGE` capped at `maxDiscountAmount`), ensuring `discountAmount` never exceeds `itemTotal`.
  4. **Geospatial Delivery Fee Calculation:**
     - Extracts restaurant coordinates (`[lon, lat]`) and user coordinates (`{ lat, lon }`).
     - Calculates straight-line distance via `calculateDistance()` (Haversine formula).
     - Enforces maximum delivery radius of **20 km** (throws error `"Sorry, this restaurant does not deliver to your location (Distance: X km > 20 km limit)."` if exceeded).
     - **Tiered Delivery Fee:** Base fee of **Rs. 30** for the first **3 km**, plus **Rs. 10 per km** beyond 3 km:
       $$\text{deliveryFee} = \text{round}(30 + (\text{distanceInKm} - 3) \times 10)$$
     - Defaults to `40` if coordinates are missing.
  5. **Taxes & Charges:**
     - `handlingCharge = restaurant.HandlingCharge || 0`
     - `platformFee = 5.0` (flat Rs. 5)
     - `taxableAmount = Math.max(0, itemTotal - discountAmount)`
     - `taxesAndCharges = Math.round(taxableAmount * 0.05 * 100) / 100` (**5% GST**)
     - `finalAmount = Math.round(taxableAmount + deliveryFee + handlingCharge + platformFee + taxesAndCharges)`

### 6.2 `src/utils/locationUtils.js`
- **`getCoordinatesFromAddress(addressObj)`:** Queries OpenStreetMap Nominatim (`https://nominatim.openstreetmap.org/search`) with a 3-tier fallback:
  1. Full address (`street, city, state, pincode, India`)
  2. Pincode + Country (`pincode, India`)
  3. City + State (`city, state, India`)
- **`calculateDistance(lat1, lon1, lat2, lon2)`:** Implements the Haversine formula with Earth radius $R = 6371\text{ km}$:
  $$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right), \quad c = 2\operatorname{atan2}(\sqrt{a}, \sqrt{1-a}), \quad d = R \cdot c$$

### 6.3 `src/utils/InvoiceGenerator.js`
- Uses `PDFDocument` (`pdfkit`) to stream a formatted PDF tax invoice directly to the Express `res` object:
  - Header: `"ORDER DABBA - TAX INVOICE"`, Order ID, Date, Payment Method, Status.
  - Customer Name, Email, and Delivery Address block.
  - Restaurant Name and Address block.
  - Tabular line items (`Item`, `Qty`, `Price`, `Total`) with dynamic page-break handling (`y > 700`).
  - Summary breakdown: Item Total, Promo Discount, Delivery Fee, Handling Charge, Platform Fee, Taxes & Charges (5% GST), and Net Payable Total.

### 6.4 `src/utils/MailUtils.js`
- Uses `nodemailer` (Gmail SMTP) to send HTML emails:
  - `sendVerificationEmail(toEmail, otp)` — 10-minute verification OTP.
  - `sendApprovalEmail(toEmail, ownerName, restaurantName, tempPassword)` — sends generated 8-character hex password (`crypto.randomBytes(4).toString("hex")`) upon admin approval.
  - `sendRejectionEmail(toEmail, ownerName, restaurantName)` — notifies applicant of rejection.
  - `sendBookingConfirmationEmail(toEmail, userName, restaurantName, bookingDetails)` — confirms table reservation.
  - `sendBookingRejectionEmail(toEmail, userName, restaurantName, bookingDetails)` — notifies of cancelled/rejected booking.

### 6.5 `src/utils/JwtUtils.js`, `OtpUtils.js`, `orderUtils.js`, `paginationUtils.js`, `logger.js`
- `JwtUtils.js`: Signs JWTs (`expiresIn: "7d"`) and sets HTTP-only cookie `token` (`maxAge: 7 * 24 * 60 * 60 * 1000`, `sameSite: "strict"`).
- `OtpUtils.js` & `orderUtils.js`: Generates 6-digit OTPs (`100000` to `999999`) for email verification and doorstep delivery verification.
- `paginationUtils.js`: Computes `{ page, limit, skip }` (defaults: `page = 1`, `limit = 10`, max `limit = 100`) and formats `{ status: "success", results, pagination: { totalDocuments, totalPages, currentPage, limit, hasNextPage, hasPrevPage }, data }`.
- `logger.js`: Configures `winston` logger writing JSON logs to `logs/error.log` and `logs/combined.log`, plus colorized console output in non-production environments.

### 6.6 `src/scripts/createSuperAdmin.js`
- Standalone CLI seed script that connects to MongoDB, reads `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` from `.env`, hashes the password with `bcrypt.hash(password, 10)`, and creates or promotes the user to `role: "super_admin"`.

---

## 7. Controllers & Route Endpoints Specification (`src/controllers/` & `src/routes/`)

### 7.1 User & Delivery Authentication (`authController.js`, `googleAuthController.js`, `authRoutes.js`)
- `POST /api/auth/register` $\rightarrow$ `registerUser`: Validates email/phone/password, checks existing users, prevents duplicate verified accounts, hashes password (`bcrypt` salt 10), generates 6-digit OTP (valid 10 mins), saves `User`, and dispatches email via `sendVerificationEmail`.
- `POST /api/auth/verify-otp` $\rightarrow$ `verifyOtp`: Verifies `email` + `otp` before `otpExpires`, sets `isVerified = true`, clears OTP fields, and issues JWT cookie via `generateTokenAndSetCookie`.
- `POST /api/auth/login` $\rightarrow$ `loginUser`: Authenticates `email` + `password` via `bcrypt.compare`, checks `isVerified`, and issues JWT cookie.
- `POST /api/auth/logout` $\rightarrow$ `logoutUser`: Clears `token` cookie.
- `GET /api/auth/me` (`validateUser`) $\rightarrow$ `getMe`: Returns authenticated `req.user`.
- `GET /api/auth/google` & `GET /api/auth/google/callback` $\rightarrow$ `googleAuthCallback`: Generates JWT token, sets `token` cookie, and redirects to `${FRONTEND_URL}/oauth-success?token=${token}`.

### 7.2 Restaurant Onboarding & Owner Auth (`ownerRegistrationController.js`, `ownerAuthController.js`, `ownerController.js`)
- `POST /api/owner/register` (`upload.fields` for `panPhoto`, `fssaiPhoto`, `gstPhoto`, `profileImage`, `menuImages`) $\rightarrow$ `registerRestaurant`:
  - Parses JSON strings (`address`, `documents`, `timings`), geocodes restaurant address via `getCoordinatesFromAddress` (or uses explicit `lat`/`lng`), creates `Restaurant` (`status: "pending"`), creates linked `RestaurantDocuments`, `RestaurantTimings`, and `RestaurantMedia` records, and links their `ObjectId`s back to `Restaurant`. Rollback logic deletes the `Restaurant` record if sub-document creation fails.
- `POST /api/owner/login` $\rightarrow$ `loginOwner`: Verifies owner email, checks `status === "approved"`, compares hashed password, and sets HTTP-only cookie `owner_token`.
- `POST /api/owner/logout` $\rightarrow$ `logoutOwner`: Clears `owner_token`.
- `GET /api/owner/profile` (`validateRestaurant`) $\rightarrow$ `getOwnerProfile`: Populates `documents`, `timings`, and `media`.
- `PATCH /api/owner/status` (`validateRestaurant`) $\rightarrow$ `toggleRestaurantStatus`: Flips `restaurant.isActive` (open/closed toggle).
- `PUT /api/owner/profile` (`validateRestaurant`) $\rightarrow$ `updateRestaurantDetails`: Updates `HandlingCharge`, `deliveryTimings`, `dineInTimings`, and `openDays`.

### 7.3 Super Admin Governance (`adminController.js`, `admin.routes.js`)
- All routes protected by `validateSuperAdmin`:
  - `GET /api/admin/restaurants/pending` $\rightarrow$ `getPendingRestaurants` (paginated list with populated documents, timings, media).
  - `PATCH /api/admin/restaurants/:id/approve` $\rightarrow$ `approveRestaurant`: Generates random 8-char hex password (`crypto.randomBytes(4).toString("hex")`), hashes it with `bcrypt`, sets `status = "approved"`, and emails credentials via `sendApprovalEmail`.
  - `PATCH /api/admin/restaurants/:id/reject` $\rightarrow$ `rejectRestaurant`: Deletes associated Cloudinary images (`cloudinary.uploader.destroy`), removes `RestaurantDocuments`, `RestaurantTimings`, `RestaurantMedia`, and `Restaurant` records, and sends rejection email.
  - `GET /api/admin/users` $\rightarrow$ `getAllUsers` (paginated).
  - `POST /api/admin/delivery-partner` $\rightarrow$ `createDeliveryPartner`: Creates a pre-verified user with `role: "delivery_partner"`.

### 7.4 Public Restaurant Discovery (`restaurantController.js`, `restaurant.routes.js`)
- `GET /api/restaurants` $\rightarrow$ `getAllActiveRestaurants`:
  - Filters by `status: "approved"` and `isActive: true`.
  - Supports text search (`?search=`) matching either `restaurantName` regex OR restaurants selling a matching `MenuItem`.
  - Supports geospatial proximity filtering (`?lat=&lon=&radius=10`) using MongoDB `$near` on `address.coordinates` (`$maxDistance: radiusInKm * 1000`).
- `GET /api/restaurants/:id` $\rightarrow$ `getRestaurantMenu`: Fetches public restaurant profile, categories, in-stock menu items, and active announcements in parallel via `Promise.all`.

### 7.5 Menu & Category Management (`menuItemsController.js`, `menuItem.routes.js`)
- Protected by `validateRestaurant`:
  - `POST /api/menu/category` $\rightarrow$ `createCategory`
  - `GET /api/menu/category` $\rightarrow$ `getCategories`
  - `DELETE /api/menu/category/:id` $\rightarrow$ `deleteCategory`: Blocks deletion if any `MenuItem` references the category.
  - `POST /api/menu/item` (`upload.single("image")`) $\rightarrow$ `createMenuItem`
  - `GET /api/menu/item` $\rightarrow$ `getMyMenuItems` (paginated, filterable by `category` and `isVeg`).
  - `PATCH /api/menu/item/:id/stock` $\rightarrow$ `toggleItemStock`: Flips `item.inStock`.
  - `PUT /api/menu/item/:id` (`upload.single("image")`) $\rightarrow$ `updateMenuItem`: Deletes old Cloudinary image if replaced.
  - `DELETE /api/menu/item/:id` $\rightarrow$ `deleteMenuItem`: Deletes Cloudinary image asset and removes DB document.

### 7.6 Announcements & Promo Codes (`announcementsController.js`, `promoController.js`)
- Guarded by `requireFeature("ENABLE_ANNOUNCEMENTS")` and `requireFeature("ENABLE_PROMO_CODES")`:
  - `POST /api/announcements/create` (`validateRestaurant`, `upload.single("image")`) $\rightarrow$ `createAnnouncement`: Validates discount fields if `discountDetails.code` is included.
  - `GET /api/announcements/my-announcements` (`validateRestaurant`) $\rightarrow$ `getMyAnnouncements`
  - `GET /api/announcements/active` $\rightarrow$ `getAllActiveAnnouncements`: Populates active announcements from approved/open restaurants.
  - `PATCH /api/announcements/:id/status`, `PUT /api/announcements/:id`, `DELETE /api/announcements/:id`
  - `POST /api/promos/validate` (`validateUser`) $\rightarrow$ `validatePromoCode`: Validates coupon code against restaurant cart subtotal and returns `{ code, discountAmount, finalAmountAfterDiscount }`.
  - `GET /api/promos/restaurant/:restaurantId` $\rightarrow$ `getRestaurantPromos`: Returns active, non-expired promo codes for a specific restaurant.

### 7.7 Dining Tables & Concurrency-Locked Bookings (`tableController.js`, `bookingController.js`)
- **Table Inventory (`/api/tables`, protected by `validateRestaurant`):**
  - `POST /api/tables/add` (`createTable`), `GET /api/tables/my-tables` (`getMyTables`), `PUT /api/tables/:id` (`updateTable`), `DELETE /api/tables/:id` (`deleteTable`).
- **Reservation & SlotLock Workflow (`/api/bookings`, guarded by `requireFeature("ENABLE_TABLE_BOOKINGS")`):**
  - `GET /api/bookings/available-tables` $\rightarrow$ `getAvailableTables`: Finds tables with `capacity >= guests`, queries `SlotLock` for the target UTC date and `timeSlot`, and filters out locked `tableId`s.
  - `POST /api/bookings/request` (`validateUser`) $\rightarrow$ `createBookingRequest`:
    1. Verifies table availability and capacity.
    2. Computes dynamic booking fee: **Rs. 50 per guest** (`feePerGuest = 50`, `calculatedFee = guests * 50`).
    3. Sets a 10-minute lock expiration (`lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000)`).
    4. Creates a `Booking` record (`status: "Pending Payment"` if `calculatedFee > 0`, else `"Confirmed"`).
    5. Inserts a `SlotLock` document (`{ tableId, date: searchDate, time: timeSlot, bookingId, expiresAt }`). If two users click "Book" at the exact same millisecond, MongoDB throws error code `11000` on `SlotLock`'s unique index; the controller catches `11000`, deletes the orphan `Booking` record, and returns HTTP `409 Conflict` (`"Someone just booked this table a second ago!"`).
  - `GET /api/bookings/my-bookings` (`validateUser`) $\rightarrow$ `getUserBookings`
  - `PATCH /api/bookings/:id/cancel` (`validateUser`) $\rightarrow$ `cancelBookingByUser`: Marks booking `"Cancelled"` and deletes the `SlotLock` document to free the table immediately.
  - `GET /api/bookings/owner-bookings` (`validateRestaurant`) $\rightarrow$ `getOwnerBookings`
  - `PATCH /api/bookings/:id/status` (`validateRestaurant`) $\rightarrow$ `updateBookingStatusByOwner`: Allows owner to mark booking `"Confirmed"`, `"Rejected"`, or `"Completed"` (deletes `SlotLock` if rejected).

### 7.8 Cart, Checkout & Order Fulfillment (`cartController.js`, `orderController.js`, `deliveryController.js`)
- **Shopping Cart (`/api/cart`, protected by `validateUser`):**
  - `POST /api/cart/add` $\rightarrow$ `addToCart`: Enforces single-restaurant rule—if `user.cart.restaurantId !== menuItem.restaurantId`, returns HTTP `409` (`conflict: true`, `"Your cart contains items from another restaurant. Do you want to clear it and add this item?"`).
  - `PUT /api/cart/update` $\rightarrow$ `updateCartItemQuantity`: Updates item quantity or removes item if `quantity <= 0`; resets `cart.restaurantId = null` if empty.
  - `GET /api/cart` $\rightarrow$ `getCart`: Populates restaurant info and calls `calculateOrderBill` to return a live bill preview.
  - `DELETE /api/cart/clear` $\rightarrow$ `clearCart`
- **Order Processing (`/api/orders`):**
  - `POST /api/orders/place` (`validateUser`) $\rightarrow$ `placeOrder`:
    - Validates `deliveryAddress` and `paymentMethod` (`"COD"` or `"ONLINE"`).
    - Calls `calculateOrderBill` with customer coordinates (geocoding the address if coordinates are missing and caching them back to the user profile).
    - Generates a 6-digit `deliveryOtp` via `generateOrderOtp()`.
    - Sets `initialOrderStatus = paymentMethod === "COD" ? "Placed" : "Pending Payment"`.
    - Creates the `Order` and clears `user.cart` immediately if `COD`.
  - `GET /api/orders/my-orders` (`validateUser`), `GET /api/orders/restaurant-orders` (`validateRestaurant`), `PATCH /api/orders/:id/status` (`validateRestaurant`), `PATCH /api/orders/:id/cancel` (`validateUser`), `GET /api/orders/:id/invoice` (`validateUser` — streams PDF via `generateInvoicePDF`).
- **Delivery Fleet Operations (`/api/delivery`, protected by `validateDeliveryPartner`):**
  - `GET /api/delivery/available` $\rightarrow$ `getAvailableOrders`: Lists unassigned orders (`deliveryPartnerId: null`) in `"Preparing"` or `"Ready"` state.
  - `PATCH /api/delivery/:id/accept` $\rightarrow$ `acceptOrder`: Atomically assigns `deliveryPartnerId` using `Order.findOneAndUpdate({ _id, deliveryPartnerId: null })` to prevent two riders from claiming the same order.
  - `GET /api/delivery/my-orders` $\rightarrow$ `getMyActiveOrders`
  - `PATCH /api/delivery/:id/pickup` $\rightarrow$ `pickupOrder`: Requires `order.orderStatus === "Ready"`, transitions order to `"Out for Delivery"`.
  - `POST /api/delivery/:id/complete` $\rightarrow$ `completeDelivery`: Verifies customer's 6-digit `otp` against `order.deliveryOtp`, sets `orderStatus = "Delivered"`, `paymentStatus = "Paid"`, and clears `deliveryOtp`.

### 7.9 Razorpay Payments & Asynchronous Webhook Reconciliation (`paymentController.js`, `webhookController.js`)
- **Food Order Payments (`/api/payments`):**
  - `POST /api/payments/create-order` (`validateUser`) $\rightarrow$ `createRazorpayOrder`: Multiplies `order.billDetails.finalAmount * 100` (paise), creates Razorpay order (`receipt: order_${order._id}`, `notes: { type: "food_order", orderId }`), and saves `razorpayOrderId`.
  - `POST /api/payments/verify-payment` (`validateUser`) $\rightarrow$ `verifyRazorpayPayment`: Computes `crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)` over `${razorpay_order_id}|${razorpay_payment_id}`, verifies signature, updates `paymentStatus = "Paid"` and `orderStatus = "Placed"`, and clears the user's cart.
- **Table Booking Payments (`/api/payments`):**
  - `POST /api/payments/create-booking-order` (`validateUser`) $\rightarrow$ `createBookingRazorpayOrder`: Checks `booking.lockExpiresAt` hasn't expired, creates Razorpay order for `booking.bookingFee * 100` (`notes: { type: "table_booking", bookingId }`).
  - `POST /api/payments/verify-booking-payment` (`validateUser`) $\rightarrow$ `verifyBookingPayment`: Verifies HMAC-SHA256 signature, sets `booking.status = "Confirmed"`, updates `SlotLock.expiresAt = new Date("2099-01-01")` (making the lock permanent), and triggers `sendBookingConfirmationEmail`.
- **Server-to-Server Webhook (`webhookController.js`):**
  - `POST /api/payments/webhook` $\rightarrow$ `handleRazorpayWebhook`:
    - Verifies `x-razorpay-signature` header against raw request buffer using `RAZORPAY_WEBHOOK_SECRET`.
    - Handles `payment.captured` and `order.paid`: Inspects `paymentEntity.notes.type` (`"food_order"` vs `"table_booking"`) and idempotently reconciles any order/booking that remained in `"Pending"` state (e.g., if the user's browser closed before client-side verification completed).
    - Handles `payment.failed`: Marks food orders or table bookings as `"Failed"` / `"Payment Failed"`, and deletes the associated `SlotLock` document to release the table back to the public pool.

### 7.10 Location, User Profile & Feature Config Endpoints
- `GET /api/location/reverse` (`locationController.js`): Proxies reverse geocoding (`?lat=&lon=`) to Nominatim (`https://nominatim.openstreetmap.org/reverse`) and extracts structured `{ addressLine, city, state, pincode }`.
- `POST /api/user/address`, `GET /api/user/address`, `DELETE /api/user/address/:id` (`userController.js`): Manages customer saved addresses and geocodes them on save.
- `GET /api/config/flags` (`config.routes.js`): Returns the live `featureFlags` object (`ENABLE_TABLE_BOOKINGS`, `ENABLE_ANNOUNCEMENTS`, `ENABLE_PROMO_CODES`) to the frontend client.