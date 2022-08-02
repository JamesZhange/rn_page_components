import React, { Component } from 'react';
import {
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';

// ------- fix RN Android TextInput padding --------

class TextInputA extends Component {

  static propTypes = {
  };

  static defaultProps = {
  };

  constructor () {
    super();

    this.fixProps = {
      placeholderTextColor: Theme.SubView.TextColor,
      autoCapitalize: 'none',
      autoCorrect: false,
      underlineColorAndroid: 'transparent',
      onSubmitEditing: Keyboard.dismiss,
      allowFontScaling: false,
      keyboardAppearance: Theme.TextInput.keyboardAppearance,
    };

    this.fixStyle = {
      textAlignVertical: 'center', // android
      color: Theme.TextInput.TextColor,
      fontSize: FONT_SIZE(11),
      padding: 0, //解决安卓上文字未上下居中问题
    };
  }

  focus = () => {
    this.TextInput.blur();
    this.TextInput.focus();
  }

  render() {
    let {style, ...other} = this.props;
    let props = Object.assign(this.fixProps, other);

    return (
      <TextInput
        ref={(textInput) => {this.TextInput = textInput}}
        {...props}
        style={[this.fixStyle, style]}
      />);
  }
}


// ------- fix RN iOS TextInput Chinese --------

class TextInputCN extends Component {

  static propTypes = {
    value: PropTypes.string,
    chinese: PropTypes.bool,
  };

  static defaultProps = {
    chinese: true,
  };

  focus = () => {
    this.TextInput.blur();
    this.TextInput.focus();
  }

  shouldComponentUpdate(nextProps){

    // console.log(`this.props.value: ${this.props.value} <--> nextProps.value: ${nextProps.value}`);
    // console.log(`${this.props.value}(${this.props.value.length}) <--> ${nextProps.value}(${nextProps.value.length})`);

    let should = true;

    if (this.props.chinese) {

      // should = (Platform.OS !== 'ios' || this.props.value === nextProps.value);

      if (Platform.OS === 'ios') {
        if (this.props.value !== nextProps.value) {
          should = false;

          // 中文回删
          {
            // let chinesePtran = /.*[\u4e00-\u9fa5]+.*/;   // 含有中文
            let chinesePtran = /^[\u4e00-\u9fa5]+$/;   // 全中文
            if (chinesePtran.test(this.props.value) && chinesePtran.test(nextProps.value) && (this.props.value.length > nextProps.value.length)) {
              should = true;
            }
          }
        }
      }
    }
    // console.log(`shouldComponentUpdate: ${should}`);
    return should;
  }

  render() {
    return (
      <TextInputA
        ref={(textInput) => {this.TextInput = textInput}}
        {...this.props}
      />
    );
  }
}



export { TextInputCN, TextInputA };
