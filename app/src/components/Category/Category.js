import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Card, TextInput, Title, IconButton } from "react-native-paper";
import {
  BottomAlert,
  useRefBottomAlert,
} from "react-native-modal-bottom-alert";
import { showBottomAlert } from "react-native-modal-bottom-alert";
import { useEffect } from "react";
import { useHistory } from "react-router";

const topics = [
  {
    id: 1,
    emoji: "🍔",
    text: "Food",
  },
  {
    id: 2,
    emoji: "🍹",
    text: "Drink",
  },
  {
    id: 3,
    emoji: "💼",
    text: "Work",
  },
  {
    id: 4,
    emoji: "☕",
    text: "Coffee",
  },
  {
    id: 5,
    emoji: "🏥",
    text: "Health",
  },
  {
    id: 6,
    emoji: "🏠",
    text: "Home",
  },
  {
    id: 7,
    emoji: "🚗",
    text: "Car",
  },
  {
    id: 8,
    emoji: "🚌",
    text: "Bus",
  },
  {
    id: 9,
    emoji: "🏪",
    text: "Market",
  },
  {
    id: 10,
    emoji: "🏫",
    text: "School",
  },
  {
    id: 11,
    emoji: "🥳",
    text: "Wedding",
  },
  {
    id: 12,
    emoji: "👶🏻",
    text: "Baby",
  },
  {
    id: 13,
    emoji: "🏦",
    text: "Bank",
  },
  {
    id: 14,
    emoji: "👢",
    text: "Shoes(man)",
  },
  {
    id: 15,
    emoji: "👡",
    text: "Shoes(lady)",
  },
  {
    id: 16,
    emoji: "👔",
    text: "Clothes(man)",
  },
  {
    id: 17,
    emoji: "🧥",
    text: "Clothes(lady)",
  },
  {
    id: 18,
    emoji: "🌿",
    text: "Plants",
  },
  {
    id: 19,
    emoji: "🐶",
    text: "Animal(dog)",
  },
  {
    id: 20,
    emoji: "🐱",
    text: "Animal(cat)",
  },
];

const root_url = "https://sayinkineapi.nksoftwarehouse.com/";

const Category = () => {
  const [category, setCategory] = React.useState("");
  const [sticker, setSticker] = React.useState("");
  const [categoryData, setCategoryData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isSaved, setSaved] = React.useState(false);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getCategory();
  }, []);

  const sendCategory = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    const categoryData = {
      Phone_Number_Or_Email: phone_number_or_email,
      Category_Title: category,
      Category_Sticker: sticker,
      Token: token,
    };
    try {
      if (category != "" && sticker != "") {
        setSaved(true);
        axios
          .post(`${root_url}api/category`, categoryData)
          .then((res) => {
            if (res.status === 202) {
              getCategory();
              setSaved(false);
              showBottomAlert("success", "Congratulation!", "Category Created");
              setCategory("");
              setSticker("");
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
              showBottomAlert("error", "Error!", "System Error!");
            } else if (err.message.split(" ").pop() === "409") {
              showBottomAlert("info", "Duplicate!", "Category Already Exits!");
            } else {
              showBottomAlert(
                "error",
                "Error",
                "Please check your internet connection!"
              );
            }
            setSaved(false);
          });
      } else if (
        (category != "" && sticker == "") ||
        (category == "" && sticker != "")
      ) {
        showBottomAlert(
          "info",
          "Warning!",
          "Please check your input or choose a sticker!"
        );
      } else {
        showBottomAlert(
          "info",
          "Warning!",
          "Please fill category title and choose sticker!"
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  const getCategory = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      axios
        .get(
          `${root_url}api/Category?phonenumber_or_email=${phone_number_or_email}&token=${token}`
        )
        .then((res) => {
          setCategoryData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.message.split(" ").pop() === "401") {
            history.push("/login");
            ToastAndroid.show(
              "Session Expire! Please Login Again!",
              ToastAndroid.LONG
            );
          } else if (err.message.split(" ").pop() === "500") {
            showBottomAlert("error", "Error!", "System Error!");
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

  const deleteCategoryData = async (id) => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    axios
      .delete(
        `${root_url}api/Category?phonenumber_or_email=${phone_number_or_email}&id=${id}&token=${token}`
      )
      .then((res) => {
        console.log(res.data);
        if (res.status === 202) {
          getCategory();
        } else {
          showBottomAlert("error", "Error!", "Check your internet connection!");
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
          showBottomAlert("error", "Error!", "System Error!");
        } else {
          showBottomAlert(
            "error",
            "Error",
            "Please check your internet connection!"
          );
        }
      });
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "#fff", height: "100%", width: "100%" }}
    >
      <View style={category_style.header}>
        <Image
          style={category_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        <Text style={category_style.headerText}>
          "Hey! , here you can create your income , expense category
        </Text>
      </View>
      <View style={category_style.categoryContainer}>
        <TextInput
          mode="outlined"
          theme={{
            colors: { primary: "#fff", placeholder: "#fff", text: "#fff" },
            roundness: 15,
          }}
          outlineColor="#5397c8"
          label="Enter category title"
          style={category_style.input}
          name="category"
          value={category}
          onChangeText={(category) => setCategory(category)}
        />
        <Text style={category_style.inputExp}>eg: food, drink, etc...</Text>
        <View style={category_style.stickerCard}>
          <View style={carousel_style.root}>
            <Card style={carousel_style.cardStyle}>
              <Title style={carousel_style.title}>Choose Sticker</Title>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {topics.map((category) => {
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSticker(category.emoji)}
                    >
                      <Card style={carousel_style.iconsCard}>
                        <Text style={carousel_style.icons}>
                          {category.emoji}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Card>
          </View>
        </View>
        <Text style={category_style.displayTxt}>
          Your Categoy: {"  "}
          {category} {sticker}
        </Text>

        {!isSaved ? (
          <Button
            mode="contained"
            icon="pencil-outline"
            labelStyle={{ fontSize: 15 }}
            style={category_style.createBtn}
            elevation={50}
            uppercase={false}
            onPress={() => {
              sendCategory();
            }}
          >
            Create Category
          </Button>
        ) : (
          <Image
            source={require("../../assets/images/sayinkine.gif")}
            style={category_style.styleGif}
          />
        )}
        {loading === true ? (
          <Image
            source={require("../../assets/images/sayinkine.gif")}
            style={category_style.loader}
          />
        ) : (
          <ScrollView
            style={category_style.scrollContainer}
            persistentScrollbar={true}
            indicatorStyle="white"
          >
            {categoryData.map((categorylist) => {
              return (
                <Card key={categorylist.No} style={category_style.listItem}>
                  <Card.Title
                    title={categorylist.Category_Title}
                    left={(props) => (
                      <Text
                        style={{
                          color: "rgba(0,0,0,0.87)",
                          fontSize: 24,
                          alignSelf: "center",
                          paddingTop: 5,
                        }}
                      >
                        {categorylist.Category_Sticker}
                      </Text>
                    )}
                    right={(props) => (
                      <IconButton
                        style={{ alignSelf: "center" }}
                        {...props}
                        icon="trash-can-outline"
                        color="#CD6155"
                        onPress={() => deleteCategoryData(categorylist.No)}
                      />
                    )}
                  ></Card.Title>
                </Card>
              );
            })}
          </ScrollView>
        )}

        <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
      </View>
    </SafeAreaView>
  );
};

export default Category;

const category_style = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  logo: {
    top: 10,
    left: 20,
    width: 88,
    height: 123,
  },
  headerText: {
    width: 250,
    fontSize: 16,
    textAlign: "center",
    color: "#0d3858",
    fontWeight: "bold",
  },
  categoryContainer: {
    backgroundColor: "#0d3858",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    top: 50,
    marginBottom: 30,
    width: 320,
    alignSelf: "center",
    backgroundColor: "#124d78",
    color: "#fff",
  },
  inputExp: {
    top: 30,
    alignSelf: "flex-start",
    left: 55,
    color: "#fff",
    fontWeight: "bold",
  },
  stickerCard: {
    alignSelf: "center",
    top: 40,
    width: "50%",
  },
  addSticker: {
    alignSelf: "center",
  },
  chooseStickerTxt: {
    alignSelf: "center",
  },
  displayTxt: {
    top: 50,
    marginLeft: 60,
    marginRight: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  createBtn: {
    backgroundColor: "#467ca4",
    borderRadius: 10,
    borderColor: "#ffffff",
    width: "50%",
    top: 65,
    alignSelf: "center",
    marginBottom: 20,
  },
  loader: {
    alignSelf: "center",
    top: 100,
  },
  listItem: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginBottom: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#5397c8",
    width: "95%",
    // height: "40%",
  },
  listExpense: {
    color: "#ff7070",
  },
  listIncome: {
    color: "#36c46f",
  },
  scrollContainer: {
    marginTop: 80,
    marginBottom: 150,
  },
  styleGif: {
    // marginTop: 50,
    top: 65,
    alignSelf: "center",
  },
});

const carousel_style = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 0,
    color: "#fff",
    fontWeight: "bold",
  },
  cardStyle: {
    width: 320,
    height: 93,
    backgroundColor: "#124d78",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#5397c8",
  },
  iconsCard: {
    margin: (0, 7, 7, 7),
    borderRadius: 10,
  },
  icons: {
    padding: 5,
    alignSelf: "center",
    fontSize: 20,
  },
});
