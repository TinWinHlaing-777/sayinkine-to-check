import axios from "axios";
import React, { useRef, useState } from "react";
import { StyleSheet, Image, Text, SafeAreaView } from "react-native";
import { Button, List, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import {
  BottomAlert,
  useRefBottomAlert,
} from "react-native-modal-bottom-alert";
import { showBottomAlert } from "react-native-modal-bottom-alert";

const root_url = "https://sayinkineapi.nksoftwarehouse.com/";
let currency_code = [
  "AFA",
  "ALL",
  "DZD",
  "AOA",
  "ARS",
  "AMD",
  "AWG",
  "AUD",
  "AZN",
  "BSD",
  "BHD",
  "BDT",
  "BBD",
  "BYR",
  "BEF",
  "BZD",
  "BMD",
  "BTN",
  "BTC",
  "BOB",
  "BAM",
  "BWP",
  "BRL",
  "GBP",
  "BND",
  "BGN",
  "BIF",
  "KHR",
  "CAD",
  "CVE",
  "KYD",
  "XOF",
  "XAF",
  "XPF",
  "CLP",
  "CNY",
  "COP",
  "KMF",
  "CDF",
  "CRC",
  "HRK",
  "CUC",
  "CZK",
  "DKK",
  "DJF",
  "DOP",
  "XCD",
  "EGP",
  "ERN",
  "EEK",
  "ETB",
  "EUR",
  "FKP",
  "FJD",
  "GMD",
  "GEL",
  "DEM",
  "GHS",
  "GIP",
  "GRD",
  "GTQ",
  "GNF",
  "GYD",
  "HTG",
  "HNL",
  "HKD",
  "HUF",
  "ISK",
  "INR",
  "IDR",
  "IRR",
  "IQD",
  "ILS",
  "ITL",
  "JMD",
  "JPY",
  "JOD",
  "KZT",
  "KES",
  "KWD",
  "KGS",
  "LAK",
  "LVL",
  "LBP",
  "LSL",
  "LRD",
  "LYD",
  "LTL",
  "MOP",
  "MKD",
  "MGA",
  "MWK",
  "MYR",
  "MVR",
  "MRO",
  "MUR",
  "MXN",
  "MDL",
  "MNT",
  "MAD",
  "MZM",
  "MMK",
  "NAD",
  "NPR",
  "ANG",
  "TWD",
  "NZD",
  "NIO",
  "NGN",
  "KPW",
  "NOK",
  "OMR",
  "PKR",
  "PAB",
  "PGK",
  "PYG",
  "PEN",
  "PHP",
  "PLN",
  "QAR",
  "RON",
  "RUB",
  "RWF",
  "SVC",
  "WST",
  "SAR",
  "RSD",
  "SCR",
  "SLL",
  "SGD",
  "SKK",
  "SBD",
  "SOS",
  "ZAR",
  "KRW",
  "XDR",
  "LKR",
  "SHP",
  "SDG",
  "SRD",
  "SZL",
  "SEK",
  "CHF",
  "SYP",
  "STD",
  "TJS",
  "TZS",
  "THB",
  "TOP",
  "TTD",
  "TND",
  "TRY",
  "TMT",
  "UGX",
  "UAH",
  "AED",
  "UYU",
  "USD",
  "UZS",
  "VUV",
  "VEF",
  "VND",
  "YER",
  "ZMK",
];

const StartingBudget = ({ history }) => {
  const currencySheet = useRef();
  // data handling
  const [budgetData, setBudgetData] = useState("");
  const [iscurrency, setCurrency] = useState("Choose your currency");
  // error handling
  const [numberCheckErr, setnumberCheckErr] = useState(false);

  let budgetAmount = parseInt(budgetData.replace(/[%()*/+-]/g, ""));

  const sendData = async (e) => {
    e.preventDefault();
    const checkNumber = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      if (budgetAmount > 0 && iscurrency !== "") {
        const budget_data = {
          Phone_Number_Or_Email: checkNumber,
          Budget: budgetAmount,
          Currency: iscurrency,
          Token: token,
        };
        axios
          .post(`${root_url}api/sb`, budget_data)
          .then((res) => {
            console.log(res.data);
            if (res.status == 202) {
              showBottomAlert(
                "success",
                "Congratulation!",
                "Welcome to Sayinkine Application"
              );
              AsyncStorage.setItem("@currency", budget_data.Currency);
              history.push("/navigation");
            } else if (res.data == "500") {
              showBottomAlert("error", "Error!", "System Error");
            }
          })
          .catch((err) => console.log(err));
      } else {
        setnumberCheckErr(true);
        showBottomAlert("info", "Check your input fields!", "Category Created");
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <SafeAreaView style={budget_form.root}>
      <Image
        style={budget_form.logo}
        source={require("../assets/images/logo.png")}
      />
      <TextInput
        mode="outlined"
        style={budget_form.input}
        theme={{ colors: { primary: "#0D3858" } }}
        label="Enter your Budget Money"
        keyboardType="numeric"
        outlineColor="#0D3858"
        name="budgetData"
        value={budgetData}
        onChangeText={(budgetData) => setBudgetData(budgetData)}
        error={numberCheckErr && budgetData == ""}
      />

      <Button
        style={budget_form.currency}
        mode="contained"
        labelStyle={{ color: "#0d3858", fontSize: 18 }}
        uppercase={false}
        onPress={() => currencySheet.current.open()}
      >
        {iscurrency}
        <Icon name="down" />
      </Button>

      <Text style={budget_form.textStyle}>
        Hey ! let me know your {"\n    "} starting budget 😊
      </Text>
      <Button
        style={budget_form.button}
        labelStyle={{ fontSize: 18 }}
        uppercase={false}
        mode="contained"
        onPress={sendData}
      >
        Let's Go !
      </Button>
      <RBSheet
        ref={currencySheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={400}
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
          draggableIcon: {
            backgroundColor: "#B2BABB",
            width: 50,
          },
        }}
      >
        <ScrollView persistentScrollbar={true} indicatorStyle="white">
          {currency_code.map((data) => {
            return (
              <List.Section
                style={budget_form.currencyList}
                key={currency_code.indexOf(data)}
              >
                <List.Item
                  titleStyle={{ textAlign: "center", fontSize: 28 }}
                  title={data}
                  onPress={() => {
                    setCurrency(data);
                    currencySheet.current.close();
                  }}
                />
              </List.Section>
            );
          })}
        </ScrollView>
      </RBSheet>
      <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
    </SafeAreaView>
  );
};

export default StartingBudget;

const budget_form = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: 120,
    width: 114,
    height: 160,
  },
  input: {
    marginTop: 40,
    width: 320,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderColor: "#0D3858",
  },
  currency: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#0d3858",
    borderStyle: "solid",
    borderWidth: 1,
    width: 320,
    height: 55,
  },
  textStyle: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: "600",
    color: "#0D3858",
  },
  button: {
    width: "60%",
    height: "auto",
    borderRadius: 20,
    marginTop: 100,
    justifyContent: "center",
    backgroundColor: "#0D3858",
  },
  currencyList: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#0d3858",
    borderStyle: "solid",
    borderBottomWidth: 1,
    width: "80%",
  },
});
