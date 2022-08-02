/***
 * 包含 InputText 组件的，需要滚动的 ScrollView，兼顾收起键盘等功能时会出现无法滚动的情况
 * 需按照这个render方式嵌套组件
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';

export default class TouchableScrollView extends Component {

  static propTypes = {
    containerStyle: ViewPropTypes.style,
    onMaskPress: PropTypes.func,
  };

  static defaultProps = {
    someProp: 'default',
    onMaskPress: Keyboard.dismiss,
  };

  constructor() {
    super();
    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      // ... do some thing ...
      this.state.anim.setValue(opacity);
    }
  }

  scrollViewOnTouchStart(event){
    if (event._targetInst.elementType !== 'RCTSinglelineTextInputView' // 单行输入框
      && event._targetInst.elementType !== 'RCTMultilineTextInputView' // ios多行输入框
      && event._targetInst.elementType !== 'AndroidTextInput') { // 安卓输入框
      Keyboard.dismiss();
    }
  }

  // render() {
  //   let {
  //     containerStyle,
  //   } = this.props;
  //
  //   return (
  //     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  //       <View style={[styles.container, containerStyle&&containerStyle]}>
  //         <ScrollView
  //           overScrollMode={'auto'}  // android
  //           alwaysBounceVertical={false} // ios
  //           showsVerticalScrollIndicator={false}
  //           keyboardShouldPersistTaps={'handled'}
  //           onTouchStart={e => this.scrollViewOnTouchStart(e)}
  //         >
  //           <TouchableOpacity activeOpacity={0.99}>
  //             {this.props.children}
  //           </TouchableOpacity>
  //         </ScrollView>
  //       </View>
  //     </TouchableWithoutFeedback>
  //   );
  // }

  render() {
    let {
      containerStyle,
      onMaskPress,
      ...others
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, containerStyle&&containerStyle]}>
          <KeyboardAwareScrollView
            overScrollMode={'auto'}  // android
            alwaysBounceVertical={false} // ios
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
            onTouchStart={e => this.scrollViewOnTouchStart(e)}
            {...others}
          >
            <TouchableOpacity activeOpacity={0.99} onPress={onMaskPress} >
              {this.props.children}
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export {TouchableScrollView};
