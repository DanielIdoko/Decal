import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useToastStore } from "@/store/toastStore";
import { colors } from "@/themes/colors";

export default function Toast() {
  const { message, type, visible, hide } = useToastStore();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        hide();
      }, 4000);
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const background =
    type === "success"
      ? colors.success
      : type === "error"
        ? colors.error
        : colors.info;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: background, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    zIndex: 999,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
