import React, { Component, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
/* import { firebase } from '../../firebase'; */
import {
  Appbar,
  Avatar,
  Button,
  TextInput,
  IconButton,
  Snackbar,
  DataTable,
  ActivityIndicator, Colors
} from "react-native-paper";
/* import "firebase/auth"; */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

/* var background = require('./assets/citybackground.jpg'); */
var logo = require("../icon.png");
import firebase from "firebase/app";
import { fb } from "../../firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const db = fb.firestore();

const MyGrades = ({ route, navigation }) => {
  const { sy, level, type, lrn, name, profile } = route.params;
  const [average1st, setAverage1st] = useState([]);
  const [average2nd, setAverage2nd] = useState([]);
  const [average3rd, setAverage3rd] = useState([]);
  const [average4th, setAverage4th] = useState([]);

  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection("grades")
      .where("level", "==", level)
      .where("sy", "==", sy)
      .where("lrn", "==", lrn)
      .onSnapshot((querySnapshot) => {
        const gradesArr = querySnapshot.docs.map((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        });

        gradesArr.map((grades) => grades.grading === "1st" && setAverage1st(oldArray => [...oldArray, grades.grade]))
        gradesArr.map((grades) => grades.grading === "2nd" && setAverage2nd(oldArray => [...oldArray, grades.grade]))
        gradesArr.map((grades) => grades.grading === "3rd" && setAverage3rd(oldArray => [...oldArray, grades.grade]))
        gradesArr.map((grades) => grades.grading === "4th" && setAverage4th(oldArray => [...oldArray, grades.grade]))

        setGrades(gradesArr);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const onDismissSnackBar = () => setSnackbarError(false);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ backgroundColor: "white" }}>
        <View style={{ backgroundColor: "white" }}>
          <IconButton
            icon="arrow-left"
            color="gray"
            size={30}
            onPress={() => navigation.goBack(null)}
            style={{ marginTop: 10 }}
          />
        </View>
        <View style={{ padding: 20, marginTop: -10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
              <Text style={{ fontSize: 18 }}>
                <Text style={{ fontWeight: "bold" }}>Lrn:</Text> {lrn}
              </Text>
            </View>
            <Avatar.Image
              size={60}
              source={{ uri: profile }}
              style={{ marginTop: -10 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 18 }}>
              <Text style={{ fontWeight: "bold" }}>Grade:</Text> {level}
            </Text>
            <Text style={{ fontSize: 18 }}>
              <Text style={{ fontWeight: "bold" }}>School Year:</Text> {sy}
            </Text>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#05a148",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 15,
                color: "white",
              }}
            >
              1st {level === "Grade11" || level === "Grade12" ? "Quarter" : "Grading"}
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator animating={true} color={Colors.red800} style={{marginTop: 20}}/>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Subjects</DataTable.Title>
                <DataTable.Title numeric>Grades</DataTable.Title>
                <DataTable.Title numeric>Add Comment</DataTable.Title>
              </DataTable.Header>
              {grades.map((gradeLoop, index) => (
                  gradeLoop.grading === "1st" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>
                          {gradeLoop.grade}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                          <IconButton
                            icon={type === "Admin" ? "dots-vertical" : "comment-outline"}
                            color="gray"
                            size={30}
                            onPress={() => type === "Admin" ? navigation.navigate("UpdateGrade", {
                              gradeParam: gradeLoop
                            }) : navigation.navigate("AddComment", {
                              gradeParam: gradeLoop
                            })}
                            style={{ marginTop: 10 }}
                          />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                      <></>
                  )
              ))}

              <DataTable.Row>
                <DataTable.Cell>
                    <Text style={{fontWeight: 'bold'}}>Average</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {(average1st.reduce((a, b) => a + b, 0) / average1st.length).toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell numeric></DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          )}
        </View>
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#05a148",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 15,
                color: "white",
              }}
            >
              2nd {level === "Grade11" || level === "Grade12" ? "Quarter" : "Grading"}
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator animating={true} color={Colors.red800} style={{marginTop: 20}}/>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Subjects</DataTable.Title>
                <DataTable.Title numeric>Grades</DataTable.Title>
                <DataTable.Title numeric>Add Comment</DataTable.Title>
              </DataTable.Header>
              {grades.map((gradeLoop, index) => (
                  gradeLoop.grading === "2nd" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>
                          {gradeLoop.grade}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                          <IconButton
                            icon={type === "Admin" ? "dots-vertical" : "comment-outline"}
                            color="gray"
                            size={30}
                            onPress={() => type === "Admin" ? navigation.navigate("UpdateGrade", {
                              gradeParam: gradeLoop
                            }) : navigation.navigate("AddComment", {
                              gradeParam: gradeLoop
                            })}
                            style={{ marginTop: 10 }}
                          />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                      <></>
                  )
              ))}

              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={{fontWeight: 'bold'}}>Average</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {(average2nd.reduce((a, b) => a + b, 0) / average2nd.length).toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell numeric></DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          )}
        </View>
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#05a148",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 15,
                color: "white",
              }}
            >
              3rd {level === "Grade11" || level === "Grade12" ? "Quarter" : "Grading"}
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator animating={true} color={Colors.red800} style={{marginTop: 20}}/>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Subjects</DataTable.Title>
                <DataTable.Title numeric>Grades</DataTable.Title>
                <DataTable.Title numeric>Add Comment</DataTable.Title>
              </DataTable.Header>
              {grades.map((gradeLoop, index) => (
                  gradeLoop.grading === "3rd" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>
                          {gradeLoop.grade}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                          <IconButton
                            icon={type === "Admin" ? "dots-vertical" : "comment-outline"}
                            color="gray"
                            size={30}
                            onPress={() => type === "Admin" ? navigation.navigate("UpdateGrade", {
                              gradeParam: gradeLoop
                            }) : navigation.navigate("AddComment", {
                              gradeParam: gradeLoop
                            })}
                            style={{ marginTop: 10 }}
                          />
                      </DataTable.Cell>
                      </DataTable.Row>
                  ) : (
                      <></>
                  )
              ))}

              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={{fontWeight: 'bold'}}>Average</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {(average3rd.reduce((a, b) => a + b, 0) / average3rd.length).toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell numeric></DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          )}
        </View>
        <View style={{ padding: 20 }}>
          <View
            style={{
              backgroundColor: "#05a148",
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 15,
                color: "white",
              }}
            >
                4th {level === "Grade11" || level === "Grade12" ? "Quarter" : "Grading"}
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator animating={true} color={Colors.red800} style={{marginTop: 20}}/>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Subjects</DataTable.Title>
                <DataTable.Title numeric>Grades</DataTable.Title>
                <DataTable.Title numeric>Add Comment</DataTable.Title>
              </DataTable.Header>
              {grades.map((gradeLoop, index) => (
                  gradeLoop.grading === "4th" ? (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{gradeLoop.subject}</DataTable.Cell>
                      <DataTable.Cell numeric>
                          {gradeLoop.grade}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                          <IconButton
                            icon={type === "Admin" ? "dots-vertical" : "comment-outline"}
                            color="gray"
                            size={30}
                            onPress={() => type === "Admin" ? navigation.navigate("UpdateGrade", {
                              gradeParam: gradeLoop
                            }) : navigation.navigate("AddComment", {
                              gradeParam: gradeLoop
                            })}
                            style={{ marginTop: 10 }}
                          />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ) : (
                      <></>
                  )
              ))}

              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={{fontWeight: 'bold'}}>Average</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {(average4th.reduce((a, b) => a + b, 0) / average4th.length).toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell numeric></DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default MyGrades;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logoProfile: {
    width: 145,
    height: 145,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 15,
  },
  title: {
    color: "black",
    marginBottom: 0,
    fontSize: 15,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  usernameInput: {
    fontSize: 15,
    flex: 1,
    borderRadius: 25,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  passwordInput: {
    fontSize: 15,
    flex: 1,
    borderRadius: 25,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
  },
  iconInput: {
    padding: 10,
  },
  appButtonContainer: {
    elevation: 4,
    marginTop: 15,
    backgroundColor: "#05a148",
    borderRadius: 25,
    width: "100%",
    height: 50,
    marginBottom: 14,
    fontSize: 25,
  },
  appButtonTextSignUp: {
    fontSize: 14,
    color: "black",
    alignSelf: "center",
  },
  bottom: {
    backgroundColor: "white",
    elevation: 0,
  },
});
