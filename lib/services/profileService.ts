import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, avatar_url, bio, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateUsername(
  userId: string,
  username: string
): Promise<{ success: boolean; error: string | null }> {
  const trimmedUsername = username.trim().toLowerCase();

  if (!trimmedUsername) {
    return { success: false, error: "Username cannot be empty" };
  }

  if (trimmedUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters" };
  }

  if (trimmedUsername.length > 30) {
    return { success: false, error: "Username must be less than 30 characters" };
  }

  if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
    return {
      success: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: trimmedUsername })
    .eq("id", userId);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Username is already taken" };
    }
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function checkUsernameAvailable(
  username: string
): Promise<boolean> {
  const trimmedUsername = username.trim().toLowerCase();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", trimmedUsername)
    .maybeSingle();

  if (error) {
    return false;
  }

  return !data;
}
