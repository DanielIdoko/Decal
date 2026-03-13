import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { logoIcon } from "@/assets/icons";
import { colors } from "@/themes/colors";

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Image source={logoIcon} style={{ width: 10, height: 10 }} />
        <Text style={{ color: colors.textPrimary, fontSize: 12 }}>Decal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 40,
    padding: 2,
  },
});

export default Header;
