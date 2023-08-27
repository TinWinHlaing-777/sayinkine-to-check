import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  SafeAreaView,
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
import axios from "axios";
import { useHistory } from "react-router";

const Phone = () => {
  const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

  const [isupdateData, setUpdateData] = React.useState("");
  const [isoriginalData, setOriginalData] = React.useState("");
  const [loader, setLoader] = React.useState(false);

  const history = useHistory();

  useEffect(() => {
    getPhoneOrEmail();
  }, []);

  const validatePhoneOrEmail = (inputData) => {
    if (!isNaN(inputData)) {
      setUpdateData(inputData);
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(inputData) === false) {
        console.log("Email is Not Correct");
        setUpdateData(inputData);
        return false;
      } else {
        setUpdateData(inputData);
        console.log("Email is Correct");
      }
    }
  };

  const getPhoneOrEmail = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    setOriginalData(phone_number_or_email);
  };

  const updatePhoneNumberOrEmail = async () => {
    const token = await AsyncStorage.getItem("@token");
    try {
      if (isupdateData !== "") {
        setLoader(true);
        axios
          .put(
            `${root_url}api/setting?old_phonenumber_or_email=${isoriginalData}&new_phonenumber_or_email=${isupdateData}&token=${token}`
          )
          .then((res) => {
            if (res.status === 202) {
              AsyncStorage.setItem("@ph_number", isupdateData);
              getPhoneOrEmail();
              setUpdateData("");
              setLoader(false);
              history.push("/login");
              ToastAndroid.show(
                "Phone Number Successfully Updated! Please Login Again!",
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
    <SafeAreaView style={phone_style.container}>
      {/* Logo & Text */}
      <View style={phone_style.header}>
        <Image
          style={phone_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={phone_style.headerText}>
          "Hey! , your previous phone number or email is "{isoriginalData}".You
          can change here😊"
        </Text>
      </View>
      {/* Finished Logo & Text */}
      <TextInput
        label="Enter new Phone Number or Email"
        mode="outlined"
        style={phone_style.txt_input}
        theme={{ colors: { primary: "#0d3858" }, roundness: 8 }}
        outlineColor="#0d3858"
        clearButtonMode="always"
        name="phoneNumberOrEmail"
        value={isupdateData}
        onChangeText={(isupdateData) => validatePhoneOrEmail(isupdateData)}
      />
      {loader === true ? (
        <Image
          source={require("../../assets/images/sayinkine_loading.gif")}
          style={phone_style.loader}
        />
      ) : (
        <Button
          icon="content-save"
          style={phone_style.save_btn}
          mode="contained"
          onPress={() => updatePhoneNumberOrEmail()}
        >
          Save
        </Button>
      )}

      <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
    </SafeAreaView>
  );
};

export default Phone;

const phone_style = StyleSheet.create({
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
