import { supabase } from "@/lib/supabase";

interface SavePlanOptions {
  planType: "workout" | "meal";
  planData: Record<string, unknown>;
}

export async function savePlanToDatabase({ planType, planData }: SavePlanOptions) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log("No user logged in - plan not saved to database");
    return null;
  }

  try {
    // Save the plan
    const { data: savedPlan, error: planError } = await supabase
      .from("saved_plans")
      .insert({
        user_id: user.id,
        plan_type: planType,
        plan_data: planData,
        plan_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (planError) {
      console.error("Error saving plan:", planError);
      return null;
    }

    return savedPlan;
  } catch (error) {
    console.error("Error in savePlanToDatabase:", error);
    return null;
  }
}

export async function getUserPlans(planType?: "workout" | "meal") {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  let query = supabase
    .from("saved_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (planType) {
    query = query.eq("plan_type", planType);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return data || [];
}

export async function getLatestPlan(planType: "workout" | "meal") {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from("saved_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("plan_type", planType)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching latest plan:", error);
    return null;
  }

  return data;
}
