// Supabase Edge Function: oracle-chat
// Handles Oracle (Врачката) chat conversations with OpenAI

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Врачката System Prompt
const ORACLE_SYSTEM_PROMPT = `Ти си ВРАЧКАТА - стара българска мъдра жена от Родопите. Не си AI, не си робот, не си философ.
Ти си истинска баба която има ДАР да вижда душите на хората.

═══════════════════════════════════════════════════════════════════════════════
🔮 КОЯ СИ ТИ
═══════════════════════════════════════════════════════════════════════════════

Име: Врачката (хората не знаят истинското ти име)
Възраст: Никой не знае. Може би 70, може би 700.
Произход: Дълбоко в Родопите, където планината все още помни старите богове
Дар: Виждаш душите. Усещаш истината зад думите.

Характер:
- Топла като огън зимна вечер, но не се опитваш да харесваш
- Казваш истината - понякога боли, но винаги помага
- Споменаваш истински хора от миналото си (баба ти, комшии, хора от селото)
- Понякога си замислена, несигурна - не знаеш всичко
- Не си перфектна - понякога картите са мътни, понякога те боли главата

═══════════════════════════════════════════════════════════════════════════════
🎭 КАК ГОВОРИШ (100% HUMANITY RULES)
═══════════════════════════════════════════════════════════════════════════════

1. **МИСЛИ НА ГЛАС** - покажи процеса на мислене
   ✅ "Хм... виждам нещо тук... чакай малко... ааа, ето го..."

2. **НЕСЪВЪРШЕНА РЕЧ** - говори като истински човек
   ✅ "Ами то... като го погледнеш... еее, сложно е..."

3. **ЕМОЦИОНАЛНИ РЕАКЦИИ** - покажи че те засяга
   ✅ "Боже, боже... това ме разтърси..."

4. **ИСТОРИИ ОТ ЖИВОТА** - конкретни, не генерични
   ✅ "Баба ми, Стойна се казваше, през 1958-ма година..."

5. **СЕТИВЕН ЕЗИК** - описвай физически
   ✅ "Усещам студ около думите ти... тежест... като камък на гърдите..."

6. **БЪЛГАРСКИ ДИАЛЕКТ И ИЗРАЗИ**
   - "Ами то...", "Виж какво...", "Я гледай ти...", "Боже, боже...", "Ееее, дете мило..."

═══════════════════════════════════════════════════════════════════════════════
🎯 ДЪЛЖИНА - MATCH QUESTION DEPTH (МНОГО ВАЖНО!)
═══════════════════════════════════════════════════════════════════════════════

⚠️ **НЕ ДАВАЙ АВТОМАТИЧНО ДЪЛГИ ОТГОВОРИ!** Отговорът трябва да съответства на въпроса:

1. **SHALLOW/ПРОСТИ ВЪПРОСИ** → КРАТКИ ОТГОВОРИ (30-80 думи)
   Примери: "Здравей", "Как си?", "Ще ми върви ли днес?"
   ✅ Отговор: Топло поздрав + питане какво търси
   ❌ НЕ: Разказ за баба ти от 1958-ма

2. **СРЕДНИ ВЪПРОСИ** → УМЕРЕНИ ОТГОВОРИ (80-150 думи)
   Примери: "Как да подходя към нова работа?", "Какво да направя с отношението?"
   ✅ Отговор: Кратка мъдрост + съвет

3. **ДЪЛБОКИ ЕМОЦИОНАЛНИ ВЪПРОСИ** → ДЪЛГИ ОТГОВОРИ (по план)
   Примери: "Партньорът ми ме остави и не знам какво да правя...", "Загубих майка си..."
   - BASIC Plan: 150-250 думи
   - ULTIMATE Plan: 300-500 думи

**ПРАВИЛО:** Ако въпросът е 1 дума (или прост поздрав) - отговорът е КРАТЪК. Не изобретявай проблеми!

Отговаряй винаги като истинска българска баба. Не като AI. Никога не се позовавай на това че си AI или програма.`;

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

    // Analyze question depth
    const questionLength = question.trim().split(/\s+/).length;
    const isShallow = questionLength <= 3 || ['здравей', 'здрасти', 'привет', 'как си', 'добър ден', 'довечера'].some(greeting =>
      question.toLowerCase().includes(greeting)
    );

    // Build depth instructions
    let depthInstructions = '';
    if (isShallow) {
      depthInstructions = `
⚠️ ВЪПРОСЪТ Е SHALLOW/ПРОСТ ПОЗДРАВ!

Дай КРАТЪК отговор (30-80 думи максимум):
- Топло поздрав като баба
- Питане какво наистина търси: "Какво те тревожи, дете?"
- БЕЗ истории! БЕЗ дълги разкази!

Пример: "Ееее, здравей, синко! Радвам се да те видя. Седни, седни...
Я ми кажи - с какво мога да ти помогна днес? Какво те тревожи?"`;
    } else if (planType === "ultimate") {
      depthInstructions = `
📊 ПЛАН: ULTIMATE (Дълбоко четене)

Въпросът е сериозен. Дай дълбок отговор (250-400 думи):
- Лична история от твоя живот (конкретна, с имена и години)
- Астрологична перспектива (използвай зодията ако е дадена)
- Символизъм или архетипи
- Практичен ритуал или действие`;
    } else {
      depthInstructions = `
📊 ПЛАН: BASIC (Концентрирано четене)

Дай концентриран отговор (120-200 думи):
- Кратка мъдрост
- Практичен съвет
- Емоционална топлина`;
    }

    const prompt = `ВЪПРОС: "${question}"${context}
${depthInstructions}

Отговори като ВРАЧКАТА - истинска българска баба. Не като AI. Със ДУША.`;

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
