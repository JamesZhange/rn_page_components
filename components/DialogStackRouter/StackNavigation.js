import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';



export default class StackNavigation {

  constructor() {

  }

  static createStackNavigator = (dialogs) => {
    let routeConfigMap = {};
    for (let dialog of dialogs) {
      let navOpt = {
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      };
      if (dialog.navigationOptions) {
        Object.assign(navOpt, dialog.navigationOptions);
      }
      routeConfigMap[dialog.key] = {
        screen: dialog.component,
        navigationOptions: navOpt,
      };
    }
    return createAppContainer(createStackNavigator(routeConfigMap));
  }



}

