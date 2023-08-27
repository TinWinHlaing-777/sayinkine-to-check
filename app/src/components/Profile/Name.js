import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { showBottomAlert } from "react-native-modal-bottom-alert";
import {
  BottomAlert,
  useRefBottomAlert,
} from "react-native-modal-bottom-alert";
import { useHistory } from "react-router";

const Name = () => {
  const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

  const [userName, setUserName] = React.useState("");
  const [updateName, setUpdateName] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const [btnLoader, setBtnLoader] = React.useState(false);

  const history = useHistory();

  useEffect(() => {
    getUserName();
    setLoader(true);
  }, []);

  const getUserName = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      axios
        .get(
          `${root_url}api/home/ub?phonenumber_or_email=${phone_number_or_email}&token=${token}`
        )
        .then((res) => {
          if (res.status === 202) {
            res.data.forEach((element) => {
              setUserName(element.User_Name);
              setLoader(false);
            });
          } else {
            showBottomAlert(
              "error",
              "Error",
              "Please check your internet connection!"
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
          } else {
            showBottomAlert(
              "error",
              "Error",
              "Please check your internet connection!"
            );
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  const updateUserName = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      if (updateName !== "") {
        setBtnLoader(true);
        axios
          .put(
            `${root_url}api/setting?phonenumber_or_email=${phone_number_or_email}&new_name=${updateName}&token=${token}`
          )
          .then((res) => {
            console.log(res.status);
            if (res.status === 202) {
              showBottomAlert(
                "success",
                "Congratulation!",
                "User name has been updated"
              );
              setUpdateName("");
              setBtnLoader(false);
              getUserName();
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
            setBtnLoader(false);
          });
      } else {
        showBottomAlert(
          "error",
          "Input Error!",
          "Please fill your text field correctly!"
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <SafeAreaView style={name_style.container}>
      {/* Logo & Text */}
      <View style={name_style.header}>
        <Image
          style={name_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        {loader === true && userName === "" ? (
          <Image
            source={require("../../assets/images/sayinkine.gif")}
            style={name_style.loader}
          />
        ) : (
          <Text style={name_style.headerText}>
            "Hey! , your previous username is '{userName}'.You can change
            here😊"
          </Text>
        )}
      </View>
      {/* Finished Logo & Text */}
      <TextInput
        label="Enter new username"
        mode="outlined"
        style={name_style.txt_input}
        theme={{ colors: { primary: "#0d3858", background: "#fff" } }}
        outlineColor="#0d3858"
        name="updateName"
        value={updateName}
        onChangeText={(updateName) => setUpdateName(updateName)}
        clearButtonMode="always"
      />
      {btnLoader === true ? (
        <Image
          source={require("../../assets/images/sayinkine_loading.gif")}
          style={name_style.loader}
        />
      ) : (
        <Button
          icon="content-save"
          style={name_style.save_btn}
          mode="contained"
          onPress={() => updateUserName()}
        >
          Save
        </Button>
      )}

      <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
    </SafeAreaView>
  );
};
export default Name;
const name_style = StyleSheet.create({
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
  loader: {
    alignSelf: "center",
    marginTop: 20,
  },
});
