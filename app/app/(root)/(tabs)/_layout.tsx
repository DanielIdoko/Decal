import { View, Text, Image } from "react-native";
import React from "react";
import { Link, Tabs } from "expo-router";
import { colors } from "@/themes/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  analyticsIcon,
  analyticsIcon2,
  createIcon,
  homeIcon,
  homeIcon2,
  profileIcon,
  profileIcon2,
} from "@/assets/icons";
interface TabBarIconProps {
  focused: boolean;
  icon: any;
  // link: string;
  // title: string;
}

const TabBarIcon = ({ focused, icon }: TabBarIconProps) => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    }}
  >
    <Text>{icon}</Text>
    {/* <Text
      style={{
        fontSize: 15,
        color: focused ? colors.primary : colors.textPrimary,
        fontWeight: focused ? "bold" : "normal",
      }}
    >
      {title}
    </Text> */}
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          borderWidth: 1,
          borderColor: "#121212",
          height: 70,
          width: "95%",
          position: "absolute",
          bottom: 40,
          left: 10,
          borderRadius: 100,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#121212",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon={
                <View
                  style={{
                    padding: 15,
                    borderRadius: "100%",
                  }}
                >
                  <Image
                    source={focused ? homeIcon2 : homeIcon}
                    style={{
                      width: 20,
                      padding: 10,
                      height: 20,
                    }}
                  />
                </View>
              }
              focused={focused}
            />
          ),
        }}
      />
      {/* Create */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon={
                <View
                  style={{
                    padding: 15,
                    borderRadius: "100%",
                  }}
                >
                  <Image
                    source={createIcon}
                    style={{
                      width: 20,
                      padding: 10,
                      height: 20,
                    }}
                  />
                </View>
              }
              focused={focused}
            />
          ),
        }}
      />
      {/* Analytics */}
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon={
                <View
                  style={{
                    padding: 15,
                    borderRadius: "100%",
                  }}
                >
                  <Image
                    source={focused ? analyticsIcon2 : analyticsIcon}
                    style={{
                      width: 20,
                      padding: 10,
                      height: 20,
                    }}
                  />
                </View>
              }
              focused={focused}
            />
          ),
        }}
      />
      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              icon={
                <View
                  style={{
                    padding: 15,
                    borderRadius: "100%",
                  }}
                >
                  <Image
                    source={focused ? profileIcon2 : profileIcon}
                    style={{
                      width: 20,
                      padding: 10,
                      height: 20,
                    }}
                  />
                </View>
              }
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
