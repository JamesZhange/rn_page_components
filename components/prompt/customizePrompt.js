import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Prompt from './prompt';


export default class CustomizePrompt extends Prompt {
  static propTypes = {
    ...Prompt.propTypes,
    dialog: PropTypes.element,
  };

  static defaultProps = {
    ...Prompt.defaultProps,
    dialog: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
    };
  }

  _renderPopPage() {
    if (this.props.dialog) {
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.page}>

            {this.props.dialog}

          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      // 容错
      return (
        <View style={{width: 200, height: 150}} key="prompt">
          <Text>
            Not set dialog
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Prompt.MaskBGColor,
  },

});

export {
  CustomizePrompt,
};
