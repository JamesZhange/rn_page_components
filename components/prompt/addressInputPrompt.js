import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Clipboard,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';

import { Button, LinkButton, ImageButton } from '../button';
import { TextInputA } from '../textInput';
import Prompt from './prompt';
import blockchainTools from '../../../../../blockchain/blockchain/blockchainTools';




export default class AddressInputPrompt extends Prompt {
  static propTypes = {
    ...Prompt.propTypes,
    aimChain: PropTypes.string,

    title: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
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
    aimChain: null,

    defaultValue: '',
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
      clipboardContentAddress: null,
    };
    this.QRScanReceiptEvent = null;
    this.waitScanSendToAddress = false;
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.QRScanReceiptEvent) {
      this.QRScanReceiptEvent.remove();
      this.QRScanReceiptEvent = null;
    }
    this.QRScanReceiptEvent = global.EvtEmitter.addListener(APP_EVENT.scanQRCodeString, (receiptCode) => {
      this._dealReceiptQRCode(receiptCode);
    });

    this.checkPasteButton();  // 外部调用，show 这个控件时候调用一下这个函数
  }
  componentDidUpdate() {
    this.waitScanSendToAddress = false;
  }
  componentWillUnmount() {
    if (this.QRScanReceiptEvent) {
      this.QRScanReceiptEvent.remove();
      this.QRScanReceiptEvent = null;
    }
  }



  onInputAddressChanged = (text) => {
    let value = Tools.stringTrim(text);
    this.setState({ value: value });
    this.props.onChangeText(value);
  }

  _onSubmitPress = () => {
    const { value } = this.state;
    this.props.onSubmit(value);
    this.close();
  };

  _onCancelPress = () => {
    this.props.onCancel();
    this.close();
  };




  // ----- text input ------

  _renderTextInputView() {
    const {
      placeholder,
      inputStyle,
      defaultValue,
      textInputProps,
    } = this.props;

    let androidStyle = {};
    if (Android) {
      androidStyle = {textAlignVertical: 'center', padding: 0};
    }

    return (
      <View style={styles.inputRow}>
        <TextInputA
          style={[styles.textInput, androidStyle, inputStyle]}
          value={this.state.value}
          placeholder={placeholder}
          placeholderTextColor={Theme.TextInput.PlaceholderTextColor}
          onChangeText={this.onInputAddressChanged}
          autoFocus={true}
          underlineColorAndroid={Theme.TextInput.UnderlineColorAndroid}
          {...textInputProps}
        />
        <View style={styles.inputButtonView}>
          {this._renderPasteButton()}
          <ImageButton
            image={Images.tmp}
            onPress={this.onScanAddressButtonClicked}
            containerStyle={styles.scanAddressButton}
            imageStyle={styles.scanAddressImage}
          />
        </View>
      </View>
    );
  }



  // ---- paste -----
  _checkClipboardAddress = () => {
    return new Promise((resolve, reject) => {
      Clipboard.getString().then((content) => {
        if (content) {
          content = Tools.stringTrim(content);
          if (blockchainTools.isValidateChainAddress(this.props.aimChain, content)) {
            resolve(content);
          } else {
            reject();
          }
        }
      }).catch((err) => {
        reject();
      });
    });
  }
  checkPasteButton = () => {
    this._checkClipboardAddress().then((address) => {
      this.setState({clipboardContentAddress: address});
    }).catch(() => {
      this.setState({clipboardContentAddress: null});
    });
  }

  _renderPasteButton = () => {
    if (this.state.clipboardContentAddress) {
      return (
        <LinkButton
          containerStyle = {styles.pasteAddressButton}
          titleStyle = {styles.pasteAddressButtonText}
          title = {_t('common.paste')}
          onPress={this._onPasteAddressButtonClicked}
        />
      );
    } else {
      return null;
    }
  }
  _onPasteAddressButtonClicked = () => {
    this._checkClipboardAddress().then((address) => {
      console.log(`set value: ${address}`);
      this.setState({clipboardContentAddress: address});
      this.setState({value: address});
    }).catch((error) => {
      console.log('set value null');
      this.setState({clipboardContentAddress: null});
      this.setState({value: ''});
    });
  }



  // ----- scan -----

  onScanAddressButtonClicked = () => {
    this.waitScanSendToAddress = true;
    UIMgr.push('qrCodeScanner', {aimQRCodeType: 'scanString'});
    this.close();
  }
  _dealReceiptQRCode = (scanString) => {
    if (this.waitScanSendToAddress) {
      this.waitScanSendToAddress = false;
      this.setState({value: scanString});
    }
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
    marginTop: 6,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.TextInput.BGColor,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    height: 50,
    alignSelf: 'stretch',
    fontSize: FONT_SIZE(12),
    color: Theme.TextInput.TextColor,
  },
  inputButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  scanAddressButton: {
    width: 36,
    height: 36,
  },
  scanAddressImage: {
    width: 30,
    height: 30,
    tintColor: Theme.Prompt.TextColor,
  },
  pasteAddressButton: {
    minHeight: 18,
    minWidth: 30,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingHorizontal: 4,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    // backgroundColor: '#e7e7e7',
    borderColor: Theme.SubView.TextColor,
    borderWidth: 0.8,
    borderRadius: 2,
  },
  pasteAddressButtonText: {
    color: Theme.SubView.TextColor,
    fontSize: FONT_SIZE(8),
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

  //
  // fakeModalBG: {
  //   position: 'absolute',
  //   top: -(ThemeMgr.StatusBarHeight + Theme.NavigationBar.Height), //0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   zIndex: 8,
  // },
  //


});


export {
  AddressInputPrompt,
};
