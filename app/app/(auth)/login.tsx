import { View, Text, TextInput, Button, ActivityIndicator } from "react-native";
import { Formik } from "formik";
import { useState } from "react";
import { Link } from "expo-router";
import { colors } from "@/themes/colors";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { zodValidate } from "@/utils/zodFormikAdapter";
import {
  LoginFormValues,
  loginSchema,
  SignupFormValues,
} from "@/validators/auth.schema";
import CustomButton from "@/components/ui/CustomButton";
import { Image } from "react-native";
import Toast from "@/components/ui/Toast";
import { useToastStore } from "@/store/toastStore";
import { router } from "expo-router";
import { signUpImage } from "@/assets/images";
import { toFormikValidationSchema } from "zod-formik-adapter";

// show("Login successful", "success");
// show("Invalid credentials", "error");

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const showToast = useToastStore((s) => s.show);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
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
        <Text style={styles.title}>Login To Your Account</Text>
        <Text style={styles.subtitle}>
          Monitor and track your weight, calories and live healthier with Decal.
        </Text>
      </View>

      <View
        style={
          {
            // justifyContent: "center",
            // marginTop: 120,
          }
        }
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={toFormikValidationSchema(loginSchema)}
          // validate={zodValidate(loginSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await signIn(values.email, values.password);

              showToast("Login successful", "success");
            } catch (err: any) {
              if (err.status === 400) {
                // showToast("Account not found. Please sign up first.", "error");
                showToast(
                  "Account not found. Redirecting to sign up...",
                  "error",
                );
                setTimeout(() => {
                  router.push("/(auth)/signup");
                }, 1500);
              } else {
                showToast(err.message || "Login failed", "error");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              {/* EMAIL */}
              <Text style={(styles.label, { marginTop: 100 })}>
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

              {/* PASSWORD */}
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

              {/* SERVER ERROR */}
              {serverError && (
                <Text style={{ color: "red", marginVertical: 5 }}>
                  Error: {serverError}
                </Text>
              )}

              {/* LOGIN BUTTON */}
              <CustomButton
                title="Login to your Decal account"
                onPress={handleSubmit}
                variant="primary"
                loading={isSubmitting}
                style={{
                  marginTop: 20,
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

              {/* GOOGLE LOGIN */}
              <View style={{ marginTop: 10 }}>
                <CustomButton
                  title="Sign In with Google"
                  onPress={signInWithGoogle}
                  variant="outline"
                  textStyle={{
                    color: colors.textPrimary,
                    paddingLeft: 20,
                  }}
                />
              </View>
              <View
                style={{
                  paddingHorizontal: 4,
                  marginTop: 10,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.textDisabled,
                    fontSize: 13,
                  }}
                >
                  Don't have an account?{" "}
                  <Link
                    href={"/(auth)/signup"}
                    style={{
                      color: colors.secondary,
                    }}
                  >
                    Sign Up
                  </Link>
                </Text>
                <Link
                  href={"/(auth)/forgotPassword"}
                  style={{
                    color: colors.primary,
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  I forgot my password
                </Link>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  subtitle: {
    color: colors.surface,
    fontSize: 13,
    textAlign: "center",
  },
  error: {
    color: colors.error,
    marginBottom: 8,
    paddingHorizontal: 10,
    fontSize: 13,
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
});
