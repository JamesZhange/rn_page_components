/*
* 自绘导航栏
*/
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';



class NavBarButton extends Component {

  // 属性类型限定
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    buttonView: PropTypes.element,
    image: PropTypes.number,  // 搞怪，不写成number就会报错
    imageStyle: Image.propTypes.style,
    text: PropTypes.string,
    textStyle: Text.propTypes.style,
  };

  renderSubstance() {
    const {
      buttonView,
      image,
      imageStyle,
      text,
      textStyle,
    } = this.props;

    if (buttonView) {
      // return buttonView;
      return (
        <View style={styles.navBarButtonView}>
          {buttonView}
        </View>
      );
    }

    if (image && !text) {
      return (
        <Image
          source={image}
          resizeMode={'contain'}
          style={[styles.navBarButtonIcon, imageStyle&&imageStyle]}
        />
      );
    } else if (!image && text) {
      return (
        <Text style={[styles.navBarButtonText, textStyle && textStyle]}>
          {text}
        </Text>
      );
    } else if (image && text) {
      return (
        <View style={styles.navBarButtonContainer}>
          <Image
            source={image}
            resizeMode={'contain'}
            style={[styles.navBarButtonIcon, imageStyle&&imageStyle]}
          />
          <Text style={[styles.navBarButtonText, textStyle && textStyle]}>
            {text}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {

    const { onPress, disabled } = this.props;


    return (

      <TouchableOpacity
        style={styles.navBarButton}
        activeOpacity={Theme.Button.ActiveOpacity}
        onPress={onPress}
        disabled={disabled}
      >
        {this.renderSubstance()}
      </TouchableOpacity>

    );
  }
}



class NavBarLeftBackButton extends Component {

  // 属性类型限定
  static propTypes = {
    image: PropTypes.number,
    onPress: PropTypes.func,
  };
  static defaultProps = {
    image: Images.nav.back,
    onPress: () => {UIMgr.pop();},
  };

  render() {
    return (
      <NavBarButton
        onPress={this.props.onPress}
        image={this.props.image}
      />
    );
  }
}

class NavBarLeftCloseButton extends Component {

  // 属性类型限定
  static propTypes = {
    image: PropTypes.number,
    onPress: PropTypes.func,
  };
  static defaultProps = {
    image: Images.nav.close,
    onPress: () => {UIMgr.pop();},
  };

  render() {
    return (
      <NavBarButton
        onPress={this.props.onPress}
        image={this.props.image}
      />
    );
  }
}

class NavBarPlaceholderButton extends Component {

  render() {
    return (
      <View style={styles.navBarButton} />
    );
  }
}


export const styles = StyleSheet.create({

  navBarButton: {
    width: Theme.NavBarButton.Size.Width,
    height: Theme.NavBarButton.Size.Height,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navBarButtonIcon: {
    width: Theme.NavBarButton.ImageSize.width,
    height: Theme.NavBarButton.ImageSize.height,
  },

  navBarButtonText: {
    fontSize: FONT_SIZE(10),
    color: Theme.navTitleColor,
  },

  navBarButtonView: {
    width: Theme.NavBarButton.ImageSize.width,
    height: Theme.NavBarButton.ImageSize.height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  navBarButtonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export { NavBarButton, NavBarLeftBackButton, NavBarLeftCloseButton, NavBarPlaceholderButton, styles as NavBarBtnStyles };
