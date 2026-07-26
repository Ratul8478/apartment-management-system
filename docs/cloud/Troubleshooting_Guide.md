# Production Troubleshooting & Diagnostics Guide — FinTrack Pro

| Failure Symptom | Probable Root Cause | Resolution Action |
| :--- | :--- | :--- |
| **530 / 500 on /api/health** | Database connection timeout | Check `DATABASE_URL` credentials & Railway container status. |
| **AI Provider Fallback Warning** | Gemini API rate limit | Verify `GEMINI_API_KEY` quota or enable `OPENAI_API_KEY` fallback. |
| **Payment Webhook Failure** | Invalid signature | Check `RAZORPAY_WEBHOOK_SECRET` in environment variables. |
| **Build Memory Exhaustion** | Node heap limit exceeded | Ensure `NODE_OPTIONS="--max-old-space-size=4096"` is set. |
