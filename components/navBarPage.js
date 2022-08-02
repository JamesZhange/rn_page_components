import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ViewPropTypes,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import BasePage from './basePage';
import { NavBarLeftBackButton, NavBarPlaceholderButton } from './navBarButton';
import { NavigationBar } from './navBar';
import KeyboardSpace from './keyboardSpace/KeyboardSpace';
import LinearGradient from 'react-native-linear-gradient';


const styles = StyleSheet.create({

  containerPage: {
    flex: 1,
    backgroundColor: Theme.Page.BGColor,
    alignItems: 'stretch',
  },

  navBGImage: {
    width: SCREEN_WIDTH,
    height: ThemeMgr.StatusBarHeight + Theme.NavigationBar.Height,
    position: 'absolute',
    top: 0,
    left: 0,
  },

  userPage: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: ThemeMgr.StatusBarHeight + Theme.NavigationBar.Height,
  },

});

class NavBarPage extends BasePage {

  static propTypes = {
    ...ViewPropTypes,  //     ...BasePage.propTypes, // 虽然继承 BasePage，但只是试用内部的函数，并没有使用其View属性
    // statueBar 定制
    statueBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    statueBackgroundColor: PropTypes.string,
    // navBar 定制
    navTitle: PropTypes.string,
    navTitleColor: PropTypes.string,
    navBackgroundColor: PropTypes.string,
    navSplitLineColor: PropTypes.string,
    // 页面定制
    pageBackgroundHeaderImage: PropTypes.number,
    pageBackgroundHeaderImageStyle: ViewPropTypes.style,

    pageBackgroundColor: PropTypes.string,
    pageGradientColor: PropTypes.array,
    pageGradientLocation: PropTypes.array,
    pageGradientStart: PropTypes.object,
    pageGradientEnd: PropTypes.object,
    //
    showBackButton: PropTypes.bool,
    popBackToPageKey: PropTypes.string,
  };

  static defaultProps = {
    ...View.defaultProps,  //     ...BasePage.propTypes,
    // statueBar 定制
    statueBarStyle: 'light-content',
    statueBackgroundColor: Theme.NavigationBar.BGColor, // 'transparent',

    // navBar 定制
    navTitle: '',
    navTitleColor: Theme.NavigationBar.Title.Color,
    navBackgroundColor: Theme.NavigationBar.BGColor, // 'transparent',
    navSplitLineColor: Theme.NavigationBar.SplitLineColor, // 'transparent',
    navigationBarInsets: true,
    // 页面定制
    pageBackgroundHeaderImage: null,
    pageBackgroundHeaderImageStyle: {},

    pageBackgroundColor: Theme.Page.BGColor,
    pageGradientColor: null, // [Theme.PageGradualStartColor, Theme.PageGradualEndColor],
    pageGradientLocation: [0.3, 1],
    pageGradientStart: {x: 0, y: 0},
    pageGradientEnd: {x: 0, y: 1},

    //
    showBackButton: true,
    popBackToPageKey: null,
  };

  constructor(props) {
    super(props);
    this.screenWidth = Dimensions.get('window').width;
    this.showingToast = null;
    this.showingPopView = null;
    this.overlayPopView = null; //
  }


  /*************************************************/
  /*                 render                        */
  /*************************************************/
  //
  buildProps() {
    let {style, ...others} = this.props;
    style = [{
      flex: 1,
    }].concat(style);

    return ({style, ...others});
  }

  onLayout(e) {
    let {width} = Dimensions.get('window');
    if (width !== this.screenWidth) {
      this.screenWidth = width;
      this.forceUpdate();
    }
    this.props.onLayout && this.props.onLayout(e);
  }

  renderNavigationTitle() {
    return this.props.navTitle;
  }

  navigationLeftButton() {
    if (this.props.showBackButton) {
      return (
        <NavBarLeftBackButton
          onPress={() => {
            if (this.props.popBackToPageKey) {
              UIMgr.popTo(this.props.popBackToPageKey);
            } else {
              UIMgr.pop();
            }
          }}
        />
      );
    } else {
      return (
        <NavBarPlaceholderButton/>
      );
    }
  }

  navigationRightButton() {
    return null;
    if (!this.props.showBackButton) return null;
    return (
      <NavBarPlaceholderButton/>
    );
  }

  renderPage() {
    return null;
  }

  renderNavBgImage() {
    let navImageStyle = this.props.pageBackgroundHeaderImageStyle;
    if (this.props.pageBackgroundHeaderImage) {
      return (
        <Image
          style={[styles.navBGImage, navImageStyle]}
          resizeMode={'stretch'}
          source={this.props.pageBackgroundHeaderImage}
        />
      );
    } else {
      return null;
    }
  }

  render() {

    let {
      autoKeyboardInsets,
      keyboardTopInsets,

      pageBackgroundColor,
      pageGradientColor,
      pageGradientLocation,
      pageGradientStart,
      pageGradientEnd,

      ...others
    } = this.buildProps();

    if (!pageGradientColor) {
      pageGradientColor = [pageBackgroundColor, pageBackgroundColor];
    }

    // console.log(`navPage render others: ${JSON.stringify(others)}`);


    return (
      <View onLayout={e => this.onLayout(e)} {...others} >
        <LinearGradient
          style={[styles.containerPage, this.props.pageBackgroundColor&&{backgroundColor: this.props.pageBackgroundColor}]}
          start={pageGradientStart}
          end={pageGradientEnd}
          colors={pageGradientColor}
          locations={pageGradientLocation}
        >
          {this.renderNavBgImage()}

          <NavigationBar
            statueBarStyle={this.props.statueBarStyle}
            leftButton={this.navigationLeftButton()}
            rightButton={this.navigationRightButton()}
            title={this.renderNavigationTitle()}
            titleColor={this.props.navTitleColor}
            backgroundColor={this.props.navBackgroundColor}
            statueBarBackgroundColor={this.props.statueBackgroundColor}
            splitLineColor={this.props.navSplitLineColor}
          />
          <View style={styles.userPage}>
            {this.renderPage()}
          </View>
        </LinearGradient>
        {autoKeyboardInsets ? <KeyboardSpace topInsets={keyboardTopInsets} /> : null}
        {this.renderToastView()}
        {this._renderProgressView()}
        {this._renderPasswordPrompt()}
      </View>
    );
  }
}


class NavBarPageAlien extends NavBarPage {
  static defaultProps = {
    ...NavBarPage.defaultProps,
    // statueBar 定制
    statueBarStyle: 'dark-content',
    statueBackgroundColor: Theme.AlienStyle.NavigationBar.BGColor, // 'transparent',

    // navBar 定制
    navTitle: '',
    navTitleColor: Theme.AlienStyle.NavigationBar.Title.Color,
    navBackgroundColor: Theme.AlienStyle.NavigationBar.BGColor, // 'transparent',
    navSplitLineColor: Theme.AlienStyle.NavigationBar.SplitLineColor, // 'transparent',

    // 页面定制
    pageBackgroundColor: Theme.AlienStyle.Page.BGColor,
  };

  navigationLeftButton() {
    if (!this.props.showBackButton) return null;
    return (
      <NavBarLeftBackButton
        image={Images.nav.back2}
        onPress={() => {
          if (this.props.popBackToPageKey) {
            UIMgr.popTo(this.props.popBackToPageKey);
          } else {
            UIMgr.pop();
          }
        }}
      />
    );
  }


}


export { NavBarPage, NavBarPageAlien };
