<div align="center">
  <h1>🔥 TechGrill</h1>
  <p><strong>The "Cynical" AI Technical Interviewer</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Groq_Llama_3.3-F55036?style=for-the-badge&logo=groq&logoColor=white" />
    <img src="https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=neon&logoColor=black" />
    <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />
  </p>
</div>

---

## 📖 Overview

TechGrill is not your average "friendly" AI chatbot. It is a high-pressure technical interview simulator designed to mimic the intensity of a Senior Engineer round. Unlike other platforms that provide hints, TechGrill is engineered to be brief, cynical, and focused on finding the breaking point of your technical logic.

## ✨ Key Features

* **Adaptive Grilling:** Three distinct difficulty tiers (Junior, Mid, Senior) that adjust the depth of technical follow-up questions.
* **Persona Guardrails:** Custom-built system instructions that prevent the AI from giving away answers, forcing the candidate to solve problems independently.
* **Persistent Transcripts:** Every session is saved to a serverless PostgreSQL database, allowing for post-interview review and grading.
* **Automated Evaluation:** Once the AI identifies the candidate's ceiling, it triggers a structured scorecard analyzing code quality, communication, and resilience.

## 🛠️ Technical Deep Dive

### 1. State-Driven Interview Flow
TechGrill uses a specialized "Exit Signal" logic within the prompt engineering layer. Once the LLM determines it has sufficient data (typically after 4-5 rounds of technical grilling), it emits a specific token sequence to gracefully transition the UI from "Chat" to "Evaluation" mode.

### 2. Resilient Infrastructure
- **Real-Time Inference:** Powered by **Groq**, providing sub-500ms response times to maintain a natural conversational flow.
- **Fail-Open Strategy:** Implemented robust error handling for API and database connections to ensure the interview experience isn't interrupted by infrastructure flickers.
- **Serverless Persistence:** Utilizes **Neon Postgres** with **Drizzle ORM** for atomic updates to interview records and session metadata.

### 3. Frontend Architecture
- **Split-Screen IDE:** A responsive UI featuring a code editor alongside the "Grill" chat for a realistic development environment.
- **Next.js Server Actions:** Securely handles API interactions and database writes without exposing sensitive logic to the client.
