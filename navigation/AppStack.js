import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ActiveClientListScreen from "../screens/ActiveClientListScreen";
import InActiveClientListScreen from "../screens/InActiveClientListScreen";
import InformationScreen from "../screens/InformationScreen";
import NotificationScreen from "../screens/NotificationScreen";
import EvalScreen from "../screens/EvalScreen";
import EditEvalScreen from "../screens/EditEvalScreen";
import NotificationScreenHistory from "../screens/NotificationScreenHistory";
import PromoDetailScreen from "../screens/PromoDetailScreen";
import AddVideoScreen from "../screens/AddVideoScreen";
import CoachDetailsScreen from "../screens/CoachDetailsScreen";
import UploadScreen from "../screens/UploadScreen";
import SectionScreen from "../screens/SectionScreen";
import ClientDetailsScreen from "../screens/ClientDetailsScreen";
import ClientResultScreen from "../screens/ClientResultScreen";
import getFocusedRouteNameFromRoute from "@react-navigation/native";
// import SpinScreen from "../components/SpinScreen";
import ScanScreen from "../screens/ScanScreen";
import Colors from "../constants/Colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import EditClientScreen from "../screens/EditClientScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// console.log("get height", StatusBar.currentHeight);
// import ClientDetailsScreen from "../screens/ClientDetailsScreen";
// import CoachDetailsScreen from "../screens/ProfileScreen";
// import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

let routeName;
// const AppStack = () => {
// const [isFirstLaunch, setIsFirstLaunch] = useState(null);

// useEffect(() => {
//   AsyncStorage.getItem("alreadyLaunched").then((value) => {
//     if (value == null) {
//       AsyncStorage.setItem("alreadyLaunched", "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
//       setIsFirstLaunch(true);
//     } else {
//       setIsFirstLaunch(false);
//     }
//   }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
// }, []);

// if (isFirstLaunch === null) {
//   return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
// } else if (isFirstLaunch == true) {
//   routeName = "Onboarding";
// } else {
//   routeName = "Home";
// }
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       tabBarOptions={{
//         activeTintColor: Colors.noExprimary,
//       }}
//       style={{ backgroundColor: "blue" }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeStack}
//         options={{
//           tabBarLabel: "Inicio",
//           tabBarIcon: ({ color, focused }) =>
//             focused ? (
//               <Icon name="ios-home" color={color} size={30} />
//             ) : (
//               <Icon name="ios-home" color={color} size={26} />
//             ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={ProfileStackScreen}
//         options={{
//           tabBarLabel: "Perfil",
//           tabBarIcon: ({ color }) => (
//             <Icon name="person" color={color} size={26} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{
//           tabBarLabel: "Configuraciones",
//           tabBarIcon: ({ color }) => (
//             <Icon name="settings" color={color} size={26} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

const HomeTabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: Colors.noExprimary,
        // headerShown: true,
        labelStyle: { fontSize: 12 },
      }}
      style={{ backgroundColor: "blue" }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ route }) => ({
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Icon name="ios-home" color={color} size={30} />
            ) : (
              <Icon name="ios-home" color={color} size={26} />
            ),
        })}
      />
      <Tab.Screen
        name="Clientes"
        component={ClientStack}
        options={{
          tabBarLabel: "Clientes",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Icon name="people" color={color} size={30} />
            ) : (
              <Icon name="people" color={color} size={26} />
            ),
        }}
      />
      <Tab.Screen
        name="Informacion"
        component={InformationStack}
        options={{
          tabBarLabel: "Informacion",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <Icon name="information-circle" color={color} size={30} />
            ) : (
              <Icon name="information-circle" color={color} size={26} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const InformationStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Information"
      component={InformationScreen}
      options={({ navigation }) => ({
        title: "Subir Informacion",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="PromoDetail"
      component={PromoDetailScreen}
      options={({ navigation }) => ({
        title: "Detalles",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="AddVideoScreen"
      component={AddVideoScreen}
      options={({ navigation }) => ({
        title: "Agregar Video",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="SectionScreen"
      component={SectionScreen}
      options={({ navigation }) => ({
        title: "Elegir Seccion",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="UploadScreen"
      component={UploadScreen}
      options={({ navigation }) => ({
        title: "Modificar Video",
        headerShown: true,
      })}
    />
    {/* <Stack.Screen
      name="Spin"
      component={SpinScreen}
      options={({ navigation }) => ({
        title: "Spin that joint!",
        headerShown: true,
      })}
    /> */}
  </Stack.Navigator>
);

function TabStack() {
  return (
    <TopTab.Navigator
      initialRouteName="Feed"
      tab
      tabBarOptions={{
        activeTintColor: "#FFFFFF",
        inactiveTintColor: "#F8F8F8",

        style: {
          marginTop: 50,
          backgroundColor: Colors.noExprimary,
        },
        labelStyle: {
          textAlign: "center",
        },
        indicatorStyle: {
          borderBottomColor: "black",
          borderBottomWidth: 2,
        },
      }}
    >
      <TopTab.Screen
        name="Activos"
        component={ActiveClientListScreen}
        options={{
          tabBarLabel: "Activos",
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="home" color={color} size={size} />
          // ),
        }}
      />
      <TopTab.Screen
        name="Inactivos"
        component={InActiveClientListScreen}
        options={{
          tabBarLabel: "Inactivos",
          // tabBarIcon: ({ color, size }) => (
          //   <MaterialCommunityIcons name="settings" color={color} size={size} />
          // ),
        }}
      />
    </TopTab.Navigator>
  );
}
const ClientStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Clients"
      component={ActiveClientListScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    />
    {/* <Stack.Screen
      name="Clients"
      component={InActiveClientListScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    /> */}
    <Stack.Screen
      name="Client"
      component={ClientDetailsScreen}
      options={({ navigation }) => ({
        title: "Cliente Detalles",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="EditClient"
      component={EditClientScreen}
      options={({ navigation }) => ({
        title: "Editar Cliente",
        headerShown: true,
      })}
    />
  </Stack.Navigator>
);

const AppStack = ({ navigation }) => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={HomeTabs}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="Coach"
      component={CoachDetailsScreen}
      options={({ navigation }) => ({
        title: "Coach Detalles",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={({ navigation }) => ({
        title: "Notificaciones",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="NotificationHistory"
      component={NotificationScreenHistory}
      options={({ navigation }) => ({
        title: "Notificaciones Pasados",
        headerShown: true,
      })}
    />
    <Stack.Screen
      name="Scan"
      component={ScanScreen}
      options={({ route }) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="Client"
      component={ClientResultScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: true,
      })}
    />

    <Stack.Screen
      name="Edit"
      component={EditProfileScreen}
      options={{
        title: "Editar Perfil",
      }}
    />
    <Stack.Screen
      name="Eval"
      component={EvalScreen}
      options={{
        title: "Evaluacion",
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Edit Eval"
      component={EditEvalScreen}
      options={{
        title: "Editar Evaluacion",
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

export default AppStack;
