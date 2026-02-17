import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import { useState } from "react";
import { Link } from "expo-router";
import { colors } from "@/themes/colors";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { zodValidate } from "@/utils/zodFormikAdapter";
import { loginSchema } from "@/validators/auth.schema";
import CustomButton from "@/components/ui/CustomButton";
import { Image } from "react-native";
import Toast from "@/components/ui/Toast";
import { useToastStore } from "@/store/toastStore";
import { router } from "expo-router";

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

  return (
    <ScrollView
      style={{
        paddingVertical: 70,
        paddingHorizontal: 13,
      }}
    >
      <Text
        style={{
          fontSize: 29,
          fontWeight: "bold",
          color: colors.primary,
          textAlign: "center",
        }}
      >
        Decal
      </Text>
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 30,
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 30,
        }}
      >
        Log In To Your Account.
      </Text>
      <Text
        style={{
          // padding: 20,
          color: colors.textDisabled,
          fontSize: 13,
          textAlign: "center",
        }}
      >
        Monitor your health, weight, etc. better by logging in now.
      </Text>
      <View
        style={{
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={zodValidate(loginSchema)}
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
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              {/* EMAIL */}
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange("email")}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  color: colors.textPrimary,
                  borderWidth: 1,
                  borderRadius: 30,
                  borderColor: errors.email && touched.email ? "red" : "#ccc",
                  padding: 12,
                  marginBottom: 5,
                }}
              />
              {touched.email && errors.email && (
                <Text style={{ color: "red" }}>{errors.email}</Text>
              )}

              {/* PASSWORD */}
              <Text style={styles.label}>Password</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor:
                    errors.password && touched.password ? "red" : "#ccc",
                  borderRadius: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  marginBottom: 5,
                }}
              >
                <TextInput
                  value={values.password}
                  placeholder="**********"
                  onChangeText={handleChange("password")}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    flex: 1,
                    color: colors.textPrimary,
                  }}
                />

                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#6B7280"
                  onPress={() => setShowPassword((prev) => !prev)}
                />
              </View>

              {touched.password && errors.password && (
                <Text style={{ color: "red" }}>{errors.password}</Text>
              )}

              {/* SERVER ERROR */}
              {serverError && (
                <Text style={{ color: "red", marginVertical: 5 }}>
                  Error: {serverError}
                </Text>
              )}

              {/* LOGIN BUTTON */}
              <CustomButton
                title="Login"
                disabled={loading}
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
                  Forgot Password
                </Link>
              </View>

              <Text
                style={{
                  fontSize: 13,
                  padding: 7,
                  marginVertical: 10,
                  textAlign: "center",
                  color: colors.textDisabled,
                }}
              >
                ------------------------------------------ OR
                -----------------------------------------
              </Text>

              {/* GOOGLE LOGIN */}
              <View style={{ marginTop: 10 }}>
                <CustomButton
                  title="Sign In with Google"
                  leftIcon={
                    <Image
                      source={require("@/assets/images/google-icon.png")}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 100,
                      }}
                    />
                  }
                  onPress={signInWithGoogle}
                  variant="outline"
                  textStyle={{
                    color: colors.textPrimary,
                    paddingLeft: 20,
                  }}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#121212",
    fontSize: 15,
    padding: 2,
  },
});
