import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainTabNavigator from "./MainTabNavigator";
import CategoriesScreen from "../screens/CategoriesScreen";
import ServiceDetailsScreen from "../screens/ServiceDetailsScreen";
import FindingProfessionalScreen from "../screens/FindingProfessionalScreen";
import ProfessionalAssignedScreen from "../screens/ProfessionalAssignedScreen";
import LiveTrackingScreen from "../screens/LiveTrackingScreen";
import PaymentScreen from "../screens/PaymentScreen";
import RatingReviewScreen from "../screens/RatingReviewScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import SavedAddressesScreen from "../screens/SavedAddressesScreen";
import SOSScreen from "../screens/SOSScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";
import AboutScreen from "../screens/AboutScreen";
import AIAssistantScreen from "../screens/AIAssistantScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated } = useApp();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#F8FAFC" },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
          <Stack.Screen
            name="FindingProfessional"
            component={FindingProfessionalScreen}
            options={{ animation: "fade" }}
          />
          <Stack.Screen name="ProfessionalAssigned" component={ProfessionalAssignedScreen} />
          <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen
            name="RatingReview"
            component={RatingReviewScreen}
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
          <Stack.Screen
            name="SOS"
            component={SOSScreen}
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
