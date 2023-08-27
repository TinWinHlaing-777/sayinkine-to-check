import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { TextInput, Button, Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showBottomAlert } from "react-native-modal-bottom-alert";
import {
  BottomAlert,
  useRefBottomAlert,
} from "react-native-modal-bottom-alert";
import { useHistory } from "react-router";

const phonenumber_or_email = AsyncStorage.getItem("@ph_number");
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const Ads = () => {
  const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

  const [userName, setUserName] = React.useState("");
  const [isemail, setEmail] = React.useState("");
  const [loader, setLoader] = React.useState(false);

  const history = useHistory();

  useEffect(() => {
    getUserName();
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

  // console.log(userName);

  const subscribe = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      if (isemail !== "") {
        setLoader(true);
        axios
          .post(
            `${root_url}api/setting/sub?phonenumber_or_email=${phone_number_or_email}&user_name=${userName}&token=${token}`
          )
          .then((res) => {
            if (res.status === 202) {
              showBottomAlert(
                "success",
                "Congratulation!",
                "Thank your for your Subscribtion"
              );
              setEmail("");
              setLoader(false);
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
    } catch (err) {
      alert(error);
    }
  };

  return (
    <SafeAreaView style={ads_style.container}>
      {/* Logo & Text */}
      <View style={ads_style.header}>
        <Image
          style={ads_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={ads_style.headerText}>
          "Hey! , there is a good news.You can use the app without ads in just
          4.99$ per month.😊"
        </Text>
      </View>
      {/* Finished Logo & Text */}
      {reg.test(phonenumber_or_email) === false ? (
        <TextInput
          label="Enter your email"
          mode="outlined"
          style={ads_style.txt_input}
          theme={{ colors: { primary: "#0d3858" }, roundness: 8 }}
          outlineColor="#0d3858"
          name="email"
          value={isemail}
          onChangeText={(isemail) => setEmail(isemail)}
        />
      ) : (
        console.log("user account is in email")
      )}
      <Text style={ads_style.acceptable_text}>Acceptable Payment:</Text>
      <View style={ads_style.payment_icon_container}>
        <Avatar.Image
          style={ads_style.payment_icons}
          size={50}
          source={require("../../assets/images/visa.png")}
        />
        <Avatar.Image
          style={ads_style.payment_icons}
          size={50}
          source={require("../../assets/images/wave.png")}
        />
        <Avatar.Image
          style={ads_style.payment_icons}
          size={50}
          source={require("../../assets/images/kbzpay.png")}
        />
        <Avatar.Image
          style={ads_style.payment_icons}
          size={58}
          source={require("../../assets/images/kbzbank.png")}
        />
        <Avatar.Image
          style={ads_style.payment_icons}
          size={55}
          source={require("../../assets/images/ayabank.png")}
        />
      </View>
      {loader === true ? (
        <Image
          source={require("../../assets/images/sayinkine_loading.gif")}
          style={ads_style.loader}
        />
      ) : (
        <Button
          icon="credit-card-outline"
          style={ads_style.subscribe_btn}
          mode="contained"
          onPress={() => {
            subscribe();
          }}
        >
          Subscribe
        </Button>
      )}

      {/* {thanks_msg === true ? <Text>Thanks</Text> : console.log(thanks_msg)} */}
      <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
    </SafeAreaView>
  );
};
export default Ads;
const ads_style = StyleSheet.create({
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
  subscribe_btn: {
    backgroundColor: "#0d3858",
    width: "55%",
    margin: 20,
    top: 13,
    alignSelf: "center",
  },
  acceptable_text: {
    display: "flex",
    alignSelf: "auto",
    margin: 10,
    left: 15,
    color: "#0d3858",
    fontWeight: "bold",
    fontSize: 15,
  },
  payment_icon_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  payment_icons: {
    backgroundColor: "transparent",
    marginLeft: 10,
    marginRight: 10,
  },
  loader: {
    alignSelf: "center",
    marginTop: 20,
  },
});
