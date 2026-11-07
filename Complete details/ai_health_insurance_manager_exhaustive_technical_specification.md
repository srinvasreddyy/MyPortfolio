# Project 2: AI-Health-Insurance-Manager (`srinvasreddyy/ai-health-insurance-manager`) — Exhaustive Pin-Point Technical Specification

* **Repository / Archive Commit:** `2991588d09e9d4c9833861e47e22ea20a89cd6ab`
* **Architectural Pattern:** 3-Tier Polyglot Microservice Architecture (React + Vite Frontend, Node.js + Express Backend API & Auth Service, Python + Flask Machine Learning & Generative AI Microservice)
* **Core Domain:** Health Insurance Premium Estimation (`LinearRegression` + `StandardScaler`), Generative AI Risk Factor Breakdown & Personalized Actionable Health/Financial Recommendations (`gemini-2.5-flash`), JWT + Google OAuth 2.0 User Authentication, and Historical Prediction Tracking.

---

## 1. Complete Repository Directory Tree

The repository contains **30 distinct files** structured across three isolated service directories (`backend/`, `frontend/`, and `ml_service/`) plus root documentation:

```text
AI-Health-Insurance-Manager-2991588d09e9d4c9833861e47e22ea20a89cd6ab/
├── README.md
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Prediction.js
│   │   └── User.js
│   └── routes/
│       ├── auth.js
│       └── prediction.js
├── frontend/
│   ├── .gitignore
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── api/
│       │   └── client.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── PredictionForm.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Home.jsx
│           ├── Login.jsx
│           └── Register.jsx
└── ml_service/
    ├── app.py
    ├── insurance_model.pkl
    ├── requirements.txt
    └── scaler.pkl
```

---

## 2. Tier 1: Machine Learning & Generative AI Microservice (`ml_service/`)

### 2.1 Python Dependencies (`ml_service/requirements.txt`)
* `flask` — Lightweight WSGI web application framework serving the `/predict` and `/` endpoints.
* `flask-cors` — Enables Cross-Origin Resource Sharing (`CORS(app)`) across all routes.
* `scikit-learn` — Provides `LinearRegression` and `StandardScaler` runtime classes unpickled from disk.
* `pandas` — Constructs structured 1-row `DataFrame` objects matching the exact feature names used during training.
* `numpy` — Numerical array manipulation underlying `pandas` and `scikit-learn`.
* `google-genai` — Official Google GenAI SDK (`from google import genai`) used to invoke `gemini-2.5-flash`.
* `python-dotenv` — Loads environment variables (`GEMINI_API_KEY`, `PORT`) from `.env`.
* `gunicorn` — Production WSGI HTTP server for deployment.

### 2.2 Serialized Model Artifacts (`insurance_model.pkl` & `scaler.pkl`)
1. **`scaler.pkl` (`sklearn.preprocessing._data.StandardScaler`):**
   * ** Fitted Schema (`feature_names_in_`):** `['age', 'bmi', 'children', 'sex', 'smoker', 'region_northwest', 'region_southeast', 'region_southwest']` (8 features; `region_northeast` is dropped as the reference dummy category).
   * **Learned Parameters:**
     * `mean_`: `[39.20702541, 30.66339686, 1.09491779, 0.49476831, 0.20478326, 0.24289985, 0.27204783, 0.24289985]`
     * `scale_` ($\sigma$): `[14.04470904, 6.09590764, 1.20504217, 0.49997263, 0.40354315, 0.42883505, 0.44501442, 0.42883505]`
     * `n_samples_seen_`: `1338` (trained on the standard 1,338-record Medical Cost Personal Datasets).
2. **`insurance_model.pkl` (`sklearn.linear_model._base.LinearRegression`):**
   * **Intercept (`intercept_`):** `13270.422265141257` (USD base charge at mean feature values).
   * **Learned Feature Coefficients (`coef_`):**
     * `age`: `+3607.47273619`
     * `bmi`: `+2067.69196584`
     * `children`: `+572.99820995`
     * `sex`: `+92.9584582` (where `male = 0`, `female = 1`)
     * `smoker`: `+9620.9907275` (largest single positive driver of insurance cost)
     * `region_northwest`: `-151.36700483`
     * `region_southeast`: `-460.75906307`
     * `region_southwest`: `-411.8559028`

### 2.3 Preprocessing, Prediction & Gemini AI Logic (`ml_service/app.py`)
* **Startup Initialization:**
  * Calls `load_dotenv()`.
  * Loads `insurance_model.pkl` and `scaler.pkl` using `pickle.load()` via absolute paths resolved from `os.path.dirname(__file__)`.
  * Initializes `genai.Client()` if `os.getenv("GEMINI_API_KEY")` is present; otherwise sets `client = None` and logs a warning.
* **Helper Function `preprocess_input(data)`:**
  1. Extracts and casts raw JSON fields:
     * `age = int(data.get('age', 0))`
     * `sex = 0 if str(data.get('sex', '')).lower() == 'male' else 1`
     * `bmi = float(data.get('bmi', 0.0))`
     * `children = int(data.get('children', 0))`
     * `smoker = 1 if str(data.get('smoker', '')).lower() in ['yes', 'true', '1'] else 0`
  2. One-Hot Encodes `region` (`str(data.get('region', '')).lower()`):
     * `region_northwest = 1 if region == 'northwest' else 0`
     * `region_southeast = 1 if region == 'southeast' else 0`
     * `region_southwest = 1 if region == 'southwest' else 0`
  3. Builds a 1-row `pd.DataFrame` with columns `['age', 'bmi', 'children', 'sex', 'smoker', 'region_northwest', 'region_southeast', 'region_southwest']`.
  4. Transforms the DataFrame via `scaler.transform(features)` and returns the scaled NumPy array.
* **Helper Function `generate_explanation(data, prediction)`:**
  * Constructs a structured prompt injecting `age`, `sex`, `bmi`, `children`, `smoker`, `region`, and `${prediction:,.2f}`.
  * Calls `client.models.generate_content(model='gemini-2.5-flash', contents=prompt)` requesting Markdown output with:
    1. **Cost Breakdown & Risk Factors** (explaining how BMI, smoking status, or age affected the estimate).
    2. **Actionable Recommendations** (2–3 practical lifestyle or financial tips to lower future costs).
  * Includes graceful fallback messages if `GEMINI_API_KEY` is missing or if the API call raises an exception.
* **HTTP Endpoints (`ml_service/app.py`):**
  * `GET /`: Health check returning `200 OK` with `{"status": "ML Service is running", "model_loaded": True}`.
  * `POST /predict`:
    * Validates that `model` and `scaler` are loaded (`500` if missing) and JSON payload exists (`400` if empty).
    * Runs `preprocess_input(data)` and computes `prediction = model.predict(scaled_features)[0]`.
    * Clamps negative linear regression edge cases: `prediction = max(0.0, float(prediction))`.
    * Calls `generate_explanation(data, prediction)` and returns `200 OK`:
      ```json
      {
        "prediction": 12345.67,
        "explanation": "### Cost Breakdown & Risk Factors..."
      }
      ```
  * Runs on `host='0.0.0.0'`, `port=int(os.environ.get('PORT', 5001))`, `debug=True`.

---

## 3. Tier 2: Backend API & Authentication Service (`backend/`)

### 3.1 Dependencies & Environment Configuration (`backend/package.json` & `.env.example`)
* **Runtime Dependencies:**
  * `express` (`^5.2.1`), `cors` (`^2.8.6`), `dotenv` (`^17.3.1`)
  * `mongoose` (`^9.2.4`)
  * `bcryptjs` (`^3.0.3`), `jsonwebtoken` (`^9.0.3`), `google-auth-library` (`^10.6.1`)
  * `nodemailer` (`^8.0.1`), `axios` (`^1.13.6`)
* **Environment Variables (`backend/.env.example`):**
  * `PORT=5000`
  * `MONGODB_URI=mongodb://localhost:27017/health_insurance`
  * `JWT_SECRET=your_super_secret_jwt_key`
  * `ML_SERVICE_URL=http://localhost:5001`
  * `EMAIL_USER`, `EMAIL_PASS` (Gmail SMTP credentials for OTP dispatch)
  * `GOOGLE_CLIENT_ID` (Google OAuth 2.0 Client ID verified by `OAuth2Client`)

### 3.2 Server Bootstrap (`backend/index.js`)
* Initializes Express on `process.env.PORT || 5000`.
* Applies `cors()` and `express.json()`.
* Connects to MongoDB via `mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/insurance_predictor')`.
* Mounts routes:
  * `/api/auth` $\rightarrow$ `./routes/auth.js`
  * `/api/predict` $\rightarrow$ `./routes/prediction.js`
* Exposes `GET /` returning `'Insurance Predictor API Backend is running'`.

### 3.3 Mongoose Data Models (`backend/models/`)

#### 3.3.1 `backend/models/User.js`
* `email`: `String`, `required: true`, `unique: true`, `trim: true`, `lowercase: true`
* `password`: `String`, `required: false` (optional to support passwordless Google OAuth accounts)
* `name`: `String`, `required: true`, `trim: true`
* `googleId`: `String`, `required: false`
* `isVerified`: `Boolean`, `default: false`
* `otp`: `String`, `required: false`
* `otpExpires`: `Date`, `required: false`
* `createdAt`: `Date`, `default: Date.now`

#### 3.3.2 `backend/models/Prediction.js`
* `userId`: `mongoose.Schema.Types.ObjectId`, `ref: 'User'`, `required: true`
* `age`: `Number`, `required: true`
* `sex`: `String`, `required: true`, `enum: ['male', 'female']`
* `bmi`: `Number`, `required: true`
* `children`: `Number`, `required: true`
* `smoker`: `String`, `required: true`, `enum: ['yes', 'no']`
* `region`: `String`, `required: true`, `enum: ['northeast', 'northwest', 'southeast', 'southwest']`
* `predictedExpense`: `Number`, `required: true`
* `explanation`: `String` (stores the Markdown explanation returned by Gemini)
* `createdAt`: `Date`, `default: Date.now`

### 3.4 JWT Authentication Middleware (`backend/middleware/auth.js`)
* Reads the `Authorization` header (`req.header('Authorization')`).
* Returns `401 Unauthorized` (`{ message: 'No token, authorization denied' }`) if missing.
* Strips the `'Bearer '` prefix, verifies the token using `jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')`, assigns `req.user = decoded.user` (`{ id: user.id }`), and calls `next()`.
* Returns `401 Unauthorized` (`{ message: 'Token is not valid' }`) if verification fails.

### 3.5 Authentication Routes & Controllers (`backend/routes/auth.js`)
* **Email Transport Setup:** Configures `nodemailer.createTransport({ service: 'gmail', auth: { user: EMAIL_USER, pass: EMAIL_PASS } })` and `new OAuth2Client(process.env.GOOGLE_CLIENT_ID)`.
* **Helper `sendOTP(email, otp)`:**
  * If `EMAIL_USER` is missing or equals `'your_email@gmail.com'`, logs `[DEV MODE] Mock Email to ${email} - OTP is: ${otp}` to the console and returns `true` (enabling zero-config local development).
  * Otherwise sends an HTML email titled `"Verify Your Account"` containing the 6-digit OTP and a 10-minute expiration notice.
* **Endpoints:**
  1. `POST /api/auth/register`:
     * Accepts `{ name, email, password }`.
     * If a verified user already exists with `email`, returns `400` (`'User already exists'`).
     * Generates a 6-digit OTP (`Math.floor(100000 + Math.random() * 900000).toString()`) and sets `otpExpires = Date.now() + 10 * 60 * 1000` (10 minutes).
     * Hashes `password` with `bcrypt.genSalt(10)` and `bcrypt.hash()`.
     * Creates a new `User` (or overwrites unverified existing user fields), saves to MongoDB, sends OTP via `sendOTP()`, and returns `200` with `{ message: 'OTP sent to email. Please verify your account.', email }`.
  2. `POST /api/auth/verify-otp`:
     * Accepts `{ email, otp }`.
     * Validates user existence, checks `!user.isVerified`, compares `user.otp === otp`, and ensures `user.otpExpires >= Date.now()`.
     * Marks `user.isVerified = true`, clears `user.otp = undefined` and `user.otpExpires = undefined`, and saves.
     * Signs a JWT (`payload = { user: { id: user.id } }`, `expiresIn: '7d'`) and returns `{ token, user: { id, name, email } }`.
  3. `POST /api/auth/login`:
     * Accepts `{ email, password }`.
     * Checks user existence; if `!user.password`, returns `400` (`'Please login with Google'`).
     * If `!user.isVerified`, returns `400` (`{ message: 'Please verify your email first', unverified: true }`).
     * Verifies password with `bcrypt.compare(password, user.password)`, signs a 7-day JWT, and returns `{ token, user: { id, name, email } }`.
  4. `POST /api/auth/google`:
     * Accepts `{ credential }` (Google ID token from `@react-oauth/google`).
     * Verifies token via `googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })`.
     * Extracts `{ email, name, sub: googleId } = ticket.getPayload()`.
     * If no user exists, provisions a new `User` with `isVerified: true` and `googleId`. If an email user exists without `googleId`, links `googleId` and sets `isVerified = true`.
     * Signs a 7-day JWT and returns `{ token, user: { id, name, email } }`.
  5. `GET /api/auth/me` (protected by `auth` middleware):
     * Queries `User.findById(req.user.id).select('-password')` and returns the user profile.

### 3.6 Prediction Proxy & History Routes (`backend/routes/prediction.js`)
* All endpoints are protected by `auth` middleware:
  1. `POST /api/predict`:
     * Extracts `{ age, sex, bmi, children, smoker, region }` from `req.body`.
     * Validates that none of the 6 fields are `undefined` (`400 Bad Request` if any are missing).
     * Sends an HTTP POST via `axios.post(`${ML_SERVICE_URL}/predict`, { age: Number(age), sex, bmi: Number(bmi), children: Number(children), smoker, region })`.
     * Extracts `{ prediction, explanation } = mlResponse.data`.
     * Persists a new `Prediction` document in MongoDB linking `userId: req.user.id`, all 6 input features (lowercasing `sex`, `smoker`, `region`), `predictedExpense: prediction`, and `explanation`.
     * Returns `201 Created` with the saved `Prediction` document.
  2. `GET /api/predict/history`:
     * Queries `Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 })` and returns the user's chronological prediction history array.

---

## 4. Tier 3: Frontend Single-Page Application (`frontend/`)

### 4.1 Frontend Dependencies & Build Tooling (`frontend/package.json` & Configs)
* **Core Libraries:** `react` (`^19.2.0`), `react-dom` (`^19.2.0`), `react-router-dom` (`^7.13.1`)
* **HTTP & OAuth:** `axios` (`^1.13.6`), `@react-oauth/google` (`^0.13.4`)
* **UI, Icons & Markdown Rendering:** `lucide-react` (`^1.7.0`), `react-markdown` (`^10.1.0`), `tailwindcss` (`^3.4.17`)
* **Custom Theme (`frontend/tailwind.config.js`):**
  * Extends `colors.brand` palette (`50: '#f0fdfa'` through `900: '#134e4a'`, centered on teal `#14b8a6` / `#0d9488`).
  * Configures `fontFamily.sans` as `['Inter', 'sans-serif']`.
* **Global Styles (`frontend/src/index.css`):**
  * Imports Google Font `Inter` (`300, 400, 500, 600, 700`).
  * Defines `.glass` (`bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl`) and `.glass-dark` utility classes.

### 4.2 Axios Client & Interceptor (`frontend/src/api/client.js`)
* Creates an Axios instance with `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.
* Registers a request interceptor that reads `localStorage.getItem('token')` and injects `config.headers.Authorization = Bearer ${token}` on every outbound API request.

### 4.3 Authentication Context (`frontend/src/context/AuthContext.jsx`)
* Wraps the application in `<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>` and `<AuthContext.Provider>`.
* **State:** `user` (`null` or `{ id, name, email }`) and `loading` (`boolean`).
* **Session Restoration (`useEffect`):** On mount, checks `localStorage.getItem('token')`. If present, calls `GET /api/auth/me` to hydrate `user`; if the token is expired/invalid, removes `token` from `localStorage`.
* **Exposed Methods:**
  * `login(email, password)` $\rightarrow$ `POST /auth/login`, saves `token` to `localStorage`, sets `user`.
  * `register(name, email, password)` $\rightarrow$ `POST /auth/register`, returns response data (triggering OTP view).
  * `verifyOtp(email, otp)` $\rightarrow$ `POST /auth/verify-otp`, saves `token` to `localStorage`, sets `user`.
  * `googleLogin(credential)` $\rightarrow$ `POST /auth/google`, saves `token` to `localStorage`, sets `user`.
  * `logout()` $\rightarrow$ removes `token` from `localStorage` and resets `user = null`.

### 4.4 Routing & Route Guards (`frontend/src/App.jsx`)
* Defines `<ProtectedRoute>` component: renders a centered spinning loader while `loading` is true, redirects unauthenticated users to `<Navigate to="/login" />`, or renders `children`.
* **Routes:**
  * `/` $\rightarrow$ `<Home />`
  * `/login` $\rightarrow$ `<Login />`
  * `/register` $\rightarrow$ `<Register />`
  * `/dashboard` $\rightarrow$ `<ProtectedRoute><Dashboard /></ProtectedRoute>`

### 4.5 Components & Pages Breakdown (`frontend/src/components/` & `frontend/src/pages/`)
1. **`Navbar.jsx`:**
   * Displays the `HeartPulse` brand logo (`HealthAI`), user greeting (`Hello, {user.name}`), a `Dashboard` link, and a `Logout` button (or `Login` / `Get Started` buttons when unauthenticated).
2. **`PredictionForm.jsx`:**
   * Controlled form managing initial state: `{ age: '', sex: 'male', bmi: '', children: '0', smoker: 'no', region: 'southwest' }`.
   * Validates inputs (`age` 18–100, `bmi` 10–60 step `0.1`, `children` 0–10, `sex`, `smoker`, `region`) and invokes `onPredict(formData)`.
3. **`Dashboard.jsx`:**
   * **State:** `currentPrediction` (`null` or latest prediction object), `history` (`[]`), `loading` (`false`), `error` (`''`).
   * **Lifecycle:** Calls `fetchHistory()` (`GET /api/predict/history`) on mount.
   * **Prediction Handler (`handlePredict`):** Submits form data to `POST /api/predict`, updates `currentPrediction = res.data`, and prepends `res.data` to `history`.
   * **3-Part Interactive UI:**
     * Left column: `<PredictionForm />`.
     * Right top card: Displays the formatted USD estimate (`$predictedExpense`) and renders the Gemini AI Markdown analysis via `<ReactMarkdown>` inside a styled `prose-teal` container.
     * Right bottom card: Scrollable **Recent Predictions** history list; clicking any past prediction item sets `setCurrentPrediction(item)` so the user can review its full AI explanation.
4. **`Home.jsx`:**
   * Landing page featuring a hero call-to-action (`Go to Dashboard` if logged in, or `Start Free Prediction` / `Sign In` if guest) and a 3-card feature grid (*Precision ML Model*, *Instant Risk Analysis*, *Historical Tracking*).
5. **`Login.jsx` & `Register.jsx`:**
   * **`Login.jsx`:** Email/password login form + `<GoogleLogin />` button. If backend responds with `err.response?.data?.unverified`, redirects the user to `/register` to complete OTP verification.
   * **`Register.jsx`:** 2-step state machine (`step = 1` for Name/Email/Password registration + `<GoogleLogin />`; `step = 2` for 6-digit OTP input calling `verifyOtp(email, otp)`).