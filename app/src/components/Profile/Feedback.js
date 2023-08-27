import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { SafeAreaView, StyleSheet, View, Text, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { showBottomAlert } from "react-native-modal-bottom-alert";
import {
  BottomAlert,
  useRefBottomAlert,
} from "react-native-modal-bottom-alert";
import { useHistory } from "react-router";

const Feedback = () => {
  const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

  const [isfeedback, setFeedback] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const history = useHistory();

  const postFeedback = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      if (isfeedback !== "") {
        setLoader(true);
        axios
          .post(
            `${root_url}api/setting/fb?phonenumber_or_email=${phone_number_or_email}&feedback=${isfeedback}&token=${token}`
          )
          .then((res) => {
            if (res.status === 202) {
              showBottomAlert(
                "success",
                "Congratulation!",
                "Thank your for your feedback"
              );
              setFeedback("");
              setLoader(false);
            } else if (res.status === 500) {
              showBottomAlert(
                "error",
                "System Error!",
                "Check your internet connection or input field!"
              );
              setLoader(false);
            } else if (res.status === 401) {
              showBottomAlert("error", "Session Expire!", "Please Login Again");
              history.push("/login");
              setLoader(false);
            } else if (res.status === 502) {
              showBottomAlert(
                "error",
                "Connection Problem!",
                "Check your Internet Connection!"
              );
              setLoader(false);
            }
          })
          .catch((err) => {
            if (err.message.split(" ").pop() === "401") {
              history.push("/login");
              ToastAndroid.show(
                "Session Expire! Please Login Again!",
                ToastAndroid.LONG
              );
            } else if (err.message.split(" ").pop() === "500") {
              showBottomAlert(
                "error",
                "System Error!",
                "Check your internet connection or input field!"
              );
            } else {
              showBottomAlert(
                "error",
                "Error",
                "Please check your internet connection!"
              );
            }
            setLoader(false);
          });
      } else {
        showBottomAlert(
          "error",
          "Error",
          "Please check your text fields correctly!"
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <SafeAreaView style={feedback_style.container}>
      {/* Logo & Text */}
      <View style={feedback_style.header}>
        <Image
          style={feedback_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={feedback_style.headerText}>
          "Hey! , your can give your feedback here so we can improve the app to
          give the better service for you 😊"
        </Text>
      </View>
      {/* Finished Logo & Text */}
      <TextInput
        multiline
        label="Enter your feedback"
        mode="outlined"
        numberOfLines={5}
        style={feedback_style.txt_input}
        theme={{ colors: { primary: "#0d3858" }, roundness: 8 }}
        outlineColor="#0d3858"
        name="feedback"
        value={isfeedback}
        onChangeText={(isfeedback) => setFeedback(isfeedback)}
      />
      {loader === true ? (
        <Image
          source={require("../../assets/images/sayinkine_loading.gif")}
          style={feedback_style.loader}
        />
      ) : (
        <Button
          icon="send-outline"
          style={feedback_style.save_btn}
          mode="contained"
          onPress={() => postFeedback()}
        >
          Submit
        </Button>
      )}

      <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
    </SafeAreaView>
  );
};

export default Feedback;

const feedback_style = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  logo: {
    top: 20,
    left: 20,
    width: 88,
    height: 123,
  },
  headerText: {
    top: 20,
    width: 250,
    fontSize: 16,
    textAlign: "center",
    color: "#0d3858",
    fontWeight: "bold",
  },
  //text input style
  txt_input: {
    margin: 20,
    marginTop: 40,
    color: "#467ca4",
  },
  save_btn: {
    backgroundColor: "#0d3858",
    width: "30%",
    margin: 20,
    alignSelf: "center",
  },
  loader: {
    alignSelf: "center",
    marginTop: 20,
  },
});
