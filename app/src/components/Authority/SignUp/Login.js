import React from "react";
import {
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";

const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

const Login = ({ history }) => {
  const [phonenumberoremail, setPhoneNumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSibmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      Phone_Number_Or_Email: phonenumberoremail,
      User_Password: password,
    };

    if (phonenumberoremail != "" && password != "") {
      setIsSubmitted(true);
      axios
        .post(`${root_url}api/Login?token`, formData)
        .then((res) => {
          // console.log(res.status);
          if (res.data != "401") {
            AsyncStorage.setItem("@ph_number", formData.Phone_Number_Or_Email);
            AsyncStorage.setItem("@token", res.data);
            history.push("/navigation");
            // alert(AsyncStorage.getItem("@token") + "");
          } else if (res.data == "401") {
            setIsSubmitted(false);
            alert("Phone Number Or Password Incorrect");
          } else if (res.data == "500") {
            alert("System Error! Please, try again later.");
            setIsSubmitted(false);
          }
        })
        .catch((err) => {
          setIsSubmitted(false);
          alert(err);
        });
    } else {
      alert("Please fill all fields correctly!");
      setIsSubmitted(false);
    }
  };

  return (
    <View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 10}
        behavior="position"
      >
        <Image
          style={login_styles.gradient}
          source={require("../../../assets/images/login_gradient.png")}
        />
        <Image
          style={login_styles.logo}
          source={require("../../../assets/images/logo.png")}
        />
        {/*  Phone number input */}
        <TextInput
          style={login_styles.input}
          theme={{ colors: { primary: "#467ca4" } }}
          label="Enter Account Phone Number or Email"
          name="phonenumberoremail"
          value={phonenumberoremail}
          onChangeText={(phonenumberoremail) =>
            setPhoneNumber(phonenumberoremail)
          }
        />

        <TextInput
          style={login_styles.input}
          theme={{ colors: { primary: "#467ca4" } }}
          label="Enter Password"
          showSoftInputOnFocus={true}
          name="password"
          value={password}
          onChangeText={(password) => {
            setPassword(password);
          }}
          secureTextEntry={true}
          keyboardType="default"
        />

        {!isSibmitted ? (
          <Button
            labelStyle={{ fontSize: 17 }}
            style={login_styles.login_btn}
            mode="contained"
            // onPress={handleSubmit}
            onPress={() => history.push("/navigation")}
          >
            Login
          </Button>
        ) : (
          <Image
            source={require("../../../assets/images/sayinkine_loading.gif")}
            style={login_styles.styleGif}
          />
        )}

        <Text style={login_styles.signup}>
          If you do not have an account, please
          <Text
            style={login_styles.signupText}
            onPress={() => history.push("/signup")}
          >
            {" "}
            SignUp
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const login_styles = StyleSheet.create({
  gradient: {
    top: 0,
    left: 0,
    width: "100%",
    height: 220,
  },

  logo: {
    top: -60,
    display: "flex",
    alignSelf: "center",
    width: 120,
    height: 150,
  },
  input: {
    top: -50,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "#467ca4",
    width: 320,
    alignSelf: "center",
  },
  login_btn: {
    backgroundColor: "#467ca4",
    borderRadius: 10,
    width: 250,
    top: -30,
    alignSelf: "center",
  },
  styleGif: {
    top: -25,
    alignSelf: "center",
  },
  signup: {
    top: -15,
    alignSelf: "center",
  },
  signupText: {
    color: "#467ca4",
    fontWeight: "bold",
    fontSize: 16,
  },
});
