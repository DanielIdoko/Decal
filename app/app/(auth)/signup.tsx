import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { router } from "expo-router";
import { signupSchema, SignupFormValues } from "@/validators/auth.schema";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { colors } from "@/themes/colors";
import { CustomButton } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { signUpImage } from "@/assets/images";
import { Image } from "react-native";

export default function SignupScreen() {
  const { signUp, signInWithGoogle } = useAuthStore();
  const showToast = useToastStore((s) => s.show);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const initialValues: SignupFormValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "rgb(244, 245, 246)",
          height: 250,
          position: "absolute",
          overflow: "hidden",
          top: 0,
          right: 0,
          left: 0,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <Image
          source={signUpImage}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        <Text style={styles.title}>Create Your Account</Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(signupSchema)}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await signUp(values.email, values.password);

            showToast(
              "Signup successful. Check your email to confirm.",
              "success",
            );

            router.replace("/(auth)/login");
          } catch (err: any) {
            showToast(err.message || "Signup failed", "error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <Text style={(styles.label, { marginTop: 160 })}>
              Email Address*
            </Text>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor={colors.textDisabled}
              style={styles.input}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <View style={styles.passwordWrapper}>
              <Text style={styles.label}>Password*</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={colors.textDisabled}
                style={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={17}
                style={{
                  position: "absolute",
                  right: 14,
                  top: 49,
                }}
                color="#6B7280"
                onPress={() => setShowPassword((prev) => !prev)}
              />
            </View>
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <View style={styles.passwordWrapper}>
              <Text style={styles.label}>Confirm Password*</Text>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={colors.textDisabled}
                style={styles.input}
                secureTextEntry={!showConfirm}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
              />
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={17}
                style={{
                  position: "absolute",
                  right: 14,
                  top: 49,
                }}
                color="#6B7280"
                onPress={() => setShowConfirm((prev) => !prev)}
              />
            </View>

            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <CustomButton
              title="Create your account"
              onPress={handleSubmit}
              variant="primary"
              loading={isSubmitting}
              style={{
                marginTop: 40,
              }}
              textStyle={{
                color: "#fff",
              }}
            />

            <Text
              style={{
                fontSize: 13,
                padding: 7,
                marginVertical: 10,
                textAlign: "center",
                color: colors.textDisabled,
              }}
            >
              ------------------------------ or ------------------------------
            </Text>
            {/* GOOGLE SIGNUP */}
            <View style={{ marginTop: 10 }}>
              <CustomButton
                title="Continue with Google"
                variant="outline"
                textStyle={{
                  color: colors.textPrimary,
                  paddingLeft: 20,
                }}
                onPress={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (err: any) {
                    showToast(err.message || "Google signup failed", "error");
                  }
                }}
              />
            </View>

            <Text style={styles.link}>
              Already have an account?{" "}
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text
                  style={{
                    color: colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </Text>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 70,
    paddingHorizontal: 13,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    marginTop: 100,
    color: colors.surface,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    padding: 2,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.textDisabled,
    borderWidth: 1,
    padding: 14,
    borderRadius: 30,
    marginBottom: 8,
    marginTop: 10,
    color: colors.textPrimary,
  },
  passwordWrapper: {
    position: "relative",
  },
  toggle: {
    position: "absolute",
    right: 16,
    top: 1,
    color: colors.primary,
  },
  error: {
    color: colors.error,
    marginBottom: 8,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: colors.textDisabled,
  },
});
