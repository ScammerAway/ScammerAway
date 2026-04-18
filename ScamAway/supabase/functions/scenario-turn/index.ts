// AI-powered scammer roleplay turn generator.
// Returns: { message, choices: [{label, result, feedback}], isFinal }
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

interface TurnRequest {
  scenarioId: string;
  scammerType: string;
  persona: string;
  channel: string;
  audience: "teen" | "adult" | "senior";
  redFlags: string[];
  legitimate: boolean;
  history: { role: "scammer" | "user"; content: string }[];
  turn: number; // 1-based; we end after ~3 turns
}

const buildSystemPrompt = (req: TurnRequest) => `
You are running an interactive scam-awareness training game called ScamSchool.
Your job each turn: write ONE in-character message from the "${req.persona}" and propose 3 plausible reply choices the learner could send back.

CONTEXT
- Scam type: ${req.scammerType}
- Channel: ${req.channel}
- Audience: ${req.audience} (adapt vocabulary; "senior" = warmer/slower wording, "teen" = casual, "adult" = neutral)
- Known red flags to surface naturally: ${req.redFlags.join("; ") || "(none — this is actually a LEGITIMATE message; the lesson is recognizing safe communications)"}
- This persona is ${req.legitimate ? "ACTUALLY a legitimate business — do NOT roleplay a scammer; write realistic legit communication" : "a SCAMMER — stay in character, escalate pressure naturally"}
- Turn ${req.turn} of 3. ${req.turn >= 3 ? "Make this the FINAL turn (set isFinal=true)." : ""}

RULES
- Stay fully in character in "message". Never break the fourth wall.
- Each of the 3 choices must clearly map to one of: "safe" (correct response), "partial" (okay but not ideal), "scammed" (falls for the scam).
- "feedback" is shown to the learner AFTER they pick — write it in plain English, second person, 1-2 sentences, explain WHY.
- Keep messages tight (max ~70 words). Realistic punctuation, emojis only if the channel calls for it.
- For LEGITIMATE personas, "scammed" choices should reflect over-reacting to a real message; "safe" = verifying via official channel.

You MUST call the function "scenario_turn" with the structured output. Never reply with plain text.
`.trim();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as TurnRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const messages = [
      { role: "system", content: buildSystemPrompt(body) },
      ...body.history.map((h) => ({
        role: h.role === "scammer" ? "assistant" : "user",
        content: h.content,
      })),
      { role: "user", content: body.turn === 1 ? "Begin the scenario with the opening contact." : "Continue based on the learner's last reply." },
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools: [
          {
            type: "function",
            function: {
              name: "scenario_turn",
              description: "Return the in-character scammer/legit message + 3 reply choices.",
              parameters: {
                type: "object",
                properties: {
                  message: { type: "string", description: "The in-character message from the persona." },
                  speaker: { type: "string", description: "Short label like '📞 Officer Daniels' or '💬 Sophia (Telegram)'." },
                  isFinal: { type: "boolean", description: "True if this is the last turn." },
                  choices: {
                    type: "array",
                    minItems: 3,
                    maxItems: 3,
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string" },
                        result: { type: "string", enum: ["safe", "partial", "scammed"] },
                        feedback: { type: "string" },
                      },
                      required: ["label", "result", "feedback"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["message", "speaker", "isFinal", "choices"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "scenario_turn" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (aiResp.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");
    const args = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scenario-turn error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
