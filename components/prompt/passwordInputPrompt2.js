import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import { ImageButton } from '../button';
import { TextInputA } from '../textInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PasswordInputPrompt from './passwordInputPrompt';


export default class PasswordInputPromptTypeB extends PasswordInputPrompt {
  static propTypes = {
    ...PasswordInputPrompt.propTypes,

  };

  static defaultProps = {
    ...PasswordInputPrompt.defaultProps,

  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,

    };
  }

  //
  // _renderTextInputView() {
  //   const {
  //     placeholder,
  //     inputStyle,
  //     textInputProps,
  //   } = this.props;
  //
  //   let androidStyle = {};
  //   if (Android) {
  //     androidStyle = { textAlignVertical: 'center', padding: 0 };
  //   }
  //
  //   return (
  //     <View style={styles.inputRow}>
  //       <TextInputA
  //         style={[styles.textInput, androidStyle, inputStyle]}
  //         value={this.state.value}
  //         placeholder={placeholder}
  //         placeholderTextColor={Theme.TextInput.PlaceholderTextColor}
  //         onChangeText={this.onInputPasswordChanged}
  //         autoFocus={true}
  //         underlineColorAndroid={Theme.TextInput.UnderlineColorAndroid}
  //         secureTextEntry={this.state.isEncrypt}
  //         enablesReturnKeyAutomatically={true}
  //         keyboardAppearance={Theme.TextInput.keyboardAppearance}
  //         onSubmitEditing={this._onSubmitPress}
  //         {...textInputProps}
  //       />
  //       <ImageButton
  //         image={this.state.isEncrypt ? Images.common.notSeeSecurePassword : Images.common.seeSecurePassword}
  //         onPress={this.onEncryptButtonClicked}
  //         containerStyle={styles.showSecureButton}
  //         imageStyle={styles.showSecureButtonImage}
  //       />
  //     </View>
  //   );
  // }

  _renderPopPage() {
    const {
      title,
      borderColor,
      titleStyle,
    } = this.props;

    return (
      <View style={styles.page}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps={'always'}
        >
          <TouchableWithoutFeedback onPress={this._onCancelPress} accessible={false}>
            <View style={styles.topMaskView} />
          </TouchableWithoutFeedback>
          <View style={styles.dialog} key="prompt">
            <View style={[styles.titleView, { borderColor }]}>
              <ImageButton
                image={Images.nav.back}
                onPress={this._onCancelPress}
                containerStyle={styles.backButton}
                imageStyle={styles.backButtonImage}
              />
              <View style={styles.titleTextView}>
                <Text style={[styles.titleText, titleStyle]}>
                  { title }
                </Text>
              </View>
              <View style={styles.backButton} />
            </View>

            {this._renderTextInputView()}

          </View>

        </KeyboardAwareScrollView>

      </View>
    );
  }

}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Theme.Prompt.MaskBGColor,
  },
  scrollViewContent: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  topMaskView: {
    flex: 1,
    // backgroundColor: '#d67474',
  },
  dialog: {
    alignSelf: 'stretch',
    alignItems: 'stretch',
    backgroundColor: Theme.Prompt.BGColor,
    paddingBottom: 26,
    // height: 160,
  },
  titleView: {
    maxHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#34c8f8',
  },
  titleTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: Theme.Prompt.TextColor,
    fontSize: FONT_SIZE(11),
    fontWeight: '500',
  },
  backButton: {
    width: 40,
    height: 40,
  },
  backButtonImage: {
    width: 20,
    height: 20,
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
});


export {
  PasswordInputPromptTypeB,
};


