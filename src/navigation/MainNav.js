import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import Login from '../screens/Login';
//Stacks
import HomeStack from '../navigation/Stacks/HomeStack';
import AuthStack from './Stacks/AuthStack';

const AppNavigator = createSwitchNavigator(
  {
    Auth: {
      screen: AuthStack,
    },
    App: {
      screen: HomeStack,
    },
  },
  {
    initialRouteName: 'Auth',
  },
);

export default createAppContainer(AppNavigator);
