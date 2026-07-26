# AI UI Component System & Conversational Library

**System Name:** FinTrack Pro Enterprise AI Finance Management Platform  
**Document Type:** AI Copilot UI Component System & Interaction Specifications  
**Author:** Principal AI UX Engineer & Design System Lead  
**Status:** Approved for Implementation  

---

## 1. AI Component Primitives

1. **`AiChatThread`:** Container for conversational prompt and reply bubbles with auto-scroll lock.
2. **`AiMessageBubble`:**
   - *User Bubble:* Right-aligned, primary accent background (`#2F6FED`), white text.
   - *AI Bubble:* Left-aligned, light surface background (`#F5F7FB`), violet avatar badge (`#7C5CFC`).
3. **`AiStreamingText`:** Renders live tokens streamed from Server-Sent Events (SSE) with a blinking cursor indicator.
4. **`AiConfidenceBadge`:** Small pill badge displaying retrieval grounding confidence score (e.g. `98% Verified Data`).
5. **`AiPromptChip`:** Clickable prompt suggestion pill buttons above input field (e.g. *"Summarize Q2 Profit vs Q1"*).
