import { Link } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";

const About = () => {
  //open facebook page function
  const open_facebookpage = () => {
    //open facebook page function
    Linking.openURL("fb://page/102583102028904");
  };
  //open mail function
  const open_mail = () => {
    Linking.openURL("mailto:nksoftwarehouse@gmail.com");
  };
  // open dialpad function
  const open_dialpad = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = "tel:09969119949";
    } else {
      phoneNumber = "telprompt:09969119949";
    }

    Linking.openURL(phoneNumber);
  };
  // open webpage function
  const open_webpage = () => {
    Linking.openURL("https://www.nksoftwarehouse.com");
  };
  return (
    <SafeAreaView style={about_style.container}>
      <View style={about_style.header}>
        {/* Logo */}
        <Image
          style={about_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        {/* Description */}
        <Text style={about_style.description}>
          Hello, we are from the development team of this applicaton.First of
          all we would like to thanks to you for using our application.This
          application is developed by NK Software House located in
          Myanmar(Burma). Our Company developed this application to help the
          people in tracking of their money income & expense . We will continue
          maintain & develop this application to give more services and
          features. So for the upcoming features , don't forget to get in touch
          with us . Kindly like & follow our Facebook Page. Have a nice day !😊
        </Text>
      </View>
      <View style={about_style.social_media_container}>
        {/* Social Media  */}
        <IconButton
          icon="facebook"
          color="#4267B2"
          size={30}
          onPress={open_facebookpage}
        />
        <IconButton
          icon="email"
          color="#B23121"
          size={30}
          onPress={open_mail}
        />
        <IconButton
          icon="phone"
          color="#047857"
          size={30}
          onPress={open_dialpad}
        />
        <IconButton
          icon="earth"
          color="#1D4ED8"
          size={30}
          onPress={open_webpage}
        />
      </View>
    </SafeAreaView>
  );
};
export default About;
const about_style = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  logo: {
    top: 20,
    width: 88,
    height: 123,
    marginBottom: 15,
  },
  description: {
    color: "#0d3858",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
    marginLeft: 13,
    marginRight: 13,
    textAlign: "justify",
  },
  social_media_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
