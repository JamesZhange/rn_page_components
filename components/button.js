// Button.js


import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ViewPropTypes,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';



class Button extends Component {

  static propTypes = {
    containerStyle: ViewPropTypes.style,
    title: PropTypes.string,
    titleStyle: Text.propTypes.style,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    gradientColor: PropTypes.array,
    gradientLocation: PropTypes.array,
    gradientStart: PropTypes.object,
    gradientEnd: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    gradientColor: [Theme.Button.Gradual.StartColor, Theme.Button.Gradual.EndColor],
    gradientLocation: [0, 1],
    gradientStart: Theme.Button.Gradual.StartLocal, // {x: 0, y: 0},
    gradientEnd: Theme.Button.Gradual.EndLocal, // {x: 1, y: 0},
  };

  constructor() {
    super();
    this.state = {
    };
  }

  render() {

    let {
      containerStyle,
      titleStyle,
      title,
      onPress,
      gradientColor,
      gradientLocation,
      gradientStart,
      gradientEnd,
    } = this.props;

    if (!gradientColor) {
      gradientColor = [Theme.Button.Gradual.StartColor, Theme.Button.Gradual.EndColor];
    }

    let reSetContentStyle = {};
    let buttonBorderWidth = 0;
    let buttonBorderRadius = null;
    if (containerStyle) {
      let {backgroundColor, borderRadius, borderColor, borderWidth} = StyleSheet.flatten(containerStyle);
      if (backgroundColor) {
        gradientColor = [backgroundColor, backgroundColor];
      }

      // border width
      if (borderColor !== 'transparent') {
        buttonBorderWidth = borderWidth;
      }
      reSetContentStyle.borderWidth = buttonBorderWidth;

      if (borderRadius !== undefined) {
        buttonBorderRadius = {borderRadius: borderRadius};
      }
    }

    let textColor = null;
    // if (this.props.disabled) {
    //   gradientColor = [Theme.Button.DisableBGColor, Theme.Button.DisableBGColor];
    //   textColor = {color: Theme.Button.DisableTextColor};
    // }
    let opacity = 1;
    if (this.props.disabled) {
      opacity = 0.7;
    }


    return (

      <TouchableOpacity
        style={
          [BtnStyles.buttonContent, containerStyle&&containerStyle, reSetContentStyle, {opacity: opacity}]
        }
        activeOpacity={Theme.Button.ActiveOpacity}
        onPress={onPress}
        disabled={this.props.disabled}
      >
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={gradientColor}
          locations={gradientLocation}
          style={[BtnStyles.gradientContent, buttonBorderRadius&&buttonBorderRadius]}
        >
          <Text
            style={[BtnStyles.buttonText, titleStyle&&titleStyle, textColor&&textColor]}
          >
            { title }
          </Text>
        </LinearGradient>
      </TouchableOpacity>

    );
  }
}

const BtnStyles = StyleSheet.create({

  buttonContent: {
    height: Theme.Button.Height,
    backgroundColor: Theme.Button.BGColor, // 324BE1
    borderRadius: Theme.Button.BorderRadius,
  },
  gradientContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.Button.BorderRadius,
  },

  buttonText: {
    textAlign: 'center',
    color: Theme.Button.TextColor,
    fontSize: FONT_SIZE(12),
    paddingHorizontal: 15,
  },
});





/******************************/



class LinkButton extends Component {

  static propTypes = {
    containerStyle: ViewPropTypes.style,
    title: PropTypes.string,
    titleStyle: Text.propTypes.style,
    onPress: PropTypes.func.isRequired,
    selectable: PropTypes.bool,
  };

  static defaultProps = {
    selectable: false,
  };

  render() {

    const {
      containerStyle,
      titleStyle,
      title,
      onPress,
      selectable,
    } = this.props;

    return (
      <View
        style={[LinkBtnStyles.buttonContent, containerStyle && containerStyle]}
        activeOpacity={Theme.Button.ActiveOpacity}>
        <Text
          style={[LinkBtnStyles.buttonText, titleStyle && titleStyle]}
          selectable={selectable}
          onPress={onPress}
          onLongPress={() => {
            // 不添加会导致安卓手机，长按和点击无法识别
          }}>
          {title}
        </Text>
      </View>
    );
  }

}

const LinkBtnStyles = StyleSheet.create({

  buttonContent: {
    backgroundColor: 'transparent',
    // margin: 2, // 内部默认样式会对外部样式设计造成困扰
    // padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: Theme.LinkButton.TextColor,
  },
});





/******************************/



class ImageButton extends Component {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    containerStyle: ViewPropTypes.style,
    imageStyle: Image.propTypes.style,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    resizeMode: PropTypes.string
  };

  static defaultProps = {
    containerStyle: {width: 40, height: 40},
    title: '',
    disabled: false,
  };

  render() {

    const {
      containerStyle,
      imageStyle,
      image,
      onPress,
      title,
      titleStyle,
      disabled,
      resizeMode
    } = this.props;

    let imageSizeStyle = null;
    if (imageStyle) {
      let {width, height} = StyleSheet.flatten(imageStyle);
      if (width && height) {
        imageSizeStyle = {width: width, height: height};
      }
    }
    if (!imageSizeStyle && containerStyle) {
      let {width, height} = StyleSheet.flatten(containerStyle);
      if (width && height) {
        imageSizeStyle = {width: width, height: height};
      }
    }

    let imgaeResizeMode = {}; //resizeMode={'contain'}   //vincent

    if (resizeMode) {
      imgaeResizeMode = { resizeMode: resizeMode }
    } else {
      if (iOS) {
        imgaeResizeMode = { resizeMode: 'contain' };
      }
    }
    

    let opacity = 1;
    if (this.props.disabled) {
      opacity = 0.7;
    }

    return (

      <TouchableOpacity
        style={[ImageBtnStyles.container, containerStyle&&containerStyle, {opacity: opacity}]}
        activeOpacity={Theme.Button.ActiveOpacity}
        onPress={onPress}
        disabled={disabled}
      >
        <ImageBackground
          style={[ImageBtnStyles.textContainer, imageSizeStyle&&imageSizeStyle]}
          imageStyle={[ImageBtnStyles.image, imageStyle&&imageStyle]}
          source={image}
          {...imgaeResizeMode}
        >
          <Text style={[ImageBtnStyles.title, titleStyle&&titleStyle]}>
            {title}
          </Text>
        </ImageBackground>
      </TouchableOpacity>

    );
  }

}

const ImageBtnStyles = StyleSheet.create({

  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {

  },
  title: {
    fontSize: FONT_SIZE(11),
    color: '#fff',
  },

});




/******************************/


class IconTextButton extends Component {

  static propTypes = {
    image: PropTypes.number,
    imageStyle: Image.propTypes.style,
    title: PropTypes.string,
    titleStyle: Text.propTypes.style,
    onPress: PropTypes.func.isRequired,
    buttonStyle: ViewPropTypes.style,
    disabled: PropTypes.bool,
    gradientColor: PropTypes.array,
    gradientLocation: PropTypes.array,
    gradientStart: PropTypes.object,
    gradientEnd: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    gradientColor: [Theme.Button.Gradual.StartColor, Theme.Button.Gradual.EndColor],
    gradientLocation: [0, 1],
    gradientStart: Theme.Button.Gradual.StartLocal, // {x: 0, y: 0},
    gradientEnd: Theme.Button.Gradual.EndLocal, // {x: 1, y: 0},
  };

  constructor() {
    super();
    this.state = {
    };
  }


  render() {

    let {
      buttonStyle,
      imageStyle,
      image,
      title,
      titleStyle,
      onPress,
      gradientColor,
      gradientLocation,
      gradientStart,
      gradientEnd,
    } = this.props;

    let buttonHeight = 40;
    let buttonBorderRadius = null;
    if (buttonStyle) {
      let {height, backgroundColor, borderRadius} = StyleSheet.flatten(buttonStyle);
      if (height) {
        buttonHeight = height;
      }
      if (backgroundColor) {
        gradientColor = [backgroundColor, backgroundColor];
      }
      if (borderRadius !== undefined) {
        buttonBorderRadius = {borderRadius: borderRadius};
      }
    }
    // if (this.props.disabled) {
    //   gradientColor = [Theme.Button.DisableBGColor, Theme.Button.DisableBGColor];
    // }
    let opacity = 1;
    if (this.props.disabled) {
      opacity = 0.7;
    }
    let imageSizeStyle = {width: (buttonHeight*3/5), height: (buttonHeight*3/5)};

    return (

      <TouchableOpacity
        style={[IconTextButtonStyles.container, buttonStyle&&buttonStyle, {opacity: opacity}]}
        activeOpacity={Theme.Button.ActiveOpacity}
        onPress={onPress}
        disabled={this.props.disabled}
      >
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          colors={gradientColor}
          locations={gradientLocation}
          style={[IconTextButtonStyles.gradientContent, buttonBorderRadius&&buttonBorderRadius]}
        >
          <Image
            style={[imageSizeStyle&&imageSizeStyle, imageStyle&&imageStyle]}
            resizeMode={'contain'}
            source={image}
          />
          <Text style={[IconTextButtonStyles.title, this.props.disabled&&IconTextButtonStyles.disableText, titleStyle&&titleStyle]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

    );
  }

}

const IconTextButtonStyles = StyleSheet.create({

  container: {
    height: 40,
    backgroundColor: Theme.Button.BGColor,
    borderRadius: Theme.Button.BorderRadius,
  },
  gradientContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderRadius: Theme.Button.BorderRadius,
  },
  title: {
    textAlign: 'center',
    color: Theme.Button.TextColor,
    fontSize: FONT_SIZE(12),
    paddingLeft: 4,
  },
  disableImage: {
    tintColor: Theme.Button.DisableTextColor,
  },
  disableText: {
    color: Theme.Button.DisableTextColor,
  },
});


export { Button, LinkButton, ImageButton, IconTextButton };
