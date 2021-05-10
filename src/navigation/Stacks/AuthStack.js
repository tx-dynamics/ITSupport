import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../../screens/Login';
import SignUp from '../../screens/SignUp';
import ForgetPass from '../../screens/ForgetPass';

//AuthStack
const authStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        headerShown: false,
      },
    },
    ForgetPass: {
      screen: ForgetPass,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {initialRouteName: 'SignUp'},
);

export default authStack;
