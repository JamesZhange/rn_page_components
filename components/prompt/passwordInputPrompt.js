import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

import { Button, ImageButton } from '../button';
import { TextInputA } from '../textInput';
import Prompt from './prompt';


export default class PasswordInputPrompt extends Prompt {
  static propTypes = {
    ...Prompt.propTypes,

    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string,
    onChangeText: PropTypes.func,
    borderColor: PropTypes.string,
    promptStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    submitButtonStyle: PropTypes.object,
    submitButtonTextStyle: PropTypes.object,
    cancelButtonStyle: PropTypes.object,
    cancelButtonTextStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    textInputProps: PropTypes.object,
    buttonViewStyle: PropTypes.object,
    isShowCancelButton: PropTypes.bool,
  };

  static defaultProps = {
    ...Prompt.defaultProps,

    cancelText: _t('common.cancel'), // 'Cancel',
    submitText: _t('common.ok'), // 'OK',
    borderColor:'transparent',
    promptStyle: {},
    titleStyle: {},
    buttonStyle: {},
    buttonTextStyle: {},
    submitButtonStyle: {},
    submitButtonTextStyle: {},
    cancelButtonStyle: {},
    cancelButtonTextStyle: {},
    inputStyle: {},
    textInputProps: {},
    buttonViewStyle: {},
    onChangeText: () => {},
    isShowCancelButton: true,
    onSubmit: ()=>{},
    onCancel: ()=>{},
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      pwInputValue: '',
      isEncrypt: true,
    };
  }

  componentDidMount() {
    super.componentDidMount();

  }


  onInputPasswordChanged = (text) => {
    this.setState({ pwInputValue: text });
    this.props.onChangeText(text);
  }

  onEncryptButtonClicked = () => {
    this.setState({ isEncrypt: !this.state.isEncrypt });
  }

  _onSubmitPress = () => {
    Keyboard.dismiss();
    let pw = this.state.pwInputValue;
    this.setState({visible:false, pwInputValue: '', isEncrypt: true}, () => {
      this.props.onSubmit(pw);
    });
  };

  _onCancelPress = () => {
    Keyboard.dismiss();
    this.setState({visible:false, pwInputValue: '', isEncrypt: true}, () => {
      this.props.onCancel();
    });
  };


  show = (callback=null) => {
    this.setState({visible: true}, () => {
      if (Android) {
        Tools.runDelay(() => {
          if (this._PwTextInput) {
            this._PwTextInput.focus();
          }
        }, 200);
      }
      if (callback) {
        callback();
      }
    });
  }


  _renderTextInputView() {
    const {
      placeholder,
      inputStyle,
      textInputProps,
    } = this.props;

    let androidStyle = {};
    if (Android) {
      androidStyle = { textAlignVertical: 'center', padding: 0 };
    }

    return (
      <View style={styles.inputRow}>
        <TextInputA
          ref={(textInput) => {this._PwTextInput = textInput}}
          style={[styles.textInput, androidStyle, inputStyle]}
          value={this.state.pwInputValue}
          placeholder={placeholder}
          placeholderTextColor={Theme.TextInput.PlaceholderTextColor}
          onChangeText={this.onInputPasswordChanged}
          autoFocus={true}
          underlineColorAndroid={Theme.TextInput.UnderlineColorAndroid}
          secureTextEntry={this.state.isEncrypt}
          enablesReturnKeyAutomatically={true}
          keyboardAppearance={Theme.TextInput.keyboardAppearance}
          onSubmitEditing={this._onSubmitPress}
          {...textInputProps}
        />
        <ImageButton
          image={this.state.isEncrypt ? Images.common.notSeeSecurePassword : Images.common.seeSecurePassword}
          onPress={this.onEncryptButtonClicked}
          containerStyle={styles.showSecureButton}
          imageStyle={styles.showSecureButtonImage}
        />
      </View>
    );
  }

  _renderPopPage() {
    const {
      title,
      cancelText,
      submitText,
      borderColor,
      titleStyle,
      buttonStyle,
      buttonTextStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      buttonViewStyle,
      isShowCancelButton,
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.page}>

          <View style={styles.dialog} key="prompt">
            <View style={[styles.titleView, { borderColor }]}>
              <Text style={[styles.titleText, titleStyle]}>
                { title }
              </Text>
            </View>

            {this._renderTextInputView()}

            <View style={[styles.buttonView, { borderColor }, buttonViewStyle]}>
              {isShowCancelButton ?
                <Button
                  containerStyle={[styles.button, buttonStyle, cancelButtonStyle]}
                  title={cancelText}
                  titleStyle={[styles.buttonText, buttonTextStyle, cancelButtonTextStyle]}
                  onPress={this._onCancelPress}
                />
                : null}
              <Button
                containerStyle={[styles.button, buttonStyle, submitButtonStyle]}
                title={submitText}
                titleStyle={[styles.buttonText, buttonTextStyle, submitButtonTextStyle]}
                onPress={this._onSubmitPress}
              />
            </View>

          </View>

        </View>
      </TouchableWithoutFeedback>
    );
  }


}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Prompt.MaskBGColor,
  },
  dialog: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
    marginHorizontal: 40,
    borderRadius: Theme.Prompt.BorderRadius,
    backgroundColor: Theme.Prompt.BGColor,
  },
  titleView: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    maxHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: Theme.Prompt.TextColor,
    fontSize: FONT_SIZE(13),
    // fontWeight: '400',
  },

  inputRow: {
    marginHorizontal: 20,
    paddingHorizontal: 10,
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.TextInput.BGColor,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    height: 50,
    alignSelf: 'stretch',
    fontSize: FONT_SIZE(11),
    color: Theme.TextInput.TextColor,
  },
  showSecureButton: {
    width: 36,
    height: 36,
    marginLeft: 4,
  },
  showSecureButtonImage: {
    width: 30,
    height: 30,
    tintColor: Theme.Prompt.TextColor,
  },

  buttonView: {
    height: 44,
    marginTop: 36,
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Theme.Prompt.BorderColor,
    borderRadius: 0,
    backgroundColor: Theme.Prompt.BGColor,
  },
  buttonText: {
    color: Theme.Prompt.TextColor,
    fontSize: FONT_SIZE(13),
  },

});


export {
  PasswordInputPrompt,
};
