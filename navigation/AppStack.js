import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ClientListScreen from "../screens/ClientListScreen";
import CoachDetailsScreen from "../screens/CoachDetailsScreen";
import ClientDetailsScreen from "../screens/ClientDetailsScreen";
import ClientResultScreen from "../screens/ClientResultScreen";
import ScanScreen from "../screens/ScanScreen";
import Colors from "../constants/Colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import EditClientScreen from "../screens/EditClientScreen";

// import ClientDetailsScreen from "../screens/ClientDetailsScreen";
// import CoachDetailsScreen from "../screens/ProfileScreen";
// import ProfileScreen from "../screens/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

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

const AppStack = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({})}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Clientes" component={ClientStack} />
    </Tab.Navigator>
  );
};

const ClientStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Clients"
      component={ClientListScreen}
      options={({ navigation }) => ({
        title: "",
        headerShown: false,
      })}
    />
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

const HomeStack = ({ navigation }) => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={HomeScreen}
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
      name="Scan"
      component={ScanScreen}
      options={({ navigation }) => ({
        title: "Iniciar Sesion",
        headerShown: true,
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
  </Stack.Navigator>
);

export default AppStack;
