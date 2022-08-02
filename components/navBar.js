/*
* 自绘导航栏
*/
import React, { Component } from 'react';
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import { NavBarPlaceholderButton } from './navBarButton';

// const SCREEN_WIDTH = Dimensions.get('window').width;


const NAV_APLIT_LINE_WIDTH = 1;

class NavigationBar extends Component {

  static propTypes = {
    ...ViewPropTypes,
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
    statueBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    title: PropTypes.string,
    titleColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    statueBarBackgroundColor: PropTypes.string,
    splitLineColor: PropTypes.string,
  };

  static defaultProps = {
    ...View.defaultProps,
    leftButton: null,
    rightButton: null,
    statueBarStyle: 'default',
    title: '',
    titleColor: Theme.NavigationBar.Title.Color,
    backgroundColor: Theme.NavigationBar.BGColor,
    statueBarBackgroundColor: Theme.NavigationBar.BGColor,
    splitLineColor: Theme.NavigationBar.SplitLineColor,
  };


  render() {

    const {leftButton = (<NavBarPlaceholderButton/>)} = this.props;
    const {rightButton = (<NavBarPlaceholderButton/>)} = this.props;
    const {statueBarStyle=Theme.StatusBarStyle} = this.props;
    const {backgroundColor} = this.props;
    let {statueBarBackgroundColor, splitLineColor} = this.props;
    const {title='', titleColor} = this.props;

    if (!statueBarBackgroundColor) {
      if (backgroundColor) {
        statueBarBackgroundColor = backgroundColor;
      }
    }
    if (!splitLineColor) {
      if (backgroundColor) {
        splitLineColor = backgroundColor;
      }
    }

    return (

      <View style={{position: 'absolute', left: 0, right: 0, zIndex: 99}}>
        <StatusBar barStyle={statueBarStyle} />

        <View style={[
          styles.statusBar,
          statueBarBackgroundColor&&{backgroundColor: statueBarBackgroundColor},
        ]}
        />

        <View style={[styles.navBar, backgroundColor&&{backgroundColor: backgroundColor}]} >

          {leftButton}

          <Text style={[styles.nameHeader, titleColor&&{color:titleColor}]}>
            {title}
          </Text>

          {rightButton}

        </View>

        <View style={[styles.splitLine, splitLineColor&&{backgroundColor: splitLineColor}]}/>

      </View>

    );
  }

}


const styles = StyleSheet.create({
  statusBar: {
    height: ThemeMgr.StatusBarHeight,
    alignSelf: 'stretch',
    // width: SCREEN_WIDTH,
    backgroundColor: Theme.NavigationBar.BGColor,
  },

  navBar: {
    height: Theme.NavigationBar.Height - NAV_APLIT_LINE_WIDTH,
    alignSelf: 'stretch',
    backgroundColor: Theme.NavigationBar.BGColor,

    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  nameHeader: {
    flex: 1,
    color: Theme.NavigationBar.Title.Color,
    fontSize: Theme.NavigationBar.Title.Size,
    textAlign: 'left',
    alignSelf: 'center',
  },

  splitLine: {
    height: NAV_APLIT_LINE_WIDTH,
    alignSelf: 'stretch',
    backgroundColor: Theme.NavigationBar.SplitLineColor,
  },

});


export { NavigationBar };
