import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  Alert
} from 'react-native';
import {
  NavigationContainer,
  StackActions
} from '@react-navigation/native';

import { firebaseConfig } from './src/components/auth_screens/config';
import * as firebase from 'firebase';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CoronaInfo from './src/components/CoronaInfo';
import CoronaInfoGlobal from './src/components/CoronaInfoGlobal';
import CoronaInfoByCountry from './src/components/CoronaInfoByCountry';
import SpesificCountry from './src/components/SpesificCountry';
import FetchCitiesWithBikes from './src/components/GetCityBikes';
import BikesMapped from './src/components/MapBikesWithMarkers';
import AboutTheApp from './src/components/About';
import SearchByCountry from './src/components/SearchByCountry';
import HSLBusStops from './src/components/HSLClosestStops';
import AuthApp from './src/components/auth_screens/AuthStack';
import FavouriteCountries from './src/components/Favourites';


export default function App() {


  const styles = StyleSheet.create({
    main: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: { // Possible, for reference.
      borderColor: 'gold',
      width: 100,
      height: 50,
      borderWidth: 3,
      justifyContent: 'center',
      alignContent: 'center',
    },
    tinyLogo: { // For images, default setting.
      width: 100,
      height: 100,
    }
  });

  const [user, setUser] = React.useState(null) // Creating an artificial user-object to be able to render items / components according to it.

  // UseEffecting this every time the user changes; this way, renders happen accordingly.
  function componentDidMount() {

    if (!firebase.apps.length) { // No need to init the Firebase DB twice, and cannot, since there is an Error if duplicates are made.
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log(user)
        setUser(user)
      } else {
        setUser(null);

      }
    })
  }

  const SignOut = () => { // After signing out, calling AuthApp component again. A failsafe if the user-info is slow during authentication.
    firebase.auth().signOut();
    setUser(null);
    Alert.alert("Logged out", "Logged out your account succesfully")
    return (
      <AuthApp />
    )
  }

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();


  function HomeTabs() { // Nesting this navigation component with the MAIN RETURN.
    return (
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: '#cee0ca',
          }
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Corona Information') {
              iconName = 'md-home';
            } else if (route.name === 'Calculator Example') {
              iconName = 'md-settings';
            } else if (route.name === 'Global Corona Situation') {
              iconName = 'md-bulb';
            } else if (route.name === 'Corona Situation By Country') {
              iconName = 'md-globe';
            } else if (route.name === 'Spesific Country') {
              iconName = 'md-settings';
            } else if (route.name === 'Get stations') {
              iconName = 'md-bicycle';
            } else if (route.name === 'Search By Country') {
              iconName = 'md-map';
            } else if (route.name === 'Bus Stops') {
              iconName = 'md-bus';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Corona Information" component={CoronaInfo} />
        <Tab.Screen name="Global Corona Situation" component={CoronaInfoGlobal} />
        <Tab.Screen name="Corona Situation By Country" component={CoronaInfoByCountry} />
        <Tab.Screen name="Search By Country" component={SearchByCountry} />
        <Tab.Screen name="Get stations" component={FetchCitiesWithBikes} />
        <Tab.Screen name="Bus Stops" component={HSLBusStops} />
      </Tab.Navigator>
    );
  }

  function DrawerNavigator() { // Nesting navigations.
    return (
      <Drawer.Navigator initialRouteName="Corona Mobile App."
        drawerStyle={{ backgroundColor: 'white' }}>
        <Drawer.Screen name="Home"
          component={HomeTabs} options={{
            title: 'Home',
            drawerIcon: ({ focused, size }) => (
              <AntDesign
                name="home"
                size={size}
                color={focused ? '#33bf2c' : '#33bf2c'}
              />
            ),
          }} />
        <Drawer.Screen name="About"
          component={AboutTheApp} options={{
            title: 'About',
            drawerIcon: ({ focused, size }) => (
              <AntDesign
                name='bulb1'
                size={size}
                color={focused ? '#fff829' : '#fff829'}
              />
            ),
          }} />
        <Drawer.Screen name="Favourites"
          component={FavouriteCountries} options={{
            title: 'Favourites',
            drawerIcon: ({ focused, size }) => (
              <AntDesign
                name='heart'
                size={size}
                color={focused ? '#e61255' : '#e61255'}
              />
            ),
          }} />
        <Drawer.Screen name="Log Out"
          component={SignOut} options={{
            title: 'Logout',
            drawerIcon: ({ focused, size }) => (
              <AntDesign
                name='logout'
                size={size}
                color={focused ? '#e61255' : '#e61255'}
              />
            ),
          }} />
      </Drawer.Navigator>
    )
  }

  useEffect(() => { componentDidMount() },
    [user]);

  if (!user) { // If there is no user, logIn / signUp screens will be displayed. Signing up to the database will net one access to the app.
    return (
      <AuthApp />
    )
  }

  return ( // Creating nested NAVIGATION in order to prevent the user from accessing e.g. SpesificCountry-component without props. Rendered when USER is logged in.
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Corona Mobile App." component={DrawerNavigator} />
        <Stack.Screen name="Spesific Country" component={SpesificCountry} />
        <Stack.Screen name="Bikes on the Map" component={BikesMapped} />
        <Stack.Screen name="Auth Screen" component={AuthApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* LEFT HERE FOR REFERENCE. <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View> */
