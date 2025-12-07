"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): AuthState & AuthActions {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Set up auth state listener FIRST - this is faster than getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState((prev) => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));
      }
    );

    // Then check current session (non-blocking for UI)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
      }));
    }).catch(() => {
      setState((prev) => ({ ...prev, loading: false }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
        return { error: error.message };
      }

      setState((prev) => ({ ...prev, loading: false }));
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, username?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
        return { error: error.message, needsConfirmation: false };
      }

      // Update username in profile if provided
      if (data.user && username) {
        await supabase
          .from("profiles")
          .update({ username: username.trim() })
          .eq("id", data.user.id);
      }

      setState((prev) => ({ ...prev, loading: false }));
      
      // Check if email confirmation is required
      const needsConfirmation = !data.session;
      return { error: null, needsConfirmation };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign up failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage, needsConfirmation: false };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Use NEXT_PUBLIC_SITE_URL for production, fallback to window.location.origin
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google sign in failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  }, []);

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setState((prev) => ({ ...prev, user: null, session: null, loading: false }));
    router.push("/auth/login");
  }, [router]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    clearError,
  };
}

export function useRequireAuth(redirectTo = "/auth/login") {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push(redirectTo);
    }
  }, [auth.loading, auth.user, router, redirectTo]);

  return auth;
}
