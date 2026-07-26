# Known Limitations Register — FinTrack Pro

This register documents known system boundaries, edge cases, maximum thresholds, and recommended workaround procedures for FinTrack Pro v1.0.

---

## 1. Documented System Boundaries

1. **Maximum Batch CSV Import Size**: 10,000 transactions per single file upload. Larger uploads must be chunked or processed via background job.
2. **AI Prompt Context Window**: AI completion prompt context is truncated at 12,000 tokens to preserve LLM performance and manage API costs.
3. **PowerBI Report Export Limit**: PowerPoint PPTX generation supports up to 50 detailed slides per single file generation request.

---
