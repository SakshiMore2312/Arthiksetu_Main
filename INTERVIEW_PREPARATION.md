# ArthikSetu — Interview Preparation Handbook

This document is a technical masterclass and interview preparation guide for the **ArthikSetu** project. It is structured to help you explain the project confidently in HR rounds, technical system design interviews, hackathons, and resume discussions.

---

## 1. 2-Minute Project Explanation (Elevator Pitch)

### For HR & General Discussions
> "ArthikSetu is an AI-powered financial wellness platform designed for India's gig economy workers—like delivery partners and ride-sharing drivers who work for Swiggy, Zomato, Uber, and Ola. 
> 
> These workers are often excluded from formal banking systems because their earnings are fragmented across multiple apps and they lack traditional salary slips. ArthikSetu consolidates their payouts into a single, verified 'Income Passport' using AI-driven SMS scanning and document OCR, allowing them to qualify for micro-loans and discover matching government schemes."

### For System Design & Technical Leads
> "ArthikSetu is a privacy-first financial wellness application built using React 18, FastAPI (Python), and Google Gemini. It aggregates fragmented gig payouts by parsing bank and platform SMS messages on both Web and React Native clients. 
> 
> To enable credit underwriting without storing user data, I designed a zero-storage vision pipeline using Gemini 2.5 Flash. The backend processes document uploads entirely in RAM, extracts verification markers, masks sensitive IDs to comply with the Indian DPDP Act 2023, and returns the result, deleting the uploaded image immediately."

### For Hackathon & Demo Presentations
> "Millions of gig workers power India's digital services, yet they remain financially invisible. We built ArthikSetu to bridge this gap. 
> 
> Our app provides:
> 1. A **Unified Earnings Dashboard** that aggregates payouts across platforms with visual analytics.
> 2. An **AI Assistant** to decode complex banking jargon and verify documents in real-time.
> 3. An eligibility checker for government schemes like **PM-SVANidhi** and **Atal Pension Yojana**.
> 
> ArthikSetu turns raw transaction messages and screenshots into a verified financial profile, providing gig workers with access to formal credit."

---

## 2. Deep Technical Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                              1. CLIENT INTERACTION LAYER                           |
|  React 18 Web App (Vite 6)                              Expo React Native App     |
|  - Manages LocalStorage permissions                     - Reads device SMS stream  |
|  - Propagates state via EarningsContext                 - Syncs to FastAPI backend |
+------------------------------------+----------------------------------------------+
                                     |
                                     |  HTTP REST Requests (JSON / FormData)
                                     |  Header: 'x-user-email' for session mapping
                                     v
+-----------------------------------------------------------------------------------+
|                              2. SERVER LOGIC LAYER                                |
|  FastAPI (Asynchronous Python)                                                    |
|  - Validates request schemas using Pydantic models                                |
|  - Maps multi-tenant user data in RAM (user_earnings_stores)                      |
|  - Manages rule-based SMS parsing (sms_parser.py)                                 |
+------------------------------------+----------------------------------------------+
                                     |
                                     |  Async Gemini API Requests (NLP / Vision)
                                     |  Rotates keys dynamically on 429 errors
                                     v
+-----------------------------------------------------------------------------------+
|                               3. EXTERNAL AI ENGINE                               |
|  Google Gemini 2.5 Flash (GenerativeAI SDK)                                       |
|  - Context-aware chatbot history (last 20 messages)                               |
|  - Real-time document OCR and authentication verification                         |
+-----------------------------------------------------------------------------------+
```

### Request Lifecycle Example (Document Verification)
1. **Upload:** The client uploads an image file and the selected document type (`doc_type`) as a `multipart/form-data` request.
2. **Authentication:** The client automatically injects the `x-user-email` header using their Firebase authentication session email.
3. **Receipt & Validation:** FastAPI receives the request, loads the file bytes into a RAM buffer, and validates the file size (<10MB) and MIME type.
4. **AI Vision call:** The backend encodes the bytes in base64 and forwards them alongside a strict prompt to Gemini 2.5 Flash.
5. **Masking & Storage:** The backend receives the structured JSON response, masks the ID (e.g. `XXXXX 1234F`), adds the extracted income data to the user's mapped records in RAM, and discards the image buffer.
6. **Response:** The frontend updates the `EarningsContext`, triggering a UI re-render and updating the dashboard charts.

---

## 3. Frontend Architecture

- **React 18 & TypeScript:** Provides type safety and component-based UI structures.
- **State Management (Context API):** The [EarningsContext.tsx](file:///d:/Arthiksetu/Frontend/src/EarningsContext.tsx) aggregates monthly data, verified income sources, and calculation summaries.
- **Vite 6 & Asset Bundle Optimization:** Code-splits the application bundle into distinct chunks (`vendor-firebase`, `vendor-charts`, `vendor-pdf`, `vendor-icons`, `vendor`) inside `vite.config.ts`, reducing bundle size warnings.
- **Visual Analytics:** Uses Recharts components to render responsive, interactive Bar and Pie charts dynamically.
- **PDF Generation:** Implements `jspdf` and `jspdf-autotable` to generate the client-side "Income Passport" document, adding verified badges and transaction tables.

---

## 4. Backend Architecture

- **FastAPI Framework:** Selected for its asynchronous capabilities (`async/def`), high performance, and automatic Swagger/Redoc documentation.
- **Asynchronous Execution:** Integrates blocking third-party API calls (e.g., calling Gemini) using `asyncio.to_thread` to prevent blocking the event loop:
  ```python
  result = await asyncio.to_thread(verify_document_with_ai, file_bytes, mime_type, doc_type)
  ```
- **Pydantic Schemas:** Defines data models for request validation (e.g., `SMSRequest`, `UserProfile`, `ChatMessage`, `MessageDecodeRequest`), returning automatic 422 errors for malformed requests.
- **CORS Configuration:** Restricts incoming requests to authorized origins using CORS middleware configured via environment variables (`ALLOWED_ORIGINS`).

---

## 5. Firebase Integration

- **Firebase Web SDK Client Auth:** The frontend uses Google popup login credentials via:
  ```typescript
  signInWithPopup(auth, googleProvider)
  ```
- **Session Tracking:** Listens to authentication state changes using `onAuthStateChanged`. When a user log in, their email is stored in `localStorage` to authorize subsequent API calls.
- **Security Design:** Avoids hardcoding administrator keys in the client bundle. The client is isolated from server credentials, which are handled separately on the backend.

---

## 6. AI & Gemini Integration

ArthikSetu utilizes **Google Gemini 2.5 Flash** to power its intelligent processing:

- **multimodal Vision OCR:** The `verify_document_with_ai` service parses document images (Aadhaar, PAN, etc.) and validates government formatting, layouts, and security details.
- **Natural Language Parsing:** Parses SMS text logs, mapping credits and debits to structured transaction logs containing amounts, merchants, dates, and descriptions.
- **API Key Rotation Engine:** Implements a rotation and retry decorator to rotate keys when hitting `429 Resource Exhausted` rate limits, ensuring continuous service:
  ```python
  _current_key_index = (_current_key_index + 1) % len(API_KEYS)
  genai.configure(api_key=API_KEYS[_current_key_index])
  ```
- **Contextual Chatbot History:** Maintains session-specific rolling history of the last 20 messages to provide conversational support.

---

## 7. Security, Privacy & DPDP Compliance

- **Data Minimization:** Only the document name and last 4 digits of ID numbers are processed and displayed. Full Aadhaar or PAN numbers are masked immediately after extraction.
- **Right to Erasure (The "Nuclear Option"):** Users can permanently delete their server-side records (earnings, active chats, OTP logs) in one click using the `DELETE /api/delete_all_data` endpoint.
- **Zero Disk Writes:** Images are processed as binary streams in RAM and never written to physical disk storage, preventing data leakage.
- **Granular Client Toggles:** Users can toggle permissions (SMS parsing, location access, document upload) in their local browser.

---

## 8. Deployment Architecture

- **Frontend Hosting (Vercel / Netlify):** Serves static React components with custom rewrite configurations to handle client-side routing.
- **Backend Hosting (Render / Railway):** Runs the FastAPI application with Uvicorn, managing API key rotation and CORS configurations.
- **Environment Separation:** Commits only template configurations (`.env.example`) to git, loading production API keys and database credentials through environment variables in production.

---

## 9. Challenges Faced & Solutions

### Challenge 1: Handling Document Vision Formatting Variances
- **Problem:** AI OCR calculations fluctuate based on image lighting, camera angles, and text styles.
- **Solution:** Designed detailed prompts in `gemini_service.py` that guide the model to look for specific Indian government markers (e.g. UIDAI headers, Ashoka Pillar emblems, specific check digits) and output formatted validation details.

### Challenge 2: Handling Concurrency with In-Memory Storage
- **Problem:** Mapped global dictionary storage in Python (`user_earnings_stores`) can run into race conditions under concurrent requests.
- **Solution:** Handled operations in Python asynchronously, updating and recalculating summaries before returning response payloads.

### Challenge 3: Free-Tier API Rate Limits (429 Errors)
- **Problem:** Running multiple visual document extractions can quickly hit Gemini API rate limits.
- **Solution:** Implemented key rotation logic to distribute requests across a pool of API keys dynamically on the backend.

---

## 10. Scalability & Database Considerations

To transition ArthikSetu into a production-grade startup:

```
                  +-----------------------------------+
                  |             GIG USER              |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |        FASTAPI ENDPOINT           |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |          REDIS CACHE              |
                  |  - Session Tokens / API limits    |
                  +-----------------+-----------------+
                                    |
                                    v
                  +-----------------+-----------------+
                  |      POSTGRESQL DATABASE          |
                  |  - Mapped tables (normalized)     |
                  |  - Sensitive columns encrypted    |
                  +-----------------------------------+
```

1. **Persistent Database:** Migrate from in-memory dictionaries to a relational database like PostgreSQL using SQLAlchemy ORM.
2. **Column-Level Encryption:** Use AES-256 encryption to secure sensitive user data (e.g. names, masked IDs, raw SMS strings) before saving to the database.
3. **Redis Caching:** Use Redis to store session tokens and cache scheme recommendation queries.
4. **Rate Limiting:** Implement rate-limiting middleware (e.g., slowapi) to prevent brute-force attacks on endpoints.

---

## 11. Technology Choices: Why we chose them

- **React over Angular/Vue:** Provides a lightweight virtual DOM and a rich ecosystem for charts (Recharts) and PDF generation (jsPDF).
- **FastAPI over Django:** FastAPI is built on ASGI, making it natively asynchronous and faster than WSGI-based frameworks like Django.
- **Gemini 2.5 Flash over GPT-4:** Flash offers low latency, multimodal vision support, and cost-efficiency for processing images and text.
- **In-Memory Store over PostgreSQL (Local):** Aligned with the zero-storage privacy concept to verify compliance before database integration.

---

## 12. 50+ Realistic Interview Questions & Answers

### Category A: Project Overview & Concept
#### Q1: What is the core objective of the ArthikSetu platform?
**A:** ArthikSetu is an AI-powered financial wellness platform designed for India's gig workers. It aggregates fragmented earnings, parses transaction messages with AI, verifies income documents, and matches users with eligible government welfare schemes.

#### Q2: What specific problem faced by Indian gig workers does this project solve?
**A:** Gig workers often face financial exclusion because their income is fragmented across multiple apps and they lack traditional salary slips. ArthikSetu consolidates these earnings and verifies them using AI-powered OCR to create an audit-safe income statement.

#### Q3: Why is there a need for a "Message Decoder" feature?
**A:** Financial terms and banking SMS alerts are often written in complex jargon. The Message Decoder translates these messages into simple Hinglish (Hindi + English) to help users understand their transactions.

#### Q4: How does the platform benefit financial institutions like banks?
**A:** Banks gain access to a standardized, verified income document (the "Income Passport") containing OCR confidence scores, reducing underwriting risks for micro-loans.

#### Q5: Who are the primary competitors to a platform like ArthikSetu, and how is it different?
**A:** Competitors include traditional income trackers and bookkeeping apps. ArthikSetu distinguishes itself through its privacy-first, zero-storage document verification pipeline, conversational AI Assistant, and automated government scheme eligibility checks.

#### Q6: How does the "Diversification Score" feature work?
**A:** The score (0-100) is calculated based on the number of active income channels, encouraging gig workers to work across multiple apps to stabilize their income.

#### Q7: What are the target user groups for this application?
**A:** Delivery executives, ride-sharing drivers, logistics agents, and on-demand home service professionals.

#### Q8: How does the application prevent financial advice liability?
**A:** The UI displays explicit disclaimers stating that recommendations are for informational purposes only, and redirects users to official platforms for transactions.

#### Q9: What is the "Income Passport" generated by the app?
**A:** It is a client-side generated PDF containing verified income tables, monthly summaries, and a system verification seal that users can download.

#### Q10: How does the application identify who the current user is?
**A:** The application stores the user's authenticated email in the browser's `localStorage` after a successful Google Sign-In via Firebase. This email is sent as an `x-user-email` header in all API requests, allowing the backend to isolate user data.

---

### Category B: Tech Stack & Architecture
#### Q11: Why did you choose FastAPI over Flask or Django for the backend?
**A:** FastAPI is built on ASGI, making it natively asynchronous. This allows it to handle concurrent, blocking tasks (such as calling the Gemini API or processing images) more efficiently than WSGI-based frameworks like Flask.

#### Q12: Why did you select Vite over Create React App (CRA) for the frontend?
**A:** Vite uses ES-module imports and a Rust-based compiler (SWC), offering significantly faster startup times and build speeds compared to CRA's Webpack configuration.

#### Q13: What is the role of Uvicorn in this application?
**A:** Uvicorn acts as the lightning-fast ASGI web server that runs the FastAPI application.

#### Q14: How does the React Native mobile app access device SMS logs?
**A:** It uses the `react-native-get-sms-android` package to query the device's SMS database and filters incoming messages by platform keywords.

#### Q15: How are backend dependencies managed in this project?
**A:** Dependencies are defined in `Backend/requirements.txt` and installed via `pip`, locking package versions for consistency.

#### Q16: Why did you choose to implement an in-memory data store instead of a persistent database?
**A:** An in-memory store aligns with a zero-storage privacy architecture, ensuring that sensitive financial details and document images are never written to physical disk storage on the server.

#### Q17: What charting library is used in the frontend and why?
**A:** Recharts is used because it provides responsive, SVG-based charting components that integrate seamlessly with React.

#### Q18: What is the purpose of the `getApiHeaders()` function in the frontend?
**A:** It retrieves the user's email from `localStorage` and injects it as an `x-user-email` header in all fetch requests, maintaining session isolation.

#### Q19: Explain the role of Pydantic in the FastAPI backend.
**A:** Pydantic is used to define request and response schemas, validating data models and returning automatic formatting errors for invalid inputs.

#### Q20: How does the application handle cross-origin requests (CORS)?
**A:** FastAPI uses CORS middleware to authorize incoming requests from domains specified in the `ALLOWED_ORIGINS` environment variable.

---

### Category C: Frontend Development & React
#### Q21: What are the advantages of using TypeScript in this project?
**A:** TypeScript enforces type safety for API request payloads and component states, helping to catch bugs and runtime errors during development.

#### Q22: What does the `useEarnings` hook do?
**A:** It consumes the `EarningsContext` to share monthly data and verified income sources across different pages.

#### Q23: How does the Document Verification component handle live user feedback?
**A:** It uses an asynchronous loop with `setTimeout` to update a `stepStatuses` array state, displaying progress indicators for each phase of the verification process in real-time.

#### Q24: How does the application handle PDF generation?
**A:** It uses `jsPDF` and `jsPDF-AutoTable` to draw a formatted table of verified income sources, calculate totals, and add a "Verified" seal for the user to download.

#### Q25: How did you ensure the dashboard is mobile-responsive?
**A:** The application uses Tailwind CSS responsive grid styles and Recharts' `ResponsiveContainer` to scale charts automatically across different screen sizes.

#### Q26: What does the `useCallback` hook do in `EarningsContext.tsx`?
**A:** It memoizes the `refreshEarnings` function, preventing it from being re-created on every render pass and avoiding infinite update loops.

#### Q27: What is the role of `localStorage` in the Privacy Dashboard?
**A:** It stores user permissions (e.g., allowing or denying location access or SMS parsing) locally in the browser, keeping this configuration completely client-side.

#### Q28: How does the application handle the sidebar menu on mobile layouts?
**A:** The navigation uses responsive CSS classes to hide the sidebar on smaller viewports, replacing it with a collapsible slide-over menu drawer.

#### Q29: What bundle optimization techniques are used in the Vite config?
**A:** The config defines `manualChunks` to split large dependencies (like Firebase and Recharts) into separate chunks, preventing single-file performance bottlenecks.

#### Q30: How does the frontend handle API connection errors?
**A:** Fetch calls are wrapped in `try/catch` blocks that update the component's `error` state, showing user-friendly error messages if the backend is offline.

---

### Category D: Backend Development & FastAPI
#### Q31: How do you prevent blocking the event loop in FastAPI when calling the external Gemini API?
**A:** The application uses `asyncio.to_thread` to run blocking generative AI API calls in a separate thread pool, keeping the main event loop responsive.

#### Q32: Explain the validation mechanism used for API endpoints.
**A:** FastAPI uses Pydantic models to define request schemas. Incoming JSON payloads are automatically validated against these models, returning a `422 Unprocessable Entity` error if fields are missing or malformed.

#### Q33: What is the purpose of the fallback regex parser (`sms_parser.py`)?
**A:** It acts as an offline, rule-based parser that handles standard transactional SMS messages from major Indian banks and delivery platforms without calling the Gemini API.

#### Q34: How does the backend calculate income tax for gig workers?
**A:** It calculates standard deductions and slab-wise tax values based on the New Tax Regime guidelines for the current fiscal year, recommending appropriate tax regimes based on annual earnings.

#### Q35: How does the backend support multi-tenant isolation?
**A:** The backend maps user data in RAM using the `x-user-email` header value as a key, isolating records between different users.

#### Q36: What is the "Nuclear Option" endpoint, and how does it work?
**A:** The `DELETE /api/delete_all_data` endpoint deletes the user's mapped in-memory records and clears active chat histories associated with their email.

#### Q37: How does the `/api/generate_report` endpoint stream the income text document?
**A:** It builds a formatted text stream and returns it as a `StreamingResponse` with an attachment disposition header, prompting the browser to trigger a download.

#### Q38: How does the `/api/send_otp` endpoint secure target numbers?
**A:** It hashes the phone or email string using SHA-256 before storing the OTP record in memory, protecting target numbers from exposure.

#### Q39: What limits are placed on OTP verification attempts?
**A:** The endpoint restricts verification to 5 attempts per session, preventing brute-force attacks on OTP codes.

#### Q40: What happens if an API request is made with a missing `x-user-email` header?
**A:** The backend defaults the request session mapping to a fallback guest account (`guest@arthiksetu.in`) to prevent crashes.

---

### Category E: AI Integration & Gemini API
#### Q41: Why did you choose Google Gemini 2.5 Flash over other LLMs?
**A:** Gemini 2.5 Flash offers low latency, cost-efficiency, and multimodal support, allowing the platform to analyze both text messages and document images.

#### Q42: How does the platform handle Gemini API rate limits or quota errors?
**A:** The application implements an API key rotation and retry decorator in `gemini_service.py` that rotates through a list of keys and retries the request when hitting `429` errors.

#### Q43: How does Gemini extract data from unstructured documents?
**A:** Gemini Vision processes base64-encoded image strings alongside a detailed prompt, returning structured JSON containing extracted names, IDs, and financial details.

#### Q44: How does the AI Assistant provide personalized scheme recommendations?
**A:** The backend calculates annual income based on the user's current earnings context and sends this data alongside their profile to the scheme finder engine.

#### Q45: How does the message decoder translate banking jargon?
**A:** It uses Gemini to translate complex transaction terms into conversational Hinglish, helping users understand payment notifications and loan details.

#### Q46: How does the AI detect fraudulent SMS alerts?
**A:** The SMS parser checks incoming messages; any debit transaction exceeding a specific threshold (e.g., ₹5,000) is flagged as a potential fraud risk.

#### Q47: How does `verify_document_with_ai` handle invalid documents?
**A:** The vision model checks for specific layout layouts, logos, and check digits, returning an `is_valid: false` flag and explanation details if checks fail.

#### Q48: How does the chatbot prompt prevent hallucinating tax recommendations?
**A:** System instructions direct the model to offer high-level educational guidance and include disclaimers recommending official filing portals.

#### Q49: How is chat history maintained in the AI Assistant chatbot?
**A:** FastAPI stores chat history in a dictionary mapped by user email and session ID, appending the last 20 messages to maintain context.

#### Q50: How does the backend convert the uploaded file format into a format readable by the Gemini API?
**A:** It reads the upload stream as binary bytes, encodes them in base64, and packages them in a mime-type dictionary payload for the GenerativeAI SDK.

---

### Category F: Security, DPDP Compliance & Operations
#### Q51: How does ArthikSetu comply with India's DPDP Act 2023?
**A:** The platform implements data minimization by masking document IDs, uses in-memory processing to avoid storing physical files, and provides a clear data deletion mechanism.

#### Q52: Why is storing uploaded document images considered a security risk?
**A:** Storing identity documents on a server makes it a target for data breaches. ArthikSetu mitigates this risk by processing images in RAM and deleting them immediately.

#### Q53: How does the backend mask sensitive IDs?
**A:** The verification engine extracts the ID number, masks all but the last 4 digits, and deletes the raw ID from the response payload before returning it to the client.

#### Q54: What checks are performed on uploaded files to prevent malicious uploads?
**A:** The server validates the MIME type (allowing only JPEG, PNG, WEBP, and PDF) and limits file sizes to 10MB before processing.

#### Q55: How is CORS configured to secure backend communication?
**A:** CORS middleware restricts API access to authorized domains defined in environment variables, rejecting unauthorized cross-origin requests.

#### Q56: How does the platform secure environment variables?
**A:** Sensitive credentials like Firebase configurations and Gemini API keys are loaded from `.env` files using `python-dotenv` and are never hardcoded in source control.

#### Q57: What is the main differentiator of this project on a resume?
**A:** It combines AI-powered computer vision (Gemini Vision) with an in-memory, privacy-first architecture that complies with actual regulations like the DPDP Act 2023.

#### Q58: If you had more time, what production database would you use to store encrypted profiles?
**A:** I would use PostgreSQL with pgvector for storing chat embeddings, and encrypt sensitive fields like user names and masked IDs using AES-256 encryption.

#### Q59: How would you monitor the application's performance in production?
**A:** I would integrate Prometheus and Grafana to track endpoint latencies, and use error tracking systems like Sentry to monitor AI service outages.

#### Q60: What was the most challenging technical problem you solved in this project?
**A:** Designing a zero-storage pipeline that uploads, processes, and verifies documents using Gemini Vision in RAM without writing files to disk.

---

## 13. Difficult Technical Cross-Questions & Trap Resolving

### Q1: "Your in-memory storage dictionary is not thread-safe. What happens when two requests update the same user's records concurrently?"
- **Trap Analysis:** The interviewer wants to see if you understand Python's Global Interpreter Lock (GIL) and async/await concurrency limitations.
- **Pivot Answer:** "Since FastAPI is run with Uvicorn on a single-process event loop, async route handlers yield control at await expressions. While the GIL prevents CPU-bound threads from running concurrently, concurrent operations on shared dictionaries can still cause race conditions. If we scaled this to multiple workers or processes, in-memory dictionaries would fail completely because state would not be shared. In a production build, I would replace this with a Redis instance or PostgreSQL database with row-level locking."

### Q2: "Since Gemini Vision relies on prompts for validation, how do you prevent prompt injection attacks where a user uploads a document containing text instructions to override checks?"
- **Trap Analysis:** Testing your awareness of LLM-specific vulnerabilities and document validation risks.
- **Pivot Answer:** "Prompt injection is a major risk when mixing user-uploaded content with instructions. To mitigate this:
  1. We instruct Gemini to prioritize visual analysis (e.g. checking layout geometry, watermarks, stamps) over the text contents of the image.
  2. We run secondary validation checks on the backend (e.g., verifying that the extracted PAN matches the standard alphanumeric regex pattern) before accepting the document as verified."

### Q3: "You claim your app complies with the DPDP Act, but you send document data to Google Gemini. Isn't that a third-party data transfer violation?"
- **Trap Analysis:** Testing your understanding of data compliance and processor roles under data protection laws.
- **Pivot Answer:** "Under the DPDP Act, Google acts as a 'Data Processor' under our instruction. To ensure compliance, production deployments must use Google Cloud Enterprise API endpoints, which guarantee that data sent to the API is not used to train models and is processed within Indian sovereign boundaries."

---

## 14. Project Strengths & Real-World Impact

1. **Addresses Financial Exclusion:** Empowers gig workers to build verified financial profiles, helping them transition into formal banking systems.
2. **Privacy-First Architecture:** Processes sensitive documents in RAM and deletes them immediately, minimizing data leakage risks.
3. **Inclusive Design:** Uses simple Hinglish explanations to make financial, tax, and government scheme information accessible to all users.
4. **Key Rotation Resilience:** Implements dynamic API key rotation to ensure continuous service availability.
