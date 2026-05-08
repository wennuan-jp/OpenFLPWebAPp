# What is Open FLP
### The Open-Source Ecosystem for Digital Music Archaeology

**Open FLP** is a web-based platform designed to bridge the gap between music production education and technical accessibility. By leveraging modern browser capabilities, it allows producers to share, analyze, and reconstruct project files (FLPs) in a collaborative, community-driven environment.

---

## ## Core Philosophy

The music industry thrives on gatekeeping, yet education has evolved into a primary form of entertainment. Open FLP exists because:
*   **The Demand for Reconstruction:** Remaking instrumentals and EDM tracks is a proven learning method with massive communities on YouTube and Bilibili, yet the assets remain disorganized.
*   **Copyright Resilience:** Open-source music is a challenge. By reverse-engineering sounds into presets, the community can share the *knowledge* of a sound without infringing on the original stems.
*   **Democratizing the "Secret Sauce":** We provide a structured platform to organize the chaos of tutorials, presets, and project files.

---

## ## Technical Features

### **Browser-Native Heavy Computing**
*   **WASM-Powered Audio:** Experience low-latency, high-performance audio processing directly in the browser.
*   **Real-Time Visualization:** Features like EQ wave displays and oscilloscopes run via WebAssembly to ensure smooth performance without taxing your system.

### **The Intelligent Project Explorer**
*   **Missing Asset Detection:** Upload an FLP to highlight exactly which VSTs are used. The system automatically identifies missing plugins and provides direct links to the **VST Vendors**.
*   **"Stack Overflow" for Sound:** Ask specific questions about sound design or request audio reviews for specific notes within a project.
*   **User Asset Management:** Mark the plugins and libraries you own to filter compatible projects and streamline your workflow.

### **Smart Navigation & Connectivity**
*   **Jump-to-Center:** Quick UI navigation to center your view on active project elements.
*   **Buzz Logic:** Intelligent "Buzz" connection checks. The interface only executes "jump" commands once a stable connection is established, preventing UI disorientation.

---

## ## Ecosystem Integration

Open FLP is built to live where producers already work:
*   **GitHub:** Version control for project iterations and preset evolution.
*   **Google Drive:** Seamless cloud storage for large-scale assets and project backups.
*   **VST Vendor Bridge:** A clear business model that connects active learners directly with the tools they need to succeed.

---

## ## Target Audience

1.  **The Remake Producer:** High-level creators who reverse-engineer hits to understand the mechanics of professional sound.
2.  **The Learner/Viewer:** Students who use remakes as a roadmap to improve their own production skills.
3.  **The Community:** Integrating with Reddit and other discussion hubs to foster technical discourse and collective troubleshooting.

---

## ## Why Open FLP?

We are turning the "black box" of music production into an open book. By combining a clear business model—driving traffic to legitimate VST vendors—with a community-led reverse engineering effort, Open FLP is positioned to be the central hub for the next generation of producers.

**Join the reconstruction.**

---

## ## Development

### **Development Modes**

The webapp supports two primary development modes, controlled via environment variables in `.env.development`.

#### **1. Standalone Mode (Default)**
In this mode, the webapp runs without requiring the Go backend or AWS Cognito to be active. It uses high-fidelity mock data and simulated network latency.

*   **How to enable:** Set `VITE_STANDALONE=true` in `.env.development`.
*   **Use case:** UI/UX development, frontend testing, or working in environments without backend access.
*   **Visual Indicator:** A "Standalone" badge will appear in the top navigation bar.

#### **2. Real Backend Mode**
In this mode, the webapp attempts to connect to the local Go server and use real AWS Cognito authentication.

*   **How to enable:** Set `VITE_STANDALONE=false` in `.env.development`.
*   **API URL:** Ensure `VITE_API_URL` points to your running backend (default: `http://localhost:8080`).
*   **Requirement:** You must have the `server` component running and valid Cognito credentials configured.

### **Getting Started**

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  The app will be available at `http://localhost:5173`.