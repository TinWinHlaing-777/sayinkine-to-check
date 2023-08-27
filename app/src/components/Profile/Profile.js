import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  NativeModules,
} from "react-native";
import { Card, IconButton } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NameComponent from "./Name";
import PhoneComponent from "./Phone";
import PasswordComponent from "./Password";
import AdsComponent from "./Ads";
import Feedback from "./Feedback";
import About from "./About";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHistory } from "react-router";
import Currency from "./Currency";
//import { screensEnabled } from 'react-native-screens';
const NameContent = (props) => (
  <IconButton icon="account" size={20} style={{ top: 3 }} />
);
const RightContent = (props) => (
  <IconButton icon="arrow-right" size={20} style={{ top: 3 }} />
);
const PhoneContent = (props) => (
  <IconButton
    icon="badge-account-horizontal"
    size={20}
    style={profile_style.icon_button}
  />
);
const PasswordContent = (props) => (
  <IconButton icon="lock" size={20} style={profile_style.icon_button} />
);
const AdsContent = (props) => (
  <IconButton icon="cancel" size={20} style={profile_style.icon_button} />
);
const FeedbackContent = (props) => (
  <IconButton icon="pen" size={20} style={profile_style.icon_button} />
);
const LogoutContent = (props) => (
  <IconButton icon="account" size={20} style={profile_style.icon_button} />
);
const AboutContent = (props) => (
  <IconButton icon="information" size={20} sstyle={profile_style.icon_button} />
);

const CurrencyContent = (props) => (
  <IconButton
    icon="currency-usd"
    size={20}
    sstyle={profile_style.icon_button}
  />
);
const Stack = createStackNavigator();

//start ProfileScreen function
function ProfileScreen({ navigation }) {
  //declaring hooks
  const [rippleColor, setRippleColor] = React.useState();
  const [rippleRadius, setRippleRadius] = React.useState(0);
  const history = useHistory();
  const rippleOverflow = false;
  //user interaction function
  const removeToken = () => {
    AsyncStorage.removeItem("@token");
    history.push("/login");
  };
  return (
    <SafeAreaView style={profile_style.container}>
      {/* Logo & Text */}
      <View style={profile_style.header}>
        <Image
          style={profile_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={profile_style.headerText}>
          "Hey, here you can edit your personal information"
        </Text>
      </View>
      {/* Finished Logo & Text */}
      <ScrollView>
        <Card style={profile_style.back_card}>
          {/* Profile Name Card */}
          <TouchableNativeFeedback
            onPress={() => {
              setRippleColor("#0D3858");
              setRippleRadius(1);
              navigation.navigate("Your Username");
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="Name"
                left={NameContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished Profile Name Card */}
          {/* Phone Number Card */}
          <TouchableNativeFeedback
            onPress={() => {
              setRippleColor("#0D3858");
              setRippleRadius(1);
              navigation.navigate("Phone Number or Email");
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="Phone Number or Email"
                left={PhoneContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished Phone Number Card */}
          {/* Password Card */}
          <TouchableNativeFeedback
            onPress={() => {
              setRippleColor("#0D3858");
              setRippleRadius(1);
              navigation.navigate("Password");
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="Password"
                left={PasswordContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished Password Card */}
          {/* Remove Ads Card */}
          <TouchableNativeFeedback
            onPress={() => {
              setRippleColor("#0D3858");
              setRippleRadius(1);
              navigation.navigate("Remove Ads");
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="Remove Ads"
                left={AdsContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished Remove Ads */}
          {/* Feedback Card */}
          <TouchableNativeFeedback
            onPress={() => {
              setRippleColor("#0D3858");
              setRippleRadius(1);
              navigation.navigate("Feedback");
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="Feedback"
                left={FeedbackContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished Feedback Card */}
          {/* Currency Card */}
          <TouchableNativeFeedback
            onPress={() => {
              setRippleColor("#0D3858");
              setRippleRadius(1);
              navigation.navigate("Change Currency");
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="Change Currency"
                left={CurrencyContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished Currency Card */}

          {/* About App Card */}
          <TouchableNativeFeedback
            onPress={() => {
              setRippleColor("#0D3858");
              setRippleRadius(1);
              navigation.navigate("About App");
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="About App"
                left={AboutContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished About App Card */}

          {/* Logout Card */}
          <TouchableNativeFeedback
            onPress={() => {
              removeToken();
              setRippleColor("#0D3858");
              setRippleRadius(1);
            }}
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
          >
            <Card style={profile_style.card} mode="outlined" elevation={50}>
              <Card.Title
                style={profile_style.card_title}
                title="Log Out"
                left={LogoutContent}
                right={RightContent}
              />
            </Card>
          </TouchableNativeFeedback>
          {/* Finished Logout Card */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
} //finished ProfileScreen function

//start NameScreen function
function NameScreen({ navigation }) {
  return <NameComponent />;
}

function PhoneScreen({ navigation }) {
  return <PhoneComponent />;
}

function PasswordScreen({ navigation }) {
  return <PasswordComponent />;
}
function AdsScreen({ navigation }) {
  return <AdsComponent />;
}

function FeedBackScreen({ navigation }) {
  return <Feedback />;
}

function AboutScreen({ navigation }) {
  return <About />;
}

function CurrencyScreen({ navigation }) {
  return <Currency />;
}
//main function
const Profile = () => {
  //declaring hooks
  return (
    <SafeAreaView style={profile_style.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Your Info" component={ProfileScreen} />
          <Stack.Screen name="Your Username" component={NameScreen} />
          <Stack.Screen name="Phone Number or Email" component={PhoneScreen} />
          <Stack.Screen name="Password" component={PasswordScreen} />
          <Stack.Screen name="Remove Ads" component={AdsScreen} />
          <Stack.Screen name="Feedback" component={FeedBackScreen} />
          <Stack.Screen name="Change Currency" component={CurrencyScreen} />
          <Stack.Screen name="About App" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default Profile;
const profile_style = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  icon_button: {},
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
  back_card: {
    backgroundColor: "#0D3858",
    width: "100%",
    height: 830,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 0,
    paddingBottom: "20%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#5397c8",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    margin: 18,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  card_title: {
    color: "#fff",
  },
  activityindicator: {
    marginTop: 20,
  },
});
