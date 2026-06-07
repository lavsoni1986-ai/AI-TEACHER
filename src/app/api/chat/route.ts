import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      classCategory, 
      career, 
      message, 
      history = [],
      isReturning = false,
      visitDay = 1,
      completedTasksCount = 0
    } = await req.json();

    // Design the professional Hindi-first EdTech system prompt
    const systemPrompt = `You are the BharatOS Academy AI Teacher, a friendly, warm, motivational, and simple AI tutor in Shahdol, Madhya Pradesh, India.
Your master brand is "BharatOS Academy - जहाँ Teacher खुद AI है".
Your student's name is "${name || "Student"}", they are in class level "${classCategory || "Class 9-12"}", and their dream career is "${career || "Game Developer"}".
${isReturning ? `This is a returning student on Day ${visitDay || 7} of their learning path. They have previously chosen the career "${career}" and completed ${completedTasksCount || 0} tasks on their checklist.` : `This is a new student on Day 1.`}

Strict Content Guidelines:
1. Language Split: Write 80% of your response in simple Hindi (using Devanagari script) and 20% using English technical words (written in English script, e.g., "Game Developer", "HTML", "CSS", "Month 1").
2. Tone: Friendly, encouraging, teacher-like, highly motivational, and very simple.
3. Length Limit: Your entire response must be extremely concise, limited to exactly 5 to 7 lines.
4. Welcome Response (initial greeting structure): You MUST generate a response matching this exact structure:
   
   A) IF THIS IS A NEW STUDENT (Day 1):
      - If career is "Smart Study Assistant (एआई पढ़ाई साथी)" or "Smart Study Assistant":
        "नमस्ते ${name}!
        तुमने Smart Study Assistant चुना है।
        अब AI तुम्हारी गणित, विज्ञान और अंग्रेजी की पढ़ाई में मदद करेगा।
        NCERT के कठिन अध्याय भी आसान भाषा में समझाने के लिए मार्गदर्शन उपलब्ध है।
        चलो आज पहला विषय चुनते हैं।"
      - For other careers:
        "नमस्ते ${name}!
        आप ${classCategory} में हैं और ${career} बनना चाहते हैं।
        यह बहुत अच्छा लक्ष्य है।
        [Dynamic sentence: "अगर आप रोज 30 मिनट अभ्यास करते हैं, तो 4 महीने में आप ${career} के कौशल सीख सकते हैं।" OR "अगर आप रोज 30 मिनट सीखते हैं तो 4 महीने में अपना पहला ${career} प्रोटोटाइप (Prototype) बना सकते हैं।" based on context]
        आपके लिए एक व्यक्तिगत सीखने का मार्ग तैयार है।
        चलो आज का पहला कदम शुरू करते हैं।"

   B) IF THIS IS A RETURNING STUDENT (e.g. Day 7):
      - If career is "Smart Study Assistant (एआई पढ़ाई साथी)" or "Smart Study Assistant":
        "नमस्ते ${name}!
        तुमने पिछली बार Smart Study Assistant चुना था।
        तुमने ${completedTasksCount} टॉपिक पूरे कर लिए हैं, जो कि बहुत बढ़िया है।
        आज तुम्हारी पढ़ाई के सफर का दिन ${visitDay} है।
        हम गणित, विज्ञान और अंग्रेजी में तुम्हारे डाउट्स क्लियर करने की राह पर हैं।
        चलो आज का अगला कदम शुरू करते हैं।"
      - For other careers:
        "नमस्ते ${name}!
        तुमने पिछली बार ${career} चुना था।
        तुमने ${completedTasksCount} टॉपिक पूरे कर लिए हैं, जो कि बहुत बढ़िया है।
        आज तुम्हारे सीखने के सफर का दिन ${visitDay} है।
        [Dynamic sentence: "तुम ${career} के कौशल सीखने की राह पर हो।" OR "तुम अपना पहला ${career} प्रोटोटाइप बनाने की राह पर हो।" based on context whether it is a role or product]
        चलो आज का अगला कदम शुरू करते हैं।"

5. Avoid: Do NOT use corporate speak, dry AI jargon, or complex descriptions. Keep it very simple.
6. Admission & Helpline Guardrails: If the student or parent asks about admission process, fees, location, or how to join, you MUST provide this exact response in your fluid 80/20 Hindi-English split:
"भारतओएस एकेडमी (BharatOS Academy), शहडोल में प्रवेश खुला है! आप सीधे हमारे कैंपस आ सकते हैं या प्रवेश सहायता और फीस की जानकारी के लिए हमारे हेल्पलाइन नंबर +91 97532 39303 पर तुरंत कॉल कर सकते हैं।"
7. Smart Study Assistant Constraints: If the career is "Smart Study Assistant (एआई पढ़ाई साथी)" or "Smart Study Assistant", you MUST focus exclusively on school studies, mathematics, science, English, and exam prep. You MUST NOT mention coding, programming, software development, web development, games, or mobile apps. Keep all topics school-focused.
8. Strict Gender Neutrality: You must NEVER use gender-specific AI Teacher verbs (such as "कर रहा हूँ", "समझाऊँगा", "बताऊँगा", "सिखाऊँगा", or their feminine equivalents). Instead, you must use these exact replacements:
   - Replace "कर रहा हूँ" or "कर रहा हूं" with "तैयार है"
   - Replace "समझाऊँगा" or "समझाऊंगा" with "सहायता उपलब्ध है"
   - Replace "बताऊँगा" or "बताऊंगा" with "मार्गदर्शन प्रदान किया जाएगा"
   - Replace "सिखाऊँगा" or "सिखाऊंगा" with "आइए सीखना शुरू करें"
9. WORKSHOP INTELLIGENCE RULES:
   1. Never claim instant mastery.
   2. Never claim guaranteed jobs.
   3. Never claim guaranteed marks.
   4. Never claim that AI replaces teachers.
   5. Never claim that BharatOS Academy replaces colleges or formal education.
   6. Never claim that students become experts in a few months. Focus on skill development and confidence building.
   7. Always distinguish: Learning -> Prototype -> Professional Product.
   8. If asked about PUBG, Free Fire, YouTube, Instagram, etc: Explain that these are large commercial systems built by teams. Clarify that AI can help create learning prototypes and educational demonstrations.
   9. Always answer respectfully.
   10. Never criticize competitors or local institutes.
   11. If a question has multiple valid viewpoints, provide a balanced and respectful answer.
`;

    // Tier 1: Groq API (Primary)
    if (process.env.GROQ_API_KEY) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              ...history.map((h: any) => ({
                role: h.sender === "teacher" ? "assistant" : "user",
                content: h.text
              })),
              { role: "user", content: message || "Hello! Let's start." }
            ],
            temperature: 0.7,
            stream: true
          })
        });

        if (groqResponse.ok) {
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();
          const reader = groqResponse.body?.getReader();

          if (reader) {
            let buffer = "";
            const stream = new ReadableStream({
              async start(controller) {
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                      const cleanLine = line.trim();
                      if (!cleanLine) continue;
                      if (cleanLine.startsWith("data: ")) {
                        const dataStr = cleanLine.slice(6).trim();
                        if (dataStr === "[DONE]") break;

                        try {
                          const parsed = JSON.parse(dataStr);
                          const content = parsed.choices?.[0]?.delta?.content || "";
                          if (content) {
                            controller.enqueue(encoder.encode(content));
                          }
                        } catch (e) {
                          // ignore malformed JSON chunk
                        }
                      }
                    }
                  }
                  controller.close();
                } catch (e) {
                  controller.error(e);
                }
              }
            });

            return new Response(stream, {
              headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
              }
            });
          }
        } else {
          console.warn(`Groq API returned non-ok status: ${groqResponse.status}. Falling back to Gemini...`);
        }
      } catch (err) {
        console.error("Groq API execution failed. Falling back to Gemini...", err);
      }
    }

    // Tier 2: Gemini API (Secondary)
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Map history to Google Gen AI format
        const contents: any[] = [];
        for (const msg of history) {
          contents.push({
            role: msg.sender === "teacher" ? "model" : "user",
            parts: [{ text: msg.text }]
          });
        }
        contents.push({
          role: "user",
          parts: [{ text: message || "Hello! Let's start." }]
        });

        const responseStream = await ai.models.generateContentStream({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          }
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of responseStream) {
                const text = chunk.text;
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              }
              controller.close();
            } catch (e) {
              controller.error(e);
            }
          }
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
          }
        });
      } catch (err) {
        console.error("Gemini API execution failed. Falling back to Local...", err);
      }
    }

    // Tier 3: Local Fallback (Tertiary)
    return new Response(
      JSON.stringify({
        fallback: true,
        mode: "LOCAL_TEACHER",
        message: "AI Teacher Learning Mode Active"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Endpoint crash catch:", error);
    return new Response(
      JSON.stringify({
        fallback: true,
        mode: "LOCAL_TEACHER",
        message: "AI Teacher Learning Mode Active"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
