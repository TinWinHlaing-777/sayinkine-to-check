import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ToastAndroid,
} from "react-native";
import {
  Card,
  IconButton,
  Button,
  RadioButton,
  TextInput,
  FAB,
} from "react-native-paper";
import {
  BottomAlert,
  useRefBottomAlert,
} from "react-native-modal-bottom-alert";
import { showBottomAlert } from "react-native-modal-bottom-alert";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Speedometer from "react-native-speedometer-chart";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/EvilIcons";
import ModalDropdown from "react-native-modal-dropdown";
import { useHistory } from "react-router";

const Home = () => {
  const root_url = "https://sayinkineapi.nksoftwarehouse.com/";
  const [user_name, setUserName] = React.useState("");
  const [budgetAmount, setBudgetAmount] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = React.useState("income");
  const [categoryList, setCategoryList] = React.useState([]);
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryItem, setCategoryItem] = React.useState("");
  const [isSaved, setisSaved] = React.useState(false);
  const [categoryData, setCategoryData] = React.useState([]);
  const [incomePercentage, setIncomePercentage] = React.useState(0);
  const [expensePercentage, setExpensePercentage] = React.useState(0);
  const [moment, setMoment] = React.useState("");

  const history = useHistory();

  let categoryArray = [];

  let current = new Date();
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  let curHr = current.getHours();

  const refRBSheet = useRef();
  useEffect(() => {
    if (curHr < 12) {
      setMoment("Morning");
    } else if (curHr < 18) {
      setMoment("Afternoon");
    } else {
      setMoment("Evening");
    }
    getUserNameAndBudget();
    getExpenseIncome();
    getCardData();
    setLoading(true);
  }, []);

  // get method for user name and budget
  const getUserNameAndBudget = async () => {
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
              setBudgetAmount(element.Budget);
              const currentAmount = element.Budget.split(" ");
              const currentBudget = currentAmount[0]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              const currentCurrency = currentAmount[1];
              setBudget(currentBudget);
              setCurrency(currentCurrency);
              setLoading(false);
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

  // get method for select data
  const getSelectData = async () => {
    categoryArray = [];
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");

    try {
      axios
        .get(
          `${root_url}api/Category?phonenumber_or_email=${phone_number_or_email}&token=${token}`
        )
        .then((res) => {
          res.data.forEach((data) => {
            const categoryItem = `${data.Category_Title}      ${data.Category_Sticker}`;
            categoryArray.push(categoryItem);
            setCategoryList(categoryArray);
          });
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

  // post method to save a card
  const postCategory = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    const currency = budgetAmount.split(" ")[1];
    const budget = parseInt(budgetAmount);
    const inputAmount = parseInt(amount);
    if (inputAmount != "" && categoryItem != "" && description != "") {
      try {
        if (inputAmount > budget && checked === "expense") {
          showBottomAlert(
            "error",
            "Error",
            "Your typed amount is more than your current budget"
          );
        } else {
          setisSaved(true);
          const formData = {
            Phone_Number_Or_Email: phone_number_or_email,
            Budget: budget,
            Currency: currency,
            Transaction_Type: checked,
            Category: categoryItem,
            Transaction_Amount: inputAmount,
            Transaction_Details: description,
            Token: token,
          };
          axios
            .post(`${root_url}api/home_post`, formData)
            .then((res) => {
              if (res.status === 202) {
                getUserNameAndBudget();
                setisSaved(false);
                getCardData();
                getExpenseIncome();
                setisSaved(false);
                showBottomAlert(
                  "success",
                  "Congratulation!",
                  "Category Created"
                );
                setAmount("");
                setDescription("");
                setCategoryItem("");
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
                setisSaved(false);
              } else if (err.message.split(" ").pop() === "500") {
                showBottomAlert("error", "Error!", "System Error!");
              } else {
                showBottomAlert(
                  "error",
                  "Error!",
                  "Check your internet connection!"
                );
              }
            });
        }
      } catch (error) {
        alert(error);
      }
    } else {
      showBottomAlert("error", "Error", "Check the Data in your input fields");
    }
  };

  // get method to show a card
  const getCardData = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      axios
        .get(
          `${root_url}api/home/ie?phonenumber_or_email=${phone_number_or_email}&token=${token}`
        )
        .then((res) => {
          setCategoryData(res.data);
        })
        .catch((err) => {
          if (err.message.split(" ").pop() === "401") {
            history.push("/login");
            ToastAndroid.show(
              "Session Expire! Please Login Again!",
              ToastAndroid.LONG
            );
            setisSaved(false);
          } else if (err.message.split(" ").pop() === "500") {
            showBottomAlert("error", "Error!", "System Error!");
          } else {
            showBottomAlert(
              "error",
              "Error!",
              "Check your internet connection!"
            );
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  // get method to show expense and income data
  const getExpenseIncome = async () => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      axios
        .get(
          `${root_url}api/home/ch?phonenumber_or_email=${phone_number_or_email}&token=${token}`
        )
        .then((res) => {
          if (res.status === 202) {
            res.data.forEach((data) => {
              setIncomePercentage(parseFloat(data.Income_Percentage));
              setExpensePercentage(parseFloat(data.Expense_Percentage));
            });
          } else {
            showBottomAlert("error", "Error", "System Error");
          }
        })
        .catch((err) => {
          if (err.message.split(" ").pop() === "401") {
            history.push("/login");
            ToastAndroid.show(
              "Session Expire! Please Login Again!",
              ToastAndroid.LONG
            );
            setisSaved(false);
          } else if (err.message.split(" ").pop() === "500") {
            showBottomAlert("error", "Error!", "System Error!");
          } else {
            showBottomAlert(
              "error",
              "Error!",
              "Check your internet connection!"
            );
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  // delete method to remove specific card
  const deleteCard = async (id, amount, type) => {
    const phone_number_or_email = await AsyncStorage.getItem("@ph_number");
    const token = await AsyncStorage.getItem("@token");
    try {
      const cardId = parseInt(id);
      const dataAmount = parseInt(amount);
      const budget = parseInt(budgetAmount);
      axios
        .delete(
          `${root_url}api/home?no=${cardId}&phonenumber_or_email=${phone_number_or_email}&budget=${budget}&transaction_amount=${dataAmount}&transaction_type=${type}&token=${token}`
        )
        .then((res) => {
          getUserNameAndBudget();
          getCardData();
          if (res.status === 202) {
            getUserNameAndBudget();
            getCardData();
            getExpenseIncome();
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
            setisSaved(false);
          } else if (err.message.split(" ").pop() === "500") {
            showBottomAlert("error", "Error!", "System Error!");
          } else {
            showBottomAlert(
              "error",
              "Error!",
              "Check your internet connection!"
            );
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <SafeAreaView
      style={{ height: "100%", backgroundColor: "#fff", width: "100%" }}
    >
      <View style={home_style.header}>
        <Image
          style={home_style.logo}
          source={require("../../assets/images/logo.png")}
        />
        {loading === true ? (
          <Image
            source={require("../../assets/images/sayinkine.gif")}
            style={{ top: 40 }}
          />
        ) : (
          <Text style={home_style.headerText}>
            Good {moment}, {"\n     "} <Text>{user_name}</Text>
          </Text>
        )}
      </View>
      <View style={home_style.body}>
        <Card style={home_style.card}>
          <Card.Content style={home_style.cardContent}>
            <Text style={home_style.cardText}>Budget Left</Text>
            {loading === true ? (
              <Image source={require("../../assets/images/sayinkine.gif")} />
            ) : (
              <Text style={home_style.budgetAmount}>
                {budget} {currency}
              </Text>
            )}
          </Card.Content>
        </Card>
        <Text style={home_style.chartHeader}>
          {month[current.getMonth()]},{"  "}
          {current.getFullYear()}
        </Text>
        <Card.Content style={home_style.chartContainer}>
          <Speedometer
            value={incomePercentage}
            totalValue={100}
            size={150}
            outerColor="#d3d3d3"
            internalColor="#006994"
            showText
            text="Income"
            textStyle={{ color: "#006994", fontWeight: "bold" }}
            showLabels
            labelStyle={{ color: "blue" }}
            labelFormatter={(number) => `${number}%`}
            showPercent
            percentStyle={{ color: "#0d3858" }}
            style={home_style.chart}
          />
          <Speedometer
            value={expensePercentage}
            totalValue={100}
            size={150}
            outerColor="#d3d3d3"
            internalColor="#c2b280"
            showText
            text="Expense"
            textStyle={{ color: "#c2b280", fontWeight: "bold" }}
            showLabels
            labelStyle={{ color: "blue" }}
            labelFormatter={(number) => `${number}%`}
            showPercent
            percentStyle={{ color: "#0d3858" }}
            style={home_style.chart}
          />
        </Card.Content>
        <Text style={home_style.today_text}>Today Transaction</Text>
        {loading === true ? (
          <Image
            source={require("../../assets/images/sayinkine.gif")}
            style={home_style.loader}
          />
        ) : (
          <ScrollView
            style={home_style.scrollContainer}
            persistentScrollbar={true}
            indicatorStyle="white"
          >
            {categoryData.map((category) => {
              if (category.Transaction_Type == "expense") {
                return (
                  <Card style={home_style.listItem} key={category.No}>
                    <Card.Title
                      title={category.Category_Title}
                      subtitle={category.Transaction_Type}
                      subtitleStyle={{ textTransform: "capitalize" }}
                      left={(props) => (
                        <Text
                          style={{
                            color: "rgba(0,0,0,0.87)",
                            fontSize: 24,
                            alignSelf: "center",
                            paddingTop: 5,
                          }}
                        >
                          {category.Category_Sticker}
                        </Text>
                      )}
                      right={(props) => (
                        <View
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Text style={home_style.listExpense}>
                            {category.Transaction_Amount} mmk
                          </Text>
                          <IconButton
                            style={home_style.delete}
                            {...props}
                            icon="trash-can-outline"
                            color="#CD6155"
                            onPress={() =>
                              deleteCard(
                                category.No,
                                category.Transaction_Amount,
                                category.Transaction_Type
                              )
                            }
                          />
                        </View>
                      )}
                    ></Card.Title>
                  </Card>
                );
              } else if (category.Transaction_Type == "income") {
                return (
                  <Card style={home_style.listItem} key={category.No}>
                    <Card.Title
                      title={category.Category_Title}
                      subtitle={category.Transaction_Type}
                      subtitleStyle={{ textTransform: "capitalize" }}
                      left={(props) => (
                        <Text
                          style={{
                            color: "rgba(0,0,0,0.87)",
                            fontSize: 24,
                            alignSelf: "center",
                            paddingTop: 5,
                          }}
                        >
                          {category.Category_Sticker}
                        </Text>
                      )}
                      right={(props) => (
                        <View
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Text style={home_style.listIncome}>
                            {category.Transaction_Amount} mmk
                          </Text>
                          <IconButton
                            style={home_style.delete}
                            {...props}
                            icon="trash-can-outline"
                            color="#CD6155"
                            onPress={() =>
                              deleteCard(
                                category.No,
                                category.Transaction_Amount,
                                category.Transaction_Type
                              )
                            }
                          />
                        </View>
                      )}
                    ></Card.Title>
                  </Card>
                );
              }
            })}
          </ScrollView>
        )}
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={500}
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
        <TouchableOpacity>
          <Icon
            name="close"
            size={24}
            style={home_style.close_tbn}
            onPress={() => refRBSheet.current.close()}
          />
        </TouchableOpacity>
        <View>
          <View style={dialog_style.radioContainer}>
            <RadioButton
              value="income"
              status={checked === "income" ? "checked" : "unchecked"}
              onPress={() => setChecked("income")}
              color="#0d3858"
            />
            <Text style={{ marginRight: 20 }}>Income</Text>
            <RadioButton
              value="expense"
              status={checked === "expense" ? "checked" : "unchecked"}
              onPress={() => setChecked("expense")}
              color="#0d3858"
            />
            <Text>Expense</Text>
          </View>

          <ModalDropdown
            defaultValue="Select Category"
            options={categoryList}
            isFullWidth={true}
            style={dialog_style.dropDown}
            dropdownTextStyle={{ fontSize: 15 }}
            textStyle={{ fontSize: 15 }}
            onSelect={(selectData) => setCategoryItem(categoryList[selectData])}
          />
          <View style={dialog_style.inputFields}>
            {checked == "income" ? (
              <TextInput
                mode="outlined"
                style={dialog_style.input}
                theme={{ colors: { primary: "#0D3858" }, roundness: 10 }}
                label="Income Amount"
                keyboardType="numeric"
                outlineColor="#0D3858"
                name="amount"
                value={amount}
                onChangeText={(amount) => setAmount(amount)}
              />
            ) : (
              <TextInput
                mode="outlined"
                style={dialog_style.input}
                theme={{ colors: { primary: "#0D3858" }, roundness: 10 }}
                label="Expense Amount"
                keyboardType="numeric"
                outlineColor="#0D3858"
                name="amount"
                value={amount}
                onChangeText={(amount) => setAmount(amount)}
              />
            )}
            <TextInput
              mode="outlined"
              style={dialog_style.description}
              theme={{ colors: { primary: "#0D3858" }, roundness: 10 }}
              label="Description"
              outlineColor="#0D3858"
              name="description"
              value={description}
              onChangeText={(description) => setDescription(description)}
            />
          </View>

          {!isSaved ? (
            <Button
              mode="contained"
              style={dialog_style.saveBtn}
              onPress={() => {
                postCategory();
                refRBSheet.current.close();
              }}
            >
              Save
            </Button>
          ) : (
            <Image
              source={require("../../assets/images/sayinkine_loading.gif")}
              style={dialog_style.styleGif}
            />
          )}
        </View>
      </RBSheet>
      <BottomAlert ref={(ref) => useRefBottomAlert(ref)} />
      <FAB
        style={home_style.fab}
        icon="plus"
        color="#2471A3"
        onPress={() => {
          getSelectData();
          refRBSheet.current.open();
        }}
      />
    </SafeAreaView>
  );
};

export default Home;

const home_style = StyleSheet.create({
  header: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  logo: {
    top: 10,
    width: 88,
    height: 123,
  },
  headerText: {
    fontSize: 20,
    marginTop: 30,
    color: "#0d3858",
    fontWeight: "bold",
  },
  body: {
    backgroundColor: "#0d3858",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: 317,
    height: 100,
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5397c8",
  },
  cardContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 20,
    color: "#0d3858",
    paddingBottom: 10,
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d3858",
  },
  chartHeader: {
    top: 20,
    left: 20,
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#fff",
  },
  chartContainer: {
    marginTop: 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  chart: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 15,
  },
  addMore: {
    alignSelf: "center",
    marginTop: 5,
    color: "#fff",
  },
  today_text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
    fontStyle: "italic",
    alignSelf: "center",
  },
  listItem: {
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
    alignSelf: "center",
  },
  listExpense: {
    color: "#ff7070",
    fontWeight: "bold",
  },
  listIncome: {
    color: "#36c46f",
  },
  scrollContainer: {
    marginBottom: "50%",
  },
  close_tbn: {
    left: 20,
  },
  delete: {
    marginLeft: 20,
  },
  loader: {
    alignSelf: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
    backgroundColor: "#fff",
  },
});

const dialog_style = StyleSheet.create({
  radioContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  inputFields: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 320,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderColor: "#0D3858",
  },
  description: {
    width: 320,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderColor: "#0D3858",
  },
  selectionInput: {
    borderWidth: 1,
    borderColor: "#0D3858",
    width: 320,
    borderRadius: 10,
    height: 55,
  },
  saveBtn: {
    marginTop: 30,
    width: 200,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#0d3858",
  },
  dropDown: {
    alignSelf: "center",
    width: 320,
    height: 55,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#0d3858",
    paddingTop: 18,
    paddingBottom: 20,
    paddingLeft: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  styleGif: {
    marginTop: 30,
    alignSelf: "center",
  },
});
