
// supabase/functions/lemon-squeezy-webhook/index.ts

// Setup type definitions for built-in Supabase Edge Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

// Fix: Declare Deno for environments where types are missing
declare const Deno: any;

console.log("Lemon Squeezy Webhook is running! (v3 - Optimized Status Logic)")

const LEMON_SQUEEZY_SECRET = Deno.env.get("LEMON_SQUEEZY_WEBHOOK_SECRET")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const toHex = (buffer: ArrayBuffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  if (!LEMON_SQUEEZY_SECRET) {
    console.error("LEMON_SQUEEZY_WEBHOOK_SECRET not set")
    return new Response("Server misconfiguration", { status: 500 })
  }

  // 1. Validar Assinatura
  const signature = req.headers.get("x-signature")
  if (!signature) {
    return new Response("No signature", { status: 401 })
  }

  const rawBody = await req.text()
  
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(LEMON_SQUEEZY_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify", "sign"]
  )
  
  const hmac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody)
  )
  
  const computedSignature = toHex(hmac)

  if (computedSignature !== signature) {
    console.error("Invalid signature")
    return new Response("Invalid signature", { status: 401 })
  }

  // 2. Processar o Evento
  const payload = JSON.parse(rawBody)
  const { meta, data } = payload
  const eventName = meta.event_name
  const customData = meta.custom_data

  console.log(`Received event: ${eventName}`)

  // Lista de eventos que nos interessam para gerir o acesso
  const relevantEvents = [
    "order_created",
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
    "subscription_expired", 
    "subscription_resumed"
  ]

  if (relevantEvents.includes(eventName)) {
    const attributes = data.attributes
    const status = attributes.status // ex: 'active', 'expired', 'on_trial', 'cancelled'
    const userId = customData?.user_id

    if (!userId) {
      console.error("No user_id found in custom_data. Payload:", data.id)
      return new Response("No user_id in payload", { status: 200 })
    }

    // Lógica de Decisão: Quem é Premium?
    // 'on_trial' = Premium (se deres trial)
    // 'active' = Premium
    // 'cancelled' = Na Lemon Squeezy, 'cancelled' significa "não vai renovar", 
    // mas o período pago continua válido até ao 'ends_at'.
    // Só passamos para FREE se o status for explicitamente EXPIRED ou UNPAID,
    // ou se o evento for subscription_expired.
    
    let newStatus = 'free'
    
    // 1. Estados que conferem acesso Premium
    // Nota: 'cancelled' na LS significa "active until end of period".
    if (status === 'active' || status === 'on_trial' || status === 'cancelled') {
        newStatus = 'premium'
    }

    // 2. Estados/Eventos que removem acesso (Override)
    if (eventName === 'subscription_expired' || status === 'expired' || status === 'unpaid') {
        newStatus = 'free'
    }

    console.log(`Processing User ${userId}. Event: ${eventName}, LS Status: ${status} -> App Status: ${newStatus}`)

    // 3. Atualizar Base de Dados
    const { error } = await supabase
      .from("profiles")
      .update({ 
        subscription_status: newStatus,
        // Opcional: Podes guardar o ID do cliente Lemon Squeezy se quiseres
        // lemon_squeezy_customer_id: attributes.customer_id 
      })
      .eq("id", userId)

    if (error) {
      console.error("Supabase update error:", error)
      return new Response("Database error", { status: 500 })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
})
