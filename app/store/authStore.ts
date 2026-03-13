import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "../lib/supabase";
import { Platform } from "react-native";
interface AuthState {
  session: any | null;
  user: any | null;
  loading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

WebBrowser.maybeCompleteAuthSession();

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    if (Platform.OS === "web") {
      const stored = localStorage.getItem("session");
      if (stored) {
        const session = JSON.parse(stored);
        set({ session, user: session.user, loading: false });
      } else {
        set({ loading: false });
      }
      return;
    } else {
      const stored = await SecureStore.getItemAsync("session");
      if (stored) {
        const session = JSON.parse(stored);
        set({ session, user: session.user, loading: false });
      } else {
        set({ loading: false });
      }
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        set({ session, user: session.user });
        if (Platform.OS === "web") {
          localStorage.setItem("session", JSON.stringify(session));
        } else {
          await SecureStore.setItemAsync("session", JSON.stringify(session));
        }
      } else {
        set({ session: null, user: null });
        if (Platform.OS === "web") {
          localStorage.removeItem("session");
        } else {
          await SecureStore.deleteItemAsync("session");
        }
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    set({ loading: false });
    if (error) throw error;
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    set({ loading: false });
    if (error) throw error;
  },

  signInWithGoogle: async () => {
    const redirectUrl = AuthSession.makeRedirectUri({
      scheme: "decal",
      path: "auth/callback",
    });

    // On Web, Supabase handles the redirect automatically without needing WebBrowser
    if (Platform.OS === "web") {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
      return;
    }

    // NATIVE FLOW (iOS/Android)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true, // Only for native
      },
    });

    if (error) throw error;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

    if (result.type !== "success") {
      throw new Error("Google authentication cancelled");
    }

    const url = result.url;

    // Extract fragment part after "#"
    const fragment = url.split("#")[1];

    if (!fragment) {
      throw new Error("No auth data returned");
    }

    const params = new URLSearchParams(fragment);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      throw new Error("Failed to retrieve authentication tokens");
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) throw sessionError;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
