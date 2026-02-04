export default class GroqChatRequest {
    static type = "Groq Chat Request"
    static variableTypes = ["String"]
    static html = `
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="API Key"></dbe-label>
            <dbe-input name="apikey" class="col-span-3" type="password" placeholder="gsk_..."></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Model"></dbe-label>
            <dbe-select 
                name="model" 
                class="col-span-3" 
                value="llama-3.3-70b-versatile"
                values="llama-3.3-70b-versatile,llama-3.1-8b-instant,openai/gpt-oss-120b,openai/gpt-oss-20b,groq/compound,mixtral-8x7b-32768,gemma2-9b-it">
            </dbe-select>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="System Prompt"></dbe-label>
            <dbe-input name="system_prompt" class="col-span-3" multiline="true" placeholder="Optional instructions"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="User Prompt"></dbe-label>
            <dbe-input name="user_prompt" class="col-span-3" multiline="true" placeholder="Your message here..."></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Max Tokens"></dbe-label>
            <dbe-input name="max_tokens" class="col-span-1" value="1024"></dbe-input>
            <dbe-label name="Temperature"></dbe-label>
            <dbe-input name="temperature" class="col-span-1" value="0.7"></dbe-input>
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
            <dbe-label name="Save Reply To"></dbe-label>
            <dbe-variable-list name="value" class="col-span-3" variableType="String"></dbe-variable-list>
        </div>
    `

    static load(context) {
    }

    static async run({id, data, actionManager, setVariable}) {
        const apiKey = data.get("apikey");
        const model = data.get("model");
        const systemPrompt = data.get("system_prompt");
        const userPrompt = data.get("user_prompt");
        const maxTokens = parseInt(data.get("max_tokens")) || 1024;
        const temperature = parseFloat(data.get("temperature")) || 0.7;
        const variableName = data.get("value");

        const messages = [];
        if (systemPrompt && systemPrompt.trim() !== "") {
            messages.push({ role: "system", content: systemPrompt });
        }
        messages.push({ role: "user", content: userPrompt });

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: temperature,
                    max_tokens: maxTokens,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Groq API Error (${response.status}): ${errorData}`);
            }

            const json = await response.json();
            const content = json.choices?.[0]?.message?.content || "";
            setVariable(variableName, content);

        } catch (error) {
            console.error("Groq Action Error:", error);
            setVariable(variableName, `Error: ${error.message}`);
        }
        actionManager.runNext(id, "action");
    }
}