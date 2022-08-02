import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
// import RNQRCode from 'react-native-qrcode';
import RNQRCode from 'react-native-qrcode-svg';

const DEFAULT_ERR_CORRECT_LEVEL = 'L';

export default class QRCodeGen extends Component {
  static propTypes = {
    value: PropTypes.string,
    size: PropTypes.number,
    logo: PropTypes.number,
    errorCorrectionLevel: PropTypes.string,
  };

  static defaultProps = {
    value: '',
    size: 100,
    logo: Images.common.qrCodeLogo,
    errorCorrectionLevel: DEFAULT_ERR_CORRECT_LEVEL, // "L" | "M" | "Q" | "H"
  };

  constructor() {
    super();
    this.state = {};
  }

  render() {
    let showText = this.props.value;
    if (!showText || showText.length === 0) {
      showText = AppConfig.AppName;
    }

    const codePaddingSize = 10;
    let showSize = this.props.size;
    if (showSize <= 0) {
      showSize = 100;
    }

    let logo = {
      logo: this.props.logo,
      logoSize: showSize * 0.18,
    };
    // if (Android) {
    //   logo = {
    //     logoBackgroundColor: 'transparent',
    //   };
    // }

    let ecl = this.props.errorCorrectionLevel ? this.props.errorCorrectionLevel : DEFAULT_ERR_CORRECT_LEVEL;

    let codeColor = Theme.QRCode.CodeColor;
    let bgColor = Theme.QRCode.BGColor;

    return (
      <View
        style={{
          width: showSize,
          height: showSize,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: bgColor,
        }}
      >
        <RNQRCode value={showText} size={showSize - codePaddingSize} color={codeColor} backgroundColor={bgColor} ecl={ecl} {...logo} />
      </View>
    );
  }
}

export { QRCodeGen as QRCode };
