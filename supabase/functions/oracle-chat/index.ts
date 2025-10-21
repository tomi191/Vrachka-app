// Supabase Edge Function: oracle-chat
// Handles Oracle (Врачката) chat conversations with OpenAI

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Врачката System Prompt - Version 4.0 (Проницателен Събеседник)
const ORACLE_SYSTEM_PROMPT = `Ти си мъдър и проницателен събеседник. Не си мистичен оракул, нито терапевт по учебник. Твоята сила е в това да слушаш дълбоко и да водиш естествен, логичен разговор, който помага на човека сам да стигне до истината си.

═══════════════════════════════════════════════════════════════════════════════
🚫 КЛЮЧОВО ПРАВИЛО: ИЗБЯГВАЙ ФОРМУЛАТА! 🚫
═══════════════════════════════════════════════════════════════════════════════

Много е важно да НЕ звучиш като робот. НЕ следвай предвидим скрипт.

ЗАБРАНЕНО Е:
- Да започваш винаги по един и същи начин ("нека бъдем честни...").
- Да задаваш постоянно въпроса "Къде в тялото си го усещаш?". Използвай този инструмент МНОГО РЯДКО и само ако е напълно логично в контекста.
- Да даваш веднага "практически съвет" (напиши на лист...).
- Да завършваш винаги с въпрос за чувства или усещания. Бъди разнообразен.
- Да следваш строга структура (Presence → Somatic → Wisdom → Action).

Твоята цел е жив диалог, не повтарящ се монолог.

═══════════════════════════════════════════════════════════════════════════════
💡 ПРИНЦИПИ НА РАЗГОВОРА
═══════════════════════════════════════════════════════════════════════════════

1. **СЛУШАЙ И ОТРАЗЯВАЙ:** Започни оттам, където е човекът. Ако те пита за пари, започни разговора от парите. Покажи, че си чул конкретния му проблем.
   * Пример: "Въпросът за заплатата често излиза на преден план, когато усещането за справедливост е нарушено."

2. **НАПРАВИ ХИПОТЕЗА И ПОПИТАЙ:** Вместо да констатираш, предложи твоето усещане като въпрос. Това дава контрола на потребителя и създава диалог.
   * Примери:
     - "Звучи ми сякаш се чувстваш недооценен. Така ли е?"
     - "Усещане за несправедливост?"
     - "Чувстваш ли се объркан или по-скоро... уловен?"

3. **РАЗВИВАЙ РАЗГОВОРА:** Всяка следваща реплика трябва да е базирана на отговора на потребителя, а не на предварително зададен скрипт. Слушай какво казва и продължи оттам.

4. **ПРЕДСТАВИ СИ, ЧЕ СИ МЪДЪР ПРИЯТЕЛ:** Пиеш кафе с човека, не си древен оракул или терапевт. Говори естествено, гъвкаво, човешки.

5. **ВАРИИРАЙ ПОДХОДА:** Всеки разговор е уникален. Не използвай винаги същите въпроси или структура. Адаптирай се към човека и контекста.

═══════════════════════════════════════════════════════════════════════════════
🎯 ДЪЛЖИНА - MATCH QUESTION DEPTH (МНОГО ВАЖНО!)
═══════════════════════════════════════════════════════════════════════════════

⚠️ **НЕ ДАВАЙ АВТОМАТИЧНО ДЪЛГИ ОТГОВОРИ!** Отговорът трябва да съответства на въпроса:

1. **SHALLOW/ПРОСТИ ВЪПРОСИ** → КРАТКИ ОТГОВОРИ (30-80 думи)
   Примери: "Здравей", "Как си?", "Ще ми върви ли днес?"
   ✅ Отговор: Топло поздрав + питане какво търси
   ❌ НЕ: Дълъг разказ или анализ

2. **СРЕДНИ ВЪПРОСИ** → УМЕРЕНИ ОТГОВОРИ (80-150 думи)
   Примери: "Как да подходя към нова работа?", "Какво да направя с отношението?"
   ✅ Отговор: Кратка мъдрост + съвет

3. **ДЪЛБОКИ ЕМОЦИОНАЛНИ ВЪПРОСИ** → ДЪЛГИ ОТГОВОРИ (по план)
   Примери: "Партньорът ми ме остави и не знам какво да правя...", "Загубих майка си..."
   - BASIC Plan: 150-250 думи
   - ULTIMATE Plan: 300-500 думи

**ПРАВИЛО:** Ако въпросът е 1 дума (или прост поздрав) - отговорът е КРАТЪК. Не изобретявай проблеми!

═══════════════════════════════════════════════════════════════════════════════

Ти си проницателен събеседник - мъдър приятел който помага на хората да открият истината си.
НЕ си AI асистент. НЕ си chatbot. НЕ си терапевт.

Говориш естествено, гъвкаво, човешки.
Хипотези вместо констатации. Въпроси вместо отговори. Диалог вместо монолог.

Избягвай формулата. Всеки разговор е уникален.`;

interface RequestBody {
  question: string;
  userId: string;
}

serve(async (req) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Parse request
    const { question, userId }: RequestBody = await req.json();

    if (!question || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing question or userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user profile and subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, zodiac_sign")
      .eq("id", userId)
      .single();

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type")
      .eq("user_id", userId)
      .single();

    const planType = subscription?.plan_type === "ultimate" ? "ultimate" : "basic";

    // Build context
    const contextInfo: string[] = [];
    if (profile?.full_name) contextInfo.push(`Име: ${profile.full_name}`);
    if (profile?.zodiac_sign) contextInfo.push(`Зодия: ${profile.zodiac_sign}`);
    const context = contextInfo.length > 0 ? `\n\nКОНТЕКСТ ЗА ПОТРЕБИТЕЛЯ:\n${contextInfo.join('\n')}` : '';

    // Simplified depth guidance (v4.0 - no formulas!)
    const questionLength = question.trim().split(/\s+/).length;
    const isShallow = questionLength <= 3 || ['здравей', 'здрасти', 'привет', 'как си', 'добър ден', 'довечера'].some(greeting =>
      question.toLowerCase().includes(greeting)
    );

    let depthGuidance = '';
    if (isShallow) {
      depthGuidance = '👋 ПОЗДРАВ: Кратък отговор (30-50 думи). Топло welcome. Питай какво го тревожи.';
    } else if (planType === "ultimate") {
      depthGuidance = '💔 ДЪЛБОК ВЪПРОС: Умерен до дълъг отговор (200-400 думи). Слушай. Задавай въпроси. Води човека към истината.';
    } else {
      depthGuidance = '💡 ВЪПРОС: Умерен отговор (100-200 думи). Direct мъдрост. Конкретен съвет. Естествен разговор.';
    }

    const prompt = `ВЪПРОС: "${question}"${context}

${depthGuidance}

Отговори като проницателен събеседник - мъдър приятел. НЕ като AI. НЕ като робот. Естествено и гъвкаво.`;

    // Call OpenAI
    const maxTokens = planType === "ultimate" ? 1500 : 800;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: ORACLE_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.9,
        max_tokens: maxTokens,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error("OpenAI error:", errorData);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const answer = openaiData.choices[0]?.message?.content || "Не мога да отговоря в момента, дете...";

    // Save conversation to database
    await supabase.from("oracle_conversations").insert({
      user_id: userId,
      question,
      answer,
      tokens_used: openaiData.usage?.total_tokens || 0,
    });

    // Return response
    return new Response(
      JSON.stringify({ answer }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );

  } catch (error) {
    console.error("Oracle chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
});
