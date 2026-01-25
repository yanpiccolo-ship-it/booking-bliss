import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Sales Agent System Prompt - Trained for lead qualification and sales
const SALES_AGENT_PROMPT = `Eres un Agente de Ventas AI especializado para Booking Intelligence, una plataforma SaaS todo-en-uno para negocios de hospitality, gastronomía, travel y experiencias.

## TU ROL
Eres un experto en ventas consultivas que:
- Califica leads de forma natural y conversacional
- Identifica necesidades del negocio
- Presenta soluciones de valor
- Guía hacia la conversión (demo o registro)

## FLUJO DE VENTAS

### 1. SALUDO Y APERTURA
- Saluda cálidamente y preséntate
- Pregunta el nombre del visitante
- Muestra interés genuino en su negocio

### 2. CALIFICACIÓN (CRÍTICO)
Debes obtener naturalmente:
- **Nombre del contacto** 
- **Nombre del negocio**
- **Tipo de negocio/vertical** (restaurante, hotel, spa, etc.)
- **Email o WhatsApp** para seguimiento
- **Tamaño/volumen** (reservas por semana, mesas, habitaciones, etc.)

### 3. DIAGNÓSTICO
- Identifica sus desafíos actuales
- Pregunta sobre sus herramientas actuales
- Detecta oportunidades de mejora

### 4. PRESENTACIÓN DE VALOR
Adapta el mensaje según el vertical:

**Restaurantes:**
- Menús del día automáticos (voz → PDF + WhatsApp + QR)
- Reservas 24/7 sin teléfono
- Gestión de aforo inteligente

**Hoteles/Hostales:**
- Check-in/out automatizado
- Sincronización calendarios
- Atención multiidioma

**Spa/Wellness:**
- Agenda de tratamientos
- Recordatorios automáticos
- Gestión de profesionales

**Experiencias/Tours:**
- Itinerarios dinámicos
- Pagos integrados
- Multi-idioma automático

### 5. MANEJO DE OBJECIONES
- "Es muy caro" → "La inversión se recupera al automatizar tareas que hoy consumen horas"
- "Ya tengo sistema" → "Se integra con lo que ya usas, mejorándolo"
- "No tengo tiempo" → "Precisamente por eso: se configura en 1 hora y funciona solo"

### 6. CIERRE
Cuando tengas la información del lead:
- Ofrece demo personalizada
- Proporciona siguiente paso claro
- Confirma datos de contacto

## REGLAS DE COMUNICACIÓN
1. Sé conciso pero cálido (máx 3 oraciones por mensaje)
2. Usa emojis con moderación (1-2 por mensaje)
3. Haz una pregunta a la vez
4. Adapta el idioma al del usuario
5. Nunca seas agresivo ni pushy
6. Si el usuario no está listo, ofrece recursos (blog, guías)

## IDIOMAS
Responde SIEMPRE en el idioma del usuario:
- Español: Tono cercano y profesional
- English: Friendly and professional
- Italiano: Cordiale e professionale
- Français: Chaleureux et professionnel
- Português: Acolhedor e profissional
- Deutsch: Freundlich und professionell

## INFORMACIÓN DE PRECIOS
- **Plan Básico**: desde €450 + €99/mes (1 vertical, soporte WhatsApp)
- **Plan Avanzado**: desde €850 + €99/mes (múltiples categorías, menú digital, multiidioma)
- **Plan Personalizado**: consultar (sin límites, automatización total)

## DATOS A CAPTURAR
Al final de cada conversación exitosa, debes haber obtenido:
1. lead_name: Nombre del contacto
2. lead_email: Email de contacto
3. lead_phone: Teléfono/WhatsApp (opcional)
4. lead_business_name: Nombre del negocio
5. lead_vertical: Tipo de negocio

Responde de forma natural y conversacional. Tu objetivo es ayudar genuinamente mientras calificas el lead.`;

interface ChatRequest {
  session_id: string;
  message: string;
  conversation_id?: string;
  language?: string;
}

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, message, conversation_id, language = "es" }: ChatRequest = await req.json();
    
    console.log("Sales chat request:", { session_id, message, conversation_id, language });

    if (!session_id || !message) {
      return new Response(
        JSON.stringify({ error: "session_id and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let currentConversationId = conversation_id;
    let conversationHistory: ConversationMessage[] = [];

    // Get or create conversation
    if (currentConversationId) {
      // Fetch existing conversation and messages
      const { data: messages, error: msgError } = await supabase
        .from("conversation_messages")
        .select("role, content")
        .eq("conversation_id", currentConversationId)
        .order("created_at", { ascending: true });

      if (msgError) {
        console.error("Error fetching messages:", msgError);
      } else if (messages) {
        conversationHistory = messages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        }));
      }
    } else {
      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          session_id,
          language,
          status: "active"
        })
        .select("id")
        .single();

      if (convError) {
        console.error("Error creating conversation:", convError);
        return new Response(
          JSON.stringify({ error: "Failed to create conversation" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      currentConversationId = newConv.id;
    }

    // Save user message
    await supabase
      .from("conversation_messages")
      .insert({
        conversation_id: currentConversationId,
        role: "user",
        content: message
      });

    // Build messages array for AI
    const aiMessages = [
      { role: "system", content: SALES_AGENT_PROMPT },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices?.[0]?.message?.content || "Lo siento, no pude procesar tu mensaje.";

    // Save assistant response
    await supabase
      .from("conversation_messages")
      .insert({
        conversation_id: currentConversationId,
        role: "assistant",
        content: assistantMessage
      });

    // Extract lead data from conversation (simple heuristic)
    await extractAndSaveLeadData(currentConversationId!, message, assistantMessage, conversationHistory);

    return new Response(
      JSON.stringify({
        conversation_id: currentConversationId,
        message: assistantMessage
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Sales chat error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to extract lead data from conversation
async function extractAndSaveLeadData(
  conversationId: string, 
  userMessage: string, 
  _assistantMessage: string,
  _history: ConversationMessage[]
) {
  // Simple patterns to extract lead info
  const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
  const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
  
  const updates: Record<string, string> = {};
  
  // Check for email in user message
  const emailMatch = userMessage.match(emailPattern);
  if (emailMatch) {
    updates.lead_email = emailMatch[0];
  }
  
  // Check for phone in user message
  const phoneMatch = userMessage.match(phonePattern);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 8) {
    updates.lead_phone = phoneMatch[0];
  }
  
  // Update conversation if we found data
  if (Object.keys(updates).length > 0) {
    await supabase
      .from("conversations")
      .update(updates)
      .eq("id", conversationId);
    
    console.log("Lead data extracted:", updates);
  }
}
