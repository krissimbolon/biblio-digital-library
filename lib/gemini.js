import "server-only";

const ENDPOINT="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function generateText(prompt,maxTokens=400) {
  const key=process.env.GEMINI_API_KEY;
  if(!key)return {error:"unavailable"};
  try {
    const response=await fetch(ENDPOINT,{
      method:"POST",
      headers:{"Content-Type":"application/json","x-goog-api-key":key},
      body:JSON.stringify({
        contents:[{role:"user",parts:[{text:prompt}]}],
        generationConfig:{maxOutputTokens:maxTokens,temperature:0.2},
      }),
      cache:"no-store",
      signal:AbortSignal.timeout(9000),
    });
    if(!response.ok)return {error:response.status===429?"rate":"upstream"};
    const json=await response.json();
    const output=(json.candidates?.[0]?.content?.parts||[]).map(p=>p.text||"").join("").trim();
    if(!output)return {error:"empty"};
    return {text:output.slice(0,4000)};
  }catch(e){return {error:e?.name==="TimeoutError"?"timeout":"network"};}
}
