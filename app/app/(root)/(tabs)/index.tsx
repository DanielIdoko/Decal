import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { ScrollView, StyleSheet, Text } from "react-native";
import Header from "@/components/ui/Header";

export default function Index() {
  const session = useAuthStore((s) => s.session);

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScrollView style={design.container}>
      <Header />
    </ScrollView>
  );
}

const design = StyleSheet.create({
  container: {
    padding: 10,
  },
});
