# Pending phases: Stage 2, Stage 3, Voice

Stripe LIVE stays out of scope (waiting for keys).

## Stage 2 - AI models and authorization

1. **Automatic model per agent type**
   - Default mapping: Customer care -> ChatGPT (`openai/gpt-6-astra`), Bookings -> Gemini (`google/gemini-3.8-flash`), Sales -> ChatGPT, Admin -> Gemini, Image/Design -> Nano Banana (`google/gemini-3.1-flash-image`).
   - When a new agent is created, the model is chosen from its type. The owner can still change it.
2. **Multi-model selector in Admin / Agent Manager**
   - Dropdown per agent: ChatGPT, Gemini, Nano Banana (images only).
   - Grok is shown as "Coming soon" (disabled): it is not available through the built-in AI service. It can be enabled later with an xAI key.
3. **"Authorize / Reject" buttons for actions**
   - The agent no longer guesses from its text. It proposes real actions (create booking, send message, send proposal) as structured "proposed actions".
   - Each one is saved as pending and shown in chat as a card with **Authorize** and **Reject**. The action only runs after Authorize. Every decision is logged.

## Stage 3 - B2B Sales Agent

4. **Prospecting screen** (dashboard, sales tier)
   - Search by city, postal code and business type.
   - The AI returns candidate businesses with their public contact details (website, public email or phone). Results are saved as leads.
   - Lead list with statuses: new -> proposal drafted -> authorized -> sent -> replied.
5. **Custom proposals with consent**
   - The AI writes a proposal for each lead's business type. Nothing is sent without clicking Authorize.
   - Real sending by email needs the email domain (already pending). Until then, "Send" copies the text or opens the mail app.
   - Scope note: the leads come from public information that the AI knows about. They are not a live scrape of Google Maps. Live map data would need a Google Places key later.

## Voice

6. **RODES voice agent as a configurable agent**
   - A "Voice Receptionist" agent is seeded for each business, using the full RODES prompt from the PDF: greeting -> language detection -> date/time request -> availability check -> sense check -> confirmation.
   - It can be edited from the Agent Manager like the others.
7. **Real-time availability in voice**
   - The voice webhook checks free slots (using the existing availability check) before confirming.
   - If the slot is taken, it answers with the 3 nearest free alternatives. It confirms only after the check and the caller's "yes".

## Technical details

- Migration: `agent_actions` table (agent_id, conversation_id, business_id, type, payload jsonb, status pending/approved/rejected/executed/failed, decided_by, decided_at), plus `b2b_leads` table. Both get GRANTs and RLS scoped to the business owner and admins. Voice agent seed added to `ai_agents` with `agent_type` extended to include `voz` and `diseno`.
- `agent-chat` edge function: migrate to AI SDK + gateway. It uses the Responses API for `openai/*` and chat completions for Gemini. Tools are defined with `needsApproval`-style flow: a tool call becomes an `agent_actions` row instead of running.
- New `agent-action-execute` function: runs an approved action server-side after verifying ownership.
- New `b2b-prospect` function: structured output for leads and proposal drafts.
- `voice-booking-webhook`: loads the business's voice agent prompt and calls `check-availability` logic before `flowcore_create_reservation`.
- UI: AgentManager model selector + type defaults, AgentChat action cards, new `B2BSalesApp` sheet in the dashboard.
