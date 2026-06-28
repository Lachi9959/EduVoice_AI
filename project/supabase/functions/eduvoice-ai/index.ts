import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmotionData {
  session_id: string;
  student_name: string;
  emotion: string;
  confidence: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/$/, "");

    // GET /eduvoice-ai/teams - list teams with members
    if (req.method === "GET" && path.endsWith("/teams")) {
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: teams, error } = await supabase
        .from("teams")
        .select("*, team_members(*)")
        .order("total_xp", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify({ teams }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /eduvoice-ai/leaderboard - get leaderboard
    if (req.method === "GET" && path.endsWith("/leaderboard")) {
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("rank", { ascending: true })
        .limit(20);

      if (error) throw error;
      return new Response(JSON.stringify({ leaderboard: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /eduvoice-ai/careers - get careers by topic
    if (req.method === "GET" && path.endsWith("/careers")) {
      const topic = url.searchParams.get("topic") || "";
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const query = supabase.from("careers").select("*");
      if (topic) query.eq("topic", topic);
      const { data, error } = await query;

      if (error) throw error;
      return new Response(JSON.stringify({ careers: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /eduvoice-ai/stories - get stories by topic
    if (req.method === "GET" && path.endsWith("/stories")) {
      const topic = url.searchParams.get("topic") || "";
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const query = supabase.from("stories").select("*");
      if (topic) query.eq("topic", topic);
      const { data, error } = await query;

      if (error) throw error;
      return new Response(JSON.stringify({ stories: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /eduvoice-ai/flashcards - get flashcards by topic
    if (req.method === "GET" && path.endsWith("/flashcards")) {
      const topic = url.searchParams.get("topic") || "";
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const query = supabase.from("flashcards").select("*");
      if (topic) query.eq("topic", topic);
      const { data, error } = await query;

      if (error) throw error;
      return new Response(JSON.stringify({ flashcards: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /eduvoice-ai/lessons - get all lessons (classroom twin)
    if (req.method === "GET" && path.endsWith("/lessons")) {
      const topic = url.searchParams.get("topic") || "";
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const query = supabase.from("lessons").select("*");
      if (topic) query.eq("topic", topic);
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify({ lessons: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /eduvoice-ai/emotion - record emotion
    if (req.method === "POST" && path.endsWith("/emotion")) {
      const body: EmotionData = await req.json();
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data, error } = await supabase
        .from("emotions")
        .insert(body)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ emotion: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /eduvoice-ai/quiz-attempt - record quiz attempt
    if (req.method === "POST" && path.endsWith("/quiz-attempt")) {
      const body = await req.json();
      const { createClient } = await import("npm:@supabase/supabase-js@2.47.10");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert(body)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ attempt: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
