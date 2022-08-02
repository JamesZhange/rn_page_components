import React, { Component } from 'react';
import {
  Keyboard,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';


export default class Prompt extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  constructor (props) {
    super(props);
    this.state = {
      visible: false,
    };

  }

  componentDidMount() {
  }




  show = (callback=null) => {
    if (callback) {
      this.setState({visible: true}, callback);
    } else {
      this.setState({visible: true});
    }
  }
  close = (callback=null) => {
    Keyboard.dismiss();
    if (callback) {
      this.setState({visible: false}, callback);
    } else {
      this.setState({visible: false});
    }
  };



  // render

  _renderPopPage() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}} />
    );
  }

  render() {
    // animationType: slide / fade / none
    return (
      <Modal
        animationType={'none'}
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => this.close()}
      >
        {this._renderPopPage()}
      </Modal>
    );
  }

}




const styles = StyleSheet.create({

  // page: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: Theme.Prompt.MaskBGColor,
  // },


  // fakeModalBG: {
  //   position: 'absolute',
  //   top: 0, // -(ThemeMgr.StatusBarHeight + Theme.NavigationBar.Height), //0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   // zIndex: 99,
  //   backgroundColor: Theme.Prompt.MaskBGColor,
  //   backgroundColor: '#cb595988',
  // },

  // fakeModalBG: {
  //   position: 'absolute',
  //   width: SCREEN_WIDTH,
  //   height: iOS ? SCREEN_HEIGHT : SCREEN_HEIGHT + 36,
  //   left: 0,
  //   top: 0,
  // },

});


export {
  Prompt,
};
