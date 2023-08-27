import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View, Platform, Image, Text } from "react-native";
import { NativeRouter, Route, Switch } from "react-router-native";
import SignUpComponent from "./src/components/Authority/SignUp/SignUp";
import LoginComponent from "./src/components/Authority/SignUp/Login";
import StartingBudget from "./src/components/StartingBudget";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Navigation from "./src/components/Navigation/Navigation";
import { StyleSheet } from "react-native";

const App = () => {
  const [toggle, setToggle] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

  useEffect(() => {
    ValidateToken();
  }, []);

  const ValidateToken = async () => {
    const token = await AsyncStorage.getItem("@token");
    const localPhone = await AsyncStorage.getItem("@ph_number");
    if (token == "" || token == null) {
      setToggle(false);
      setLoader(true);
    } else {
      axios
        .post(
          `${root_url}api/ValidateToken?phone_number=${localPhone}&token=${token}`
        )
        .then((res) => {
          console.log(res.status);
          if (res.data == "401" || res.data == null) {
            AsyncStorage.removeItem("@token");
            AsyncStorage.removeItem("@ph_number");
            setToggle(false);
            setLoader(true);
          } else {
            //if token is valid
            console.log("is valid");
            setToggle(true);
            setLoader(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <NativeRouter>
      <View
        style={{
          backgroundColor: "#467ca4",
          height: Platform.OS === "ios" ? 38 : StatusBar.currentHeight,
        }}
      >
        <StatusBar style="light" backgroundColor="#467ca4" />
      </View>
      {loader === false ? (
        <View style={appStyle.loadingGif}>
          <Image
            source={require("./src/assets/images/sayinkine_loading.gif")}
          />
          <Text style={appStyle.loadingText}>
            Please wait a moment, {"\n"} we are getting data...
          </Text>
        </View>
      ) : (
        <Switch>
          {toggle === true ? (
            <Route exact path="/" component={Navigation} />
          ) : (
            <Route exact path="/" component={LoginComponent} />
          )}
          <Route exact path="/" component={Navigation} />
          <Route exact path="/signup" component={SignUpComponent} />
          <Route exact path="/login" component={LoginComponent} />
          <Route exact path="/starting_budget" component={StartingBudget} />
          <Route exact path="/navigation" component={Navigation} />
        </Switch>
      )}
    </NativeRouter>
  );
};

const appStyle = StyleSheet.create({
  loadingGif: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  loadingText: {
    color: "#0d3858",
    fontSize: 18,
    textAlign: "center",
  },
});
export default App;
