import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  ToastAndroid,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { showBottomAlert } from "react-native-modal-bottom-alert";
import {
  BottomAlert,
  useRefBottomAlert,
} from "react-native-modal-bottom-alert";
import { useHistory } from "react-router";

const Password = () => {
  const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

  const [password, setPassword] = React.useState("");
  const [confirmpassword, setConfirmPassword] = React.useState("");
  const [PasswordErr, setPasswordErr] = React.useState(false);
  const [ConfirmPasswordErr, setConfirmPasswordErr] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [loader, setLoader] = React.useState(false);

  const history = useHistory();

  const updatePassword = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      if (
        currentPassword !== "" &&
        password !== "" &&
        confirmpassword !== "" &&
        password === confirmpassword
      ) {
        setLoader(true);
        axios
          .put(
            `${root_url}api/setting?phonenumber_or_email=${phone_number_or_email}&old_password=${currentPassword}&new_password=${password}&token=${token}`
          )
          .then((res) => {
            if (res.status === 202) {
              setCurrentPassword("");
              setPassword("");
              setConfirmPassword("");
              setLoader(false);
              history.push("/login");
              ToastAndroid.show(
                "Password Successfully Updated! Please Login Again!",
                ToastAndroid.LONG
              );
            } else {
              showBottomAlert(
                "error",
                "Error!",
                "Check your internet connection!"
              );
            }
          })
          .catch((err) => {
            if (err.message.split(" ").pop() === "401") {
              history.push("/login");
              ToastAndroid.show(
                "Session Expire! Please Login Again!",
                ToastAndroid.LONG
              );
            } else if (err.message.split(" ").pop() === "406") {
              showBottomAlert(
                "info",
                "Check your Old Password!",
                "Your Old Password is incorrect!"
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
    <ScrollView style={password_style.container}>
      {/* Logo & Text */}
      <View style={password_style.header}>
        <Image
          style={password_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={password_style.headerText}>
          "Hey! , here you can change your password😊"
        </Text>
      </View>
      {/* Finished Logo & Text */}
      <TextInput
        label="Enter old password"
        mode="outlined"
        style={password_style.txt_input}
        theme={{ colors: { primary: "#0d3858" }, roundness: 8 }}
        outlineColor="#0d3858"
        showSoftInputOnFocus={true}
        secureTextEntry={true}
        clearButtonMode="always"
        name="currentPassword"
        value={currentPassword}
        onChangeText={(currentPassword) => setCurrentPassword(currentPassword)}
      />
      <TextInput
        label="Enter new password"
        mode="outlined"
        style={password_style.txt_input}
        theme={{ colors: { primary: "#0d3858" }, roundness: 8 }}
        outlineColor="#0d3858"
        showSoftInputOnFocus={true}
        secureTextEntry={true}
        clearButtonMode="always"
        name="password"
        value={password}
        onChangeText={(password) => {
          setPassword(password);
          if (password.length > 0 && password.length < 8) {
            setPasswordErr(true);
          } else {
            setPasswordErr(false);
          }
        }}
        error={PasswordErr && password.length < 8}
      />
      <TextInput
        label="Confirm new password"
        mode="outlined"
        style={password_style.txt_input}
        theme={{ colors: { primary: "#0d3858" }, roundness: 8 }}
        outlineColor="#0d3858"
        showSoftInputOnFocus={true}
        secureTextEntry={true}
        clearButtonMode="always"
        name="confirmpassword"
        value={confirmpassword}
        onChangeText={(confirmpassword) => setConfirmPassword(confirmpassword)}
        keyboardType="default"
        error={
          (ConfirmPasswordErr && confirmpassword == "") ||
          confirmpassword != password
        }
      />
      {loader === true ? (
        <Image
          source={require("../../assets/images/sayinkine_loading.gif")}
          style={password_style.loader}
        />
      ) : (
        <Button
          icon="content-save"
          style={password_style.save_btn}
          mode="contained"
          onPress={() => updatePassword()}
        >
          Save
        </Button>
      )}

      <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
    </ScrollView>
  );
};

export default Password;

const password_style = StyleSheet.create({
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 40,
    color: "#467ca4",
  },
  save_btn: {
    marginTop: 45,
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
