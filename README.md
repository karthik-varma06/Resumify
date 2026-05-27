# Resumify ✨

**Resumify** is a premium, AI-powered resume analysis and tracking application. By leveraging modern AI models and advanced Applicant Tracking System (ATS) scoring logic, Resumify provides actionable feedback to help you tailor your resume to your dream job.

![Resumify UI](https://resumify-preview-image.placeholder) <!-- Note: Replace with actual screenshot -->

## 🌟 Key Features

### 🧠 AI-Powered Resume Insights
- **Smart Text Extraction**: Robust PDF parsing that extracts text directly from your resume, utilizing an OCR fallback (via Puter AI) when needed to guarantee 100% data extraction.
- **ATS Compatibility Score**: Calculates an overall Applicant Tracking System score to ensure your resume passes automated filters.
- **Detailed Category Feedback**: Get in-depth, actionable tips split across four major categories:
  - **Tone & Style**
  - **Content & Clarity**
  - **Structure & Formatting**
  - **Skills & Keyword Optimization**

### 🎨 Premium UI & UX
- **Seamless Dark & Light Modes**: Beautifully tokenized design system using modern CSS variables integrated with Tailwind v4, offering a flawless experience regardless of your theme preference.
- **Cinematic Animations**: Powered by **Framer Motion**, the application features smooth transitions, stagger animations, and reactive hover states for a high-end feel.
- **Dual-Pane Detail View**: An elegant side-by-side view (on larger screens) allowing you to simultaneously view your resume document alongside your AI analysis.

### 💾 Private Dashboard & Data Management
- **Local-First Architecture**: Your resumes and AI feedback are securely stored using the **Puter Key-Value (KV)** store and **Puter File System (FS)** linked exclusively to your Puter account.
- **Resume Tracking**: Automatically saves all previously uploaded resumes so you can easily review past analyses on your Dashboard.
- **Granular Controls**: Selectively delete individual resumes from your tracking history, or securely wipe all data at once with the "Clear All Data" action.

## 🛠️ Technology Stack

- **Framework**: [React Router v7](https://reactrouter.com/) (Full-stack SSR)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **PDF Processing**: `pdfjs-dist`
- **Backend Services (Auth, Storage, AI)**: [Puter.js](https://puter.com/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed. Since this app utilizes Puter.js, no complicated backend configuration or external databases are required—Puter handles Auth, Storage, and AI completely natively in the browser.

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone https://github.com/yourusername/ai-resume-analyzer.git
   cd ai-resume-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory. Resumify primarily relies on Puter's built-in AI, but it is configured to securely fall back to OpenRouter.
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Your application will be running at `http://localhost:5173`.

### Building for Production
Create a production build:
```bash
npm run build
```

Then preview the production build locally:
```bash
npm run start
```

## 🔐 How Data is Handled
Resumify prioritizes user privacy. 
- Authentication is handled seamlessly by **Puter**.
- PDF Files are converted locally and stored in your private **Puter FS**.
- AI analysis results and dashboard metadata are stored in your private **Puter KV** store.
- **You own your data:** You can instantly delete all files and KV traces directly from the Resumify Dashboard.

---

Built with ❤️ to help you land your dream job.
