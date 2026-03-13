import { router, Stack, useRouter, useSegments } from "expo-router";
import { lazy, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/themes/colors";
import Toast from "@/components/ui/Toast";

export default function Layout() {
  const { initialize, session, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (loading) return; // Wait until we check SecureStore/LocalStorage

    // Check if the user is currently in the "(auth)" group
    const inAuthGroup = segments[0] === "(auth)";

    if (session && inAuthGroup) {
      // If logged in, move them out of the login screens to the home/tabs
      router.replace("/");
    } else if (!session && !inAuthGroup) {
      // If logged out and trying to access home, kick them back to login
      router.replace("/(auth)/login");
    }
  }, [session, loading, segments]);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} size={35} />
      </View>
    );

  return (
    <>
      <Toast />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
