# 🌌 World of Warcrest

Welcome to **World of Warcrest**, an advanced environment initialized to follow the **AWS AI-DLC (AI Software Development Life Cycle) framework** and powered by **Antigravity 2.0 (Google Antigravity SDK)**.

---

## 🛠️ Technology Stack & Integrations

- **Core Language**: Python 3.9+
- **AI Agent Orchestration**: Antigravity 2.0 (`google-antigravity` Python SDK)
- **State Management**: Stateful `Conversation` and low-level `Connection` abstractions
- **Lifecycle Framework**: AWS AI-DLC Process Rules (v1.0 Adaptive Lifecycle)
- **Configuration Management**: `.env` parsing via `python-decouple`

---

## 🚀 Quick Start

### 1. Initialize the Environment
We provide an automated setup script that creates a Python virtual environment (`.venv`), upgrades `pip`, and installs all dependencies securely:

```bash
./setup_env.sh
```

Activate the environment in your terminal:
```bash
source .venv/bin/activate
```

### 2. Configure Your API Key
The Google Antigravity SDK uses the Gemini API. You will need a `GEMINI_API_KEY`.
- If you don't have one, create it for free at [Google AI Studio](https://aistudio.google.com/app/api-keys).
- Create a `.env` file in the project root:
  ```bash
  echo 'GEMINI_API_KEY="your_actual_key_here"' > .env
  ```
  *(Or export it in your shell environment: `export GEMINI_API_KEY="..."`)*

### 3. Run the Agent Session
Run the main script to start a session with the immersive World of Warcrest Game Master:

```bash
./main.py
```
*(Or `python3 main.py`)*

---

## 🔵 AI-DLC Framework Compliance

This project is strictly governed by the **AI Software Development Life Cycle (AI-DLC)** rules. 

### Key Folders
- **[.aidlc-rule-details/](file:///Users/andrewwinder/Documents/projects/World of Warcrest/.aidlc-rule-details/)**: Holds the mandatory stage guidelines, welcome messaging, validation schemas, and extension templates.
- **[aidlc-docs/](file:///Users/andrewwinder/Documents/projects/World of Warcrest/aidlc-docs/)**: Tracks project inception/construction states and decision audits.
  - **[aidlc-state.md](file:///Users/andrewwinder/Documents/projects/World of Warcrest/aidlc-docs/aidlc-state.md)**: Current lifecycle state and extension flags.
  - **[audit.md](file:///Users/andrewwinder/Documents/projects/World of Warcrest/aidlc-docs/audit.md)**: Sequential execution and approval audit trail.

### Helper Files
- **[CLAUDE.md](file:///Users/andrewwinder/Documents/projects/World of Warcrest/CLAUDE.md)**: Core instruction set that forces AI coding assistants to follow the adaptive stages and compliance boundaries.
- **[.claude/settings.local.json](file:///Users/andrewwinder/Documents/projects/World of Warcrest/.claude/settings.local.json)**: Local workspace execution permissions.

---

## 🌌 Antigravity 2.0 SDK Architecture

The project features a clean integration of the core Antigravity design pillars:
1. **`Agent`**: High-level config and lifecycle entry point.
2. **`Conversation`**: Manages step histories, turns, and streaming methods.
3. **`Connection`**: Manages the network/transport channel to the model backend (defaults to `gemini-3.5-flash`).

For full details on using custom tools, multi-agent delegation, and periodic hooks, consult the locally loaded Google Antigravity SDK references in `~/.gemini/config/plugins/google-antigravity-sdk/`.
