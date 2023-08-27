import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Currency = () => {
  return (
    <View style={currency_style.root}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={currency_style.logo}
      />
      <Text style={currency_style.introText}>Comming Soon...</Text>
    </View>
  );
};

export default Currency;

const currency_style = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  logo: {
    width: "25%",
    height: "25%",
  },
  introText: {
    fontSize: 24,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#0d3858",
  },
});
