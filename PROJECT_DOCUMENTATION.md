# ArthikSetu: AI-Powered Financial Platform for India's Gig Workers

ArthikSetu (meaning *Financial Bridge*) is an AI-driven, privacy-first financial wellness platform designed specifically for India’s gig economy workers—including delivery partners, ride-sharing drivers, and independent freelancers working on platforms like Swiggy, Zomato, Uber, Ola, and UrbanCompany.

This document serves as a comprehensive project guide, system architecture blueprint, API specification, and technical interview preparation handbook.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Core Features](#2-core-features)
3. [Complete Tech Stack](#3-complete-tech-stack)
4. [Project Architecture](#4-project-architecture)
5. [Folder Structure Explanation](#5-folder-structure-explanation)
6. [API Documentation](#6-api-documentation)
7. [Firebase Explanation](#7-firebase-explanation)
8. [AI/Gemini Integration](#8-aigemini-integration)
9. [Security & Privacy](#9-security--privacy)
10. [Complete User Flow](#10-complete-user-flow)
11. [Important Technical Concepts](#11-important-technical-concepts)
12. [Common Interview Questions & Answers](#12-common-interview-questions--answers)
13. [Challenges Faced & Solutions](#13-challenges-faced--solutions)
14. [Future Scope](#14-future-scope)
15. [Deployment Guide](#15-deployment-guide)
16. [Resume Explanation Section](#16-resume-explanation-section)
17. [HR + Technical Round Preparation](#17-hr--technical-round-preparation)
18. [Final Summary](#18-final-summary)

---

## 1. Project Overview

### What ArthikSetu Is
**ArthikSetu** is an AI-powered financial enablement platform designed to bring formal financial services, tax assistance, and government welfare benefits to India's unorganized and gig workforce. It acts as a consolidated financial hub, aggregating income from multiple gig platforms, verifying income sources via AI-driven OCR, predicting earning patterns, and simplifying complex financial information into accessible Hinglish (Hindi + English).

### Problem Statement
The gig economy in India is growing rapidly, with millions of workers joining delivery and ride-sharing networks. However, these workers face unique financial challenges:
- **Income Fragmentation:** Earnings are split across multiple applications (e.g., a driver might work for both Uber and Ola), making it difficult to understand total net income.
- **Financial Exclusion:** Without standard salary slips or continuous employment letters, banks classify gig workers as high-risk, denying them access to formal credit and micro-loans.
- **Information Asymmetry:** Complex banking text messages, interest rate notifications, and tax laws are written in jargon that many gig workers find difficult to decode.
- **Welfare Gap:** Numerous government welfare benefits (e.g., PM-SVANidhi, APY) are available, but workers are either unaware of them or find the eligibility checks too confusing.
- **Data Privacy Exploitation:** Standard financial apps often scrap user data, upload entire documents to servers, and sell consumer details, violating user privacy.

### Target Users
- Delivery executives (Swiggy, Zomato, Zepto, Blinkit, Dunzo, Porter)
- Ride-sharing and logistics drivers (Uber, Ola, Rapido)
- On-demand home service professionals (UrbanCompany)
- Freelance delivery agents and micro-contractors

### Why This Project Matters
Gig workers form the backbone of India's digital services, yet they remain excluded from formal financial systems. ArthikSetu bridges this gap by providing an "Income Passport"—a verified, audit-safe financial summary that workers can present to banks as proof of earnings to qualify for micro-loans, credit cards, or government programs.

### Real-World Impact
By aggregating fragmented payouts, checking credit eligibility in real-time, explaining confusing financial terms, and maintaining a strict, privacy-first data pipeline compliant with the **Digital Personal Data Protection (DPDP) Act 2023**, ArthikSetu moves gig workers from informal cash cycles into formal, secure financial ecosystems.

---

## 2. Core Features

### Unified Earnings Dashboard
Aggregates and organizes income records from platforms such as Zomato, Swiggy, Uber, Ola, and UrbanCompany.
- **Analytics Visualizations:** Displays platform-wise earnings using cell-tailored Recharts (Bar Charts and Pie Charts) to show percentage shares and comparative distributions.
- **Diversification Score:** Calculates a dynamic score (0-100) based on the number of active income channels to encourage workers not to rely on a single platform.
- **Performance Highlights:** Flags the highest-earning platform and calculates average platform payouts.

### SMS Analyzer
An AI-powered SMS scanner that extracts earnings directly from messages.
- **AI NLP Extraction:** Utilizes Google Gemini to parse text messages, identifying credit amounts, transaction dates, and source merchants, avoiding fragile regex patterns.
- **Rule-Based Fallback:** Incorporates a local regex parser (`sms_parser.py`) for offline scenarios to identify standard Indian bank and gig-platform transactions.
- **Fraud Guard:** Checks debit alerts; any debit transaction exceeding ₹5,000 is flagged to protect workers from UPI scams and unauthorized deductions.

### AI Assistant
A conversational assistant chatbot available in the application.
- **Multilingual Support:** Converses in natural Hinglish (Hindi + English) to ensure accessibility.
- **Platform Navigation & Advice:** Answers questions about taxes, loans, schemes, and platform navigation.
- **Context Preservation:** Keeps a session-based rolling history of the last 20 messages in memory to answer follow-up questions.

### Risk Prediction
Predicts low-income periods based on historical earnings trends.
- **Earning Trend Classification:** Classifies risks as Low, Medium, or High, and assigns a risk score from 0 to 100.
- **Challenging Month Forecasts:** Identifies months where income is historically low (e.g., monsoon slumps or off-season periods).
- **Actionable AI Advice:** Suggests mitigation strategies, such as onboarding alternative apps or building emergency funds.

### Message Decoder
Demystifies complex banking jargon.
- **Plain Language Translation:** Translates confusing SMS templates (e.g., NEFT credits, debit notifications, pre-approved loan interest terminology) into simplified Hinglish.
- **Example Templates:** Features quick-click templates for common confusing messages.

### Government Schemes
A welfare discovery engine.
- **Eligibility Engine:** Checks eligibility (using age, annual income, occupation, and social category) against schemes like PM-SVANidhi, Atal Pension Yojana (APY), PMJJBY, PM-SBY, PMEGP, Stand-Up India, and Ayushman Bharat.
- **AI Simplifier:** Uses Gemini to explain scheme descriptions and provides application links.

### Document Verification
A secure document upload portal.
- **Gemini Vision OCR:** Extracts name, document type, and IDs from Aadhaar, PAN, Driving Licenses, Voter IDs, and Passports.
- **Live Privacy Pipeline:** Displays step-by-step processing feedback to the user and masks the document ID, retaining only the name and the last 4 digits.
- **Memory Clearance:** Deletes the uploaded image from memory immediately after verification.

### Privacy Dashboard
Puts the user in control of their digital footprint.
- **Permission Toggles:** Toggles local browser permission settings (SMS Parsing, Document Upload, Location Access).
- **Data Portability:** Exports all earnings and transaction records as a clean JSON file.
- **Permanent Deletion ("Nuclear Option"):** Deletes all server-side records (earnings, active chats, OTP logs) in one click.

### Firebase Authentication
- **Secure Logins:** Implements Google Sign-In via Firebase Auth.
- **Session-Based Isolation:** Isolates data based on the logged-in user's email, enabling multi-tenant usage on a shared server-side state.

---

## 3. Complete Tech Stack

```
+-----------------------------------------------------------------------------------+
|                                   FRONTEND                                        |
|   React 18  ·  TypeScript  ·  Vite  ·  Tailwind CSS  ·  Shadcn/UI  ·  Recharts    |
+------------------------------------+----------------------------------------------+
                                     |
                                     |  HTTP REST Requests (JSON / FormData)
                                     |  Header: 'x-user-email' for multi-tenant isolation
                                     v
+-----------------------------------------------------------------------------------+
|                                   BACKEND                                         |
|                 FastAPI (Python 3.8+)  ·  Uvicorn  ·  Pydantic                    |
+-------------------+--------------------------------+------------------------------+
                    |                                |
                    |  In-Memory Storage             |  Generative AI API
                    v                                v
+-----------------------------------+   +-------------------------------------------+
|          DATA STORE               |   |                 AI ENGINE                 |
|  dict[email, user_data] (RAM)    |   |  Google Gemini 2.5 Flash (Vision + NLP)   |
|  * deleted on /delete_all_data    |   |  - API Key Rotation & 429 Retry logic     |
+-----------------------------------+   +-------------------------------------------+
                    ^
                    | Firebase Client Auth
                    |
+-------------------+---------------------------------------------------------------+
|                               EXTERNAL SERVICES                                   |
|                Firebase Authentication  ·  DigiLocker / Bank Gateways             |
+-----------------------------------------------------------------------------------+
```

### Frontend
- **React 18 & TypeScript:** Used for building a component-based user interface. TypeScript enforces strict types for API requests and component states.
- **Vite:** A build tool providing fast Hot Module Replacement (HMR) and optimized production bundles.
- **Tailwind CSS & Shadcn/UI:** Provides styling, responsive layouts, and glassmorphic designs with smooth color palettes.
- **Recharts:** Renders responsive SVG charts (Bar, Pie, Area) for financial data visualization.
- **jsPDF & jsPDF-AutoTable:** Generates client-side PDF documents (Income Passports) containing formatted transaction details and verified badges.

### Backend
- **FastAPI:** A high-performance Python web framework built on ASGI (Asynchronous Server Gateway Interface), enabling concurrent requests.
- **Uvicorn:** A lightning-fast ASGI web server implementation.
- **Pydantic:** Validates request and response bodies against schemas, returning 422 errors for malformed requests.

### Database & Storage
- **In-Memory Store:** The project processes all data in RAM using user email mappings (`user_earnings_stores`). This complies with zero-storage regulations, as no data is written to a physical disk on the server.
- **LocalStorage:** Stores user preferences, local permissions, and authentication session data client-side.

### AI Engine (Google Gemini 2.5 Flash)
- **Model Choice:** Gemini 2.5 Flash was chosen for its low latency, high token limit, multimodal support, and cost-efficiency.
- **NLP Capabilities:** Processes unstructured text data, parses transaction SMS messages, and simplfies financial language.
- **Vision OCR Capabilities:** Analyzes uploaded image files, extracts fields, and validates security details.

### Mobile Layer
- **React Native (Expo):** Extends the platform to mobile devices.
- **react-native-get-sms-android:** Accesses the device's incoming SMS stream and synchronizes transactions directly with the FastAPI server.

---

## 4. Project Architecture

### Data Flow & Request Lifecycle
1. **Authentication:** The user logs in via Google Popup in the React Frontend using Firebase Auth.
2. **Session Storage:** Firebase returns a User Credential. The frontend stores `user_email` in `localStorage`.
3. **API Headers:** Every subsequent API request calls `getApiHeaders()` which reads `user_email` and injects it as `x-user-email` in the request headers.
4. **Backend Routing:** FastAPI receives the request. The endpoint reads the `x-user-email` header.
   - If the header is missing, it falls back to `guest@arthiksetu.in`.
   - If the email is new, it initializes a copy of the mock data (`DEFAULT_EARNINGS_STORE`) for that user.
5. **AI Processing:** For requests requiring OCR, vision, or translation, the backend routes requests to `gemini_service.py`. The Gemini API returns structured JSON data.
6. **Data Update & Calculations:** For income proof verification or SMS parsing:
   - Extracted values are added to the user's specific store in RAM.
   - Total earnings are updated and standard deduction/slab-wise tax values are calculated.
7. **Frontend Update:** The endpoint returns the updated status. The frontend context updates the state, and Recharts charts are re-rendered.

---

## 5. Folder Structure Explanation

```
ArthikSetu/
├── Backend/
│   ├── main.py                 # FastAPI application and endpoint routing
│   ├── gemini_service.py       # Google Gemini API configurations and prompt engines
│   ├── sms_parser.py           # Fallback regex patterns for local SMS parsing
│   ├── schemes.py              # In-memory Government scheme eligibility logic
│   ├── requirements.txt        # Python dependency configuration
│   └── test_e2e.py             # 23 automated tests covering the API endpoints
├── Frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React entrypoint, handles routing and Auth state
│   │   ├── EarningsContext.tsx # React Context API managing shared financial state
│   │   ├── config.ts           # Base URL configurations and header injection helpers
│   │   ├── firebase.ts         # Firebase App configuration and service exports
│   │   └── components/
│   │       ├── UnifiedDashboard.tsx # Aggregated analytics page with Recharts
│   │       ├── SMSAnalyzer.tsx      # Interface for pasting and scanning SMS
│   │       ├── AIAssistant.tsx      # Tab-based chatbot, decoder, and risk page
│   │       ├── DocumentVerification.tsx # Secure file upload with step-by-step pipeline
│   │       ├── PrivacyDashboard.tsx # User settings, JSON data export, and nuke option
│   │       ├── TaxPage.tsx          # Tax calculator, slab estimator, and jsPDF exporter
│   │       ├── Loans.tsx            # Loan eligibility checker based on income
│   │       └── Navigation.tsx       # Main header bar component
│   └── package.json            # Node.js dependencies
└── Mobile/                     # React Native Expo codebase
    ├── App.tsx                 # Mobile application root and dashboard screen
    ├── api.ts                  # Fetch API client pointing to FastAPI endpoints
    └── screens/                # Sub-screens mapping to the web version
```

---

## 6. API Documentation

### 1. `GET /api/dashboard`
- **Purpose:** Fetches the aggregated earnings data, monthly summaries, and individual income sources for the user.
- **Request Format:** HTTP Headers must contain:
  ```http
  x-user-email: user@domain.com
  ```
- **Response Format:**
  ```json
  {
    "incomeSources": [
      { "name": "Zomato", "amount": 14500, "verified": true, "source": "Zomato", "description": "Food delivery earnings - Zomato", "upload_time": "2025-02-01T09:00:00" }
    ],
    "earningsData": [
      { "month": "Jan", "amount": 30500 },
      { "month": "Feb", "amount": 34600 }
    ],
    "totalMonthlyIncome": 34600
  }
  ```

### 2. `POST /api/verify_document`
- **Purpose:** Securely processes uploaded documents (salary slips, identity cards) via Gemini Vision.
- **Request Format:** Multipart Form Data:
  - `file`: binary file upload
  - `doc_type`: "Aadhaar" | "PAN" | "Driving License" | "Voter ID" | "Passport" | "Income Proof"
- **Response Format (e.g., PAN Card Verification):**
  ```json
  {
    "status": "verified",
    "doc_type": "PAN",
    "extracted_id": "XXXXX 1234F",
    "message": "PAN verified successfully via AI analysis",
    "confidence_score": 0.95,
    "verification_source": "ai_upload",
    "reason": "Authentic Income Tax Department layout detected. Correct alphanumeric sequence verified.",
    "features_found": ["Income Tax Department Logo", "Cardholder Photo", "National Emblem"]
  }
  ```

### 3. `POST /api/parse_sms`
- **Purpose:** Parses bank transaction messages to detect gig-worker payouts.
- **Request Format:**
  ```json
  {
    "messages": [
      "Your UPI transaction to Swiggy for Rs.450 is successful",
      "Rs.1200 credited from Zomato on 15-Jan-2025"
    ]
  }
  ```
- **Response Format:**
  ```json
  {
    "transactions": [
      {
        "amount": 1200.0,
        "merchant": "Zomato",
        "type": "credit",
        "date": "15-Jan-2025",
        "description": "Credit of Rs 1,200.00 from Zomato",
        "raw": "Rs.1200 credited from Zomato on 15-Jan-2025"
      }
    ],
    "summary": {
      "total_credit": 1200.0,
      "total_debit": 0.0,
      "count": 1
    }
  }
  ```

### 4. `POST /api/chat`
- **Purpose:** Communicates with the AI Assistant chatbot.
- **Request Format:**
  ```json
  {
    "message": "How can I reduce my TDS?",
    "session_id": "session_171665400"
  }
  ```
- **Response Format:**
  ```json
  {
    "response": "Hello! Freelancers & gig workers can file ITR-4 under Section 44ADA to pay tax on only 50% of gross earnings. 📝",
    "session_id": "session_171665400"
  }
  ```

### 5. `POST /api/predict_risk`
- **Purpose:** Analyzes monthly history to forecast potential down-periods.
- **Request Format:**
  ```json
  {
    "data": [
      { "date": "Jan", "amount": 35000 },
      { "date": "Feb", "amount": 32000 }
    ]
  }
  ```
- **Response Format:**
  ```json
  {
    "risk_level": "Medium",
    "risk_score": 45,
    "predicted_low_months": ["July", "August"],
    "suggestions": [
      "Onboard onto Zomato and Blinkit to offset the summer delivery drop.",
      "Save at least 15% of your high-season earnings for monsoon slumps."
    ],
    "trend": "stable"
  }
  ```

### 6. `DELETE /api/delete_all_data`
- **Purpose:** Erases the user's mapped records in the in-memory data store.
- **Response Format:**
  ```json
  {
    "status": "deleted",
    "message": "All data has been permanently deleted. Earnings, chat history, and sessions have been wiped.",
    "items_cleared": ["earnings", "chat_history", "otp_sessions"]
  }
  ```

---

## 7. Firebase Explanation

### Authentication Setup
Firebase Client-Side Authentication handles secure user sessions:
- Implements `signInWithPopup` and `GoogleAuthProvider`.
- Listens to authentication state changes via `onAuthStateChanged`. When a user log in, their details are set in the React component state, and `localStorage.setItem('user_email', currentUser.email)` is executed.

### Configuration Configuration (Vite Env Variables)
Vite projects require prefixing environment variables with `VITE_`. These are configured in `Frontend/.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=arthiksetu-prd.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=arthiksetu-prd
VITE_FIREBASE_STORAGE_BUCKET=arthiksetu-prd.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654:web:abcd
```
In `firebase.ts`, the application verifies these variables to confirm configuration validity before connecting.

### Security Considerations
No database connection details or private admin keys are hardcoded in the client bundle. The frontend client only utilizes standard OAuth endpoints.

---

## 8. AI/Gemini Integration

ArthikSetu uses **Google Gemini 2.5 Flash** for its AI features.

### Prompts & Core System Directives

#### 1. SMS parsing (`parse_sms_with_ai`):
Instructs the model to parse transaction text and return structured JSON:
```
Analyze this SMS message and extract financial transaction information.
SMS: {msg}
Return a JSON object with these fields: amount, merchant, type ("credit"/"debit"), date, description.
Only return the JSON, no markdown formatting.
```

#### 2. Verification prompt (`verify_document_with_ai` - Identity Cards):
Directs the model to act as a document verification AI with strict validation criteria for Indian document layouts, logos, and check digits:
- **PAN Format Check:** Verifies the `5 uppercase letters + 4 digits + 1 uppercase letter` sequence.
- **Aadhaar Format Check:** Validates the standard 12-digit format and check digits, rejecting simple text screenshots.
- **Logo Detection:** Looks for headers like "INCOME TAX DEPARTMENT" or "Unique Identification Authority of India (UIDAI)".

#### 3. AI Chat Assistant prompt (`chat_with_ai_assistant`):
Configures the chatbot as "ArthikSetu Assistant", instructing it to use natural Hinglish, format responses with bullet points, and offer advice on gig-economy taxes, schemes, and loan options.

---

## 9. Security & Privacy

### Digital Personal Data Protection (DPDP) Act 2023 Compliance
- **Data Minimization (Section 6):** Only the document name and last 4 digits of ID numbers are processed and displayed. Full Aadhaar or PAN numbers are masked immediately after extraction.
- **Right to Erasure (Section 12):** The "Nuclear Option" on the Privacy Dashboard permits users to permanently delete all server-side records instantly.
- **Consent Control (Section 5):** Features granular permission switches to enable or disable individual services (SMS scanning, document verification, location lookup) at any time.

### Document Masking & In-Memory Pipeline
- Uploaded files are sent as multipart forms to FastAPI, which reads the file bytes directly into RAM as a `bytes` buffer.
- These bytes are processed in memory and sent to Google Gemini as base64 string segments.
- The image is deleted from memory immediately after processing, leaving no physical footprint on the server.
- The backend masks the extracted ID, and the frontend further filters it:
  ```typescript
  apiResult.extracted_id_masked = 'X'.repeat(raw.length - 4) + ' ' + raw.slice(-4);
  ```

### Cross-Origin Resource Sharing (CORS)
CORS is restricted to authorized origins:
```python
origins_env = os.getenv("ALLOWED_ORIGINS", "")
# Configured dynamically for localhost ports and production URLs
```

---

## 10. Complete User Flow

```
+---------------------------------------------------------+
|                  1. Entry & Google Auth                 |
|      User lands on AuthPage, authenticates via popup     |
+----------------------------+----------------------------+
                             |
                             v
+---------------------------------------------------------+
|                  2. Dashboard Access                    |
|    Retrieves profile and loads in-memory income store    |
+----------------------------+----------------------------+
                             |
                             +------------------------+
                             |                        |
                             v                        v
+---------------------------------------+  +-------------------------------------+
|         3. Smart SMS Scan            |  |         4. AI Assistant Chat        |
|  Pastes message block to process      |  |  User asks questions in Hinglish;  |
|  credits and check for debit alerts   |  |  receives context-aware response   |
+----------------------------+----------+  +-------------------------------------+
                             |
                             v
+---------------------------------------------------------+
|                5. Verify Income Proof                   |
|   Uploads document to OCR and updates income passport   |
+----------------------------+----------------------------+
                             |
                             v
+---------------------------------------------------------+
|                6. Discover Welfare                      |
|      Filters government schemes and matching loans      |
+----------------------------+----------------------------+
                             |
                             v
+---------------------------------------------------------+
|                    7. Data Control                      |
|    Downloads financial JSON or wipes records to logout  |
+---------------------------------------------------------+
```

---

## 11. Important Technical Concepts

### React Hooks
- **useState:** Tracks local page states, active tabs, modal visibility, and text fields.
- **useEffect:** Triggers data fetching when components mount and cleans up asynchronous listeners.
- **useCallback:** Memorizes functions (e.g., `refreshEarnings`) to prevent unnecessary component re-renders.

### State Management (React Context API)
The application uses `EarningsContext` to share financial state across components (Dashboard, Tax Page, Loans).
- **Consumer Hooks:** Components consume state using `useEarnings()`.
- **Global Refreshes:** `refreshEarnings` updates state across all views simultaneously when new data is parsed.

### FastAPI & Asynchronous Routing
- Uses `async def` endpoints.
- Processes blocking I/O calls (such as calling the Gemini API) in separate execution threads using `asyncio.to_thread` to maintain server responsiveness.

### Vite, Tailwind CSS, & Recharts
- **Vite:** Uses SWC (Speedy Web Compiler) for fast builds.
- **Tailwind CSS:** Implements mobile-first layouts using responsive grid styles.
- **Recharts:** Uses SVG components to render interactive charts dynamically.

---

## 12. Common Interview Questions & Answers

### General & Project Overview
#### Q1: Can you describe the core objective of the ArthikSetu project?
**A:** ArthikSetu is a wellness fintech platform designed for unorganized gig workers in India. It aggregates income across platforms like Swiggy, Zomato, Uber, and Ola, processes transaction SMS messages with AI, and creates a verified "Income Passport" that workers can present to banks to access formal credit.

#### Q2: What specific problem faced by Indian gig workers does this project solve?
**A:** Gig workers often face financial exclusion because their income is fragmented across multiple apps and they lack traditional salary slips. ArthikSetu consolidates these earnings and verifies them using AI-powered OCR to create an audit-safe income statement.

#### Q3: How does the application identify who the current user is?
**A:** The application stores the user's authenticated email in the browser's `localStorage` after a successful Google Sign-In via Firebase. This email is sent as an `x-user-email` header in all API requests, allowing the backend to isolate user data.

#### Q4: Why is there a need for a "Message Decoder" feature?
**A:** Financial terms and banking SMS alerts are often written in complex jargon. The Message Decoder translates these messages into simple Hinglish (Hindi + English) to help users understand their transactions.

#### Q5: Who are the primary competitors to a platform like ArthikSetu, and how is it different?
**A:** Competitors include traditional income trackers and bookkeeping apps. ArthikSetu distinguishes itself through its privacy-first, zero-storage document verification pipeline, conversational AI Assistant, and automated government scheme eligibility checks.

#### Q6: How does the platform benefit financial institutions like banks?
**A:** Banks gain access to a standardized, verified income document (the "Income Passport") containing OCR confidence scores, reducing underwriting risks for micro-loans.

---

### Architecture & Tech Stack
#### Q7: Why did you choose FastAPI over Flask or Django for the backend?
**A:** FastAPI is built on ASGI, making it natively asynchronous. This allows it to handle concurrent, blocking tasks (such as calling the Gemini API or processing images) more efficiently than WSGI-based frameworks like Flask.

#### Q8: Why did you select Vite over Create React App (CRA) for the frontend?
**A:** Vite uses ES-module imports and a Rust-based compiler (SWC), offering significantly faster startup times and build speeds compared to CRA's Webpack configuration.

#### Q9: What is the purpose of using React Context API in the frontend?
**A:** It acts as a single source of truth for the user's earnings data. Components like the Dashboard, Tax Calculator, and Loan Tracker consume this context and update dynamically whenever new data is added.

#### Q10: How does the mobile application read SMS messages?
**A:** The Android React Native application uses the `react-native-get-sms-android` package to access incoming text messages and uploads them to the FastAPI server for parsing.

#### Q11: Explain the data flow when a user uploads a document for verification.
**A:** The frontend sends the image file as a multipart form request to the backend. FastAPI stores the file bytes in RAM, processes them using Gemini Vision, masks the extracted ID, and returns the result, deleting the image from memory.

#### Q12: Why did you choose to implement an in-memory data store instead of a persistent database?
**A:** An in-memory store aligns with a zero-storage privacy architecture, ensuring that sensitive financial details and document images are never written to physical disk storage on the server.

---

### Frontend Development & React
#### Q13: What are the advantages of using TypeScript in this project?
**A:** TypeScript enforces type safety for API request payloads and component states, helping to catch bugs and runtime errors during development.

#### Q14: How does the Document Verification component handle live user feedback?
**A:** It uses an asynchronous loop with `setTimeout` to update a `stepStatuses` array state, displaying progress indicators for each phase of the verification process in real-time.

#### Q15: How does the application handle PDF generation?
**A:** It uses `jsPDF` and `jsPDF-AutoTable` to draw a formatted table of verified income sources, calculate totals, and add a "Verified" seal for the user to download.

#### Q16: How did you ensure the dashboard is mobile-responsive?
**A:** The application uses Tailwind CSS responsive grid styles and Recharts' `ResponsiveContainer` to scale charts automatically across different screen sizes.

#### Q17: What does the `useCallback` hook do in `EarningsContext.tsx`?
**A:** It memoizes the `refreshEarnings` function, preventing it from being re-created on every render pass and avoiding infinite update loops.

#### Q18: What is the role of `localStorage` in the Privacy Dashboard?
**A:** It stores user permissions (e.g., allowing or denying location access or SMS parsing) locally in the browser, keeping this configuration completely client-side.

---

### Backend Development & FastAPI
#### Q19: How do you prevent blocking the event loop in FastAPI when calling the external Gemini API?
**A:** The application uses `asyncio.to_thread` to run blocking generative AI API calls in a separate thread pool, keeping the main event loop responsive.

#### Q20: Explain the validation mechanism used for API endpoints.
**A:** FastAPI uses Pydantic models to define request schemas. Incoming JSON payloads are automatically validated against these models, returning a `422 Unprocessable Entity` error if fields are missing or malformed.

#### Q21: What is the purpose of the fallback regex parser (`sms_parser.py`)?
**A:** It acts as an offline, rule-based parser that handles standard transactional SMS messages from major Indian banks and delivery platforms without calling the Gemini API.

#### Q22: How does the backend calculate income tax for gig workers?
**A:** It calculates standard deductions and slab-wise tax values based on the New Tax Regime guidelines for the current fiscal year, recommending appropriate tax regimes based on annual earnings.

#### Q23: How does the backend support multi-tenant isolation?
**A:** The backend maps user data in RAM using the `x-user-email` header value as a key, isolating records between different users.

#### Q24: What is the "Nuclear Option" endpoint, and how does it work?
**A:** The `DELETE /api/delete_all_data` endpoint deletes the user's mapped in-memory records and clears active chat histories associated with their email.

---

### AI & Google Gemini Integration
#### Q25: Why did you choose Google Gemini 2.5 Flash over other LLMs?
**A:** Gemini 2.5 Flash offers low latency, cost-efficiency, and multimodal support, allowing the platform to analyze both text messages and document images.

#### Q26: How does the platform handle Gemini API rate limits or quota errors?
**A:** The application implements an API key rotation and retry decorator in `gemini_service.py` that rotates through a list of keys and retries the request when hitting `429` errors.

#### Q27: How does Gemini extract data from unstructured documents?
**A:** Gemini Vision processes base64-encoded image strings alongside a detailed prompt, returning structured JSON containing extracted names, IDs, and financial details.

#### Q28: How does the AI Assistant provide personalized scheme recommendations?
**A:** The backend calculates annual income based on the user's current earnings context and sends this data alongside their profile to the scheme finder engine.

#### Q29: How does the message decoder translate banking jargon?
**A:** It uses Gemini to translate complex transaction terms into conversational Hinglish, helping users understand payment notifications and loan details.

#### Q30: How does the AI detect fraudulent SMS alerts?
**A:** The SMS parser checks incoming messages; any debit transaction exceeding a specific threshold (e.g., ₹5,000) is flagged as a potential fraud risk.

---

### Security, Privacy & DPDP Compliance
#### Q31: How does ArthikSetu comply with India's DPDP Act 2023?
**A:** The platform implements data minimization by masking document IDs, uses in-memory processing to avoid storing physical files, and provides a clear data deletion mechanism.

#### Q32: Why is storing uploaded document images considered a security risk?
**A:** Storing identity documents on a server makes it a target for data breaches. ArthikSetu mitigates this risk by processing images in RAM and deleting them immediately.

#### Q33: How does the backend mask sensitive IDs?
**A:** The verification engine extracts the ID number, masks all but the last 4 digits, and deletes the raw ID from the response payload before returning it to the client.

#### Q34: What checks are performed on uploaded files to prevent malicious uploads?
**A:** The server validates the MIME type (allowing only JPEG, PNG, WEBP, and PDF) and limits file sizes to 10MB before processing.

#### Q35: How is CORS configured to secure backend communication?
**A:** CORS middleware restricts API access to authorized domains defined in environment variables, rejecting unauthorized cross-origin requests.

#### Q36: How does the platform secure environment variables?
**A:** Sensitive credentials like Firebase configurations and Gemini API keys are loaded from `.env` files using `python-dotenv` and are never hardcoded in source control.

---

### Operations, HR & Career
#### Q37: What is the main differentiator of this project on a resume?
**A:** It combines AI-powered computer vision (Gemini Vision) with an in-memory, privacy-first architecture that complies with actual regulations like the DPDP Act 2023.

#### Q38: If you had more time, what production database would you use to store encrypted profiles?
**A:** I would use PostgreSQL with pgvector for storing chat embeddings, and encrypt sensitive fields like user names and masked IDs using AES-256 encryption.

#### Q39: How would you monitor the application's performance in production?
**A:** I would integrate Prometheus and Grafana to track endpoint latencies, and use error tracking systems like Sentry to monitor AI service outages.

#### Q40: What was the most challenging technical problem you solved in this project?
**A:** Designing a zero-storage pipeline that uploads, processes, and verifies documents using Gemini Vision in RAM without writing files to disk.

---

## 13. Challenges Faced & Solutions

### Challenge 1: Zero-Storage Document Verification
- **Problem:** Storing physical document images on the server creates security and compliance challenges under the DPDP Act.
- **Solution:** Designed a RAM-only pipeline. Uploaded files are read directly into memory as a `bytes` buffer. The backend processes the bytes, calls the Gemini API using base64 strings, masks the extracted details, and deletes the file reference from RAM immediately.

### Challenge 2: Gemini API Key Outages & Rate Limits
- **Problem:** Free-tier API keys frequently run into `429 Resource Exhausted` limits, which would disrupt document verification or chat services.
- **Solution:** Implemented an API key rotation wrapper in `gemini_service.py` that catches `429` errors, rotates to the next key in the pool, and retries the operation automatically.

### Challenge 3: Parsing Unstructured and Multilingual SMS
- **Problem:** Gig platforms and banks format transaction messages differently, often mixing languages (e.g., Hinglish). Simple regex patterns easily break.
- **Solution:** Created a hybrid parsing system. The backend uses a local regex parser for standard transaction formats, while routing complex or unrecognized messages to Gemini to extract financial details contextually.

---

## 14. Future Scope

1. **ITR-4 Direct Filing:** Integrate with the Income Tax Department's API to allow users to file tax returns directly from the platform.
2. **PostgreSQL Database & AES Encryption:** Transition from in-memory storage to encrypted databases (e.g., PostgreSQL with column-level AES-256 encryption) to support persistent user accounts.
3. **UPI Payment Aggregator:** Partner with payment gateways to allow workers to collect payouts or pay tax bills directly.
4. **Alternative Credit Scoring:** Use the verified earnings data to build custom credit scores for gig workers, helping them secure loans from partner banks.

---

## 15. Deployment Guide

### Environment Variables (.env Configuration)

Create a `.env` file in the `Backend/` directory:
```env
GEMINI_API_KEY=key1,key2,key3
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

Create a `.env` file in the `Frontend/` directory:
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### Running the Backend (FastAPI)
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive API documentation will be available at `http://localhost:8000/docs`.

### Running the Frontend (React Vite)
```bash
cd Frontend
npm install
npm run dev
```
- The application will be available at `http://localhost:5173`.

### Running the Mobile App (Expo)
```bash
cd Mobile
npm install
npx expo start
```
- Open the application on an Android emulator or a physical device using the Expo Go app.

---

## 16. Resume Explanation Section

### "Tell me about your project, ArthikSetu."

> "ArthikSetu is a financial wellness platform designed for India's gig workers. It aggregates fragmented income from platforms like Swiggy, Zomato, Uber, and Ola into a unified dashboard, and extracts earnings details from transaction SMS messages using Google Gemini NLP. 
> 
> To help workers qualify for micro-loans, I built a document verification system using Gemini Vision that processes files entirely in RAM, masks sensitive ID numbers, and deletes the images immediately to comply with the DPDP Act 2023. The stack uses React, Vite, and Recharts on the frontend, and FastAPI with Python on the backend."

---

## 17. HR + Technical Round Preparation

### Key HR Questions
1. **How did you handle conflicts or design decisions during this project?**
   - *Answer:* I balanced user privacy against user convenience. While storing documents would make repeating tasks easier, we chose a zero-storage model to prioritize compliance and security.
2. **What inspired you to build a project for gig workers?**
   - *Answer:* The gig economy is growing rapidly in India, yet workers are often excluded from formal banking systems due to a lack of traditional income documentation.

### Technical Follow-Ups & Cross-Questions
1. **"Since you run in-memory, what happens if the server restarts?"**
   - *Answer:* Currently, sessions are temporary and reset on restart. For production, I would use Redis for fast session storage and PostgreSQL with row-level encryption for persistence.
2. **"How do you prevent SQL injection if you add a database?"**
   - *Answer:* I would use SQLAlchemy ORM parameterization and Pydantic schemas to validate and sanitize inputs before they touch the database.

---

## 18. Final Summary

ArthikSetu is an AI-powered financial platform that consolidates fragmented gig-work earnings, validates documents in RAM, auto-calculates taxes, and discoveries government welfare benefits. By combining React, FastAPI, Google Gemini, and Firebase, the platform offers a secure, compliant tool that helps gig workers build verified financial profiles and access formal banking services.
