ServiceNow ITSM — AI Incident Summarizer (Now Assist–style Demo)
Overview
This project is a personal portfolio build demonstrating a Now Assist–style AI capability within ServiceNow ITSM, built on a Personal Developer Instance (PDI). Since Now Assist's native generative AI connection is licensed and not available on standard PDIs, this project simulates the same architecture and user experience using a direct integration with an external LLM (OpenAI) via ServiceNow's RESTMessageV2 API.
The goal was to demonstrate the underlying skills that power Now Assist AI Skills — prompt design, secure REST integration, structured AI output, and surfacing that output natively inside the ServiceNow UI — rather than relying on ServiceNow's out-of-the-box (licensed) Now Assist connection.
Problem Statement
Service desk agents often spend significant time reading through long incident descriptions and work note histories to understand the current state of a ticket before acting on it. This project adds a one-click "Summarize with AI" action on the Incident form that generates a concise, agent-friendly summary of the incident — the same problem Now Assist's native Incident Summarization skill is designed to solve.
Architecture
Agent (Incident form, Agent Workspace)
        │
        ▼
UI Action: "Summarize with AI"
        │
        ▼
Script Include: AIIncidentAssistant
   - Pulls short_description, description, work_notes
   - Builds a structured prompt
        │
        ▼
RESTMessageV2 → OpenAI Chat Completions API (gpt-4o-mini)
        │
        ▼
Response parsed → written to custom field (u_ai_summary)
        │
        ▼
Incident form refreshes, agent sees AI-generated summary
What's Real ServiceNow vs. Simulated
Component	Status
Incident Management, Agent Workspace, form configuration	Real, native ServiceNow
UI Action, Script Include, custom field	Real, built from scratch
REST integration pattern (RESTMessageV2, sys_properties credential storage)	Real, production-pattern ServiceNow integration development
The AI Skill itself (summarization logic)	Simulated — calls OpenAI directly instead of ServiceNow's native, licensed Now Assist LLM connection, which isn't available on a Personal Developer Instance
This distinction is called out deliberately. The integration pattern (secure credential storage, REST call, structured prompt, response handling, writing back to the platform) is the same skill set required to build and extend real Now Assist AI Skills in a licensed environment.
Tech Stack
ServiceNow (Personal Developer Instance) — Incident Management, Script Includes, UI Actions, RESTMessageV2
OpenAI API (gpt-4o-mini) — external LLM for summarization
JavaScript (Server-side, ES5)
Setup / How to Reproduce
Provision a ServiceNow PDI at developer.servicenow.com
Add a custom field u_ai_summary (string, multi-line, 4000 chars) to the incident table
Store an OpenAI API key in sys_properties as a password2 type field (never hardcode credentials in scripts)
Create the AIIncidentAssistant Script Include (see /scripts/AIIncidentAssistant.js)
Create the Summarize with AI UI Action on the Incident form (see /scripts/SummarizeWithAI_UIAction.js)
Add AI Summary field to the Incident form layout
Open any incident with a few work notes, click Summarize with AI, confirm the summary populates
Screenshots
See /screenshots:
Inc-without-summary.png — Incident form showing the UI action button availability ""Summarize with AI"
Inc-with-Summary.png — Incident form showing the populated AI Summary field
Script-include-Config.png — AIIncidentAssistant Script Include code
UI-Action-Config.png — UI Action configuration

Files
├── README.md
├── update-set/
│   └── AI_Incident_Assistant.xml
├── scripts/
│   ├── AIIncidentAssistant.js
│   ├── SummarizeWithAI_UIAction.js
└── screenshots/
    ├── Inc-without-summary.png
    ├── Inc-with-Summary.png
    └── UI-Action-Config.png
    └── Script-include-Config.png
Author
Pallabini Sahoo Senior ServiceNow Developer | 10+ years enterprise ServiceNow experience [www.linkedin.com/in/
pallabinimichigan/ +1 2487971877]
