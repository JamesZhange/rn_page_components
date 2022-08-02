import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import KeyboardSpace from './keyboardSpace/KeyboardSpace';
import PasswordInputPromptTypeB from './prompt/passwordInputPrompt2';
import BasePage from './basePage';


const TOASTPOSITON = {
  TOP: 0,
  CENTER: 1,
  BOTTOM: 2,
};


export default class BaseDialog extends BasePage {
  static propTypes = {
    ...BasePage.propTypes,
  };

  static defaultProps = {
    ...BasePage.defaultProps,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    };

    // page
    this._pageSceneKey = 'BaseDialogUndefined';
  }

  componentDidMount() {
    super.componentDidMount();

  }

  componentWillUnmount() {

    super.componentWillUnmount();
  }



  /***************************************/
  /*           Toast View                */
  /***************************************/

  renderMessageToast = (containerPosition) => {
    if ((this.state.showingToastMessage) && (containerPosition === this.ToastMessagePosition)) {
      return (
        <View style={styles.toastView}>
          <Text style={styles.toastMessage}>
            {this.ToastMessage}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderActivityToast = () => {
    if (this.state.showingToastActivity) {
      return (
        <View style={styles.activityToastView}>
          <ActivityIndicator
            style={styles.activityIndicator}
            size="small"
            color={'white'}
          />
          <Text style={styles.toastMessage}>
            {this.state.ActivityMessage}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderToastView = () => {
    if (this.state.showingToastMessage || this.state.showingToastActivity) {
      return (
        <TouchableWithoutFeedback onPress={this.onActivitySpaceViewTouched} accessible={false}>
          <View style={styles.toastContainerView}>
            <View style={styles.toastContainerTop}>
              {this.renderMessageToast(TOASTPOSITON.TOP)}
            </View>
            <View style={styles.toastContainerCenter}>
              {this.renderActivityToast()}
              {this.renderMessageToast(TOASTPOSITON.CENTER)}
            </View>
            <View style={styles.toastContainerBottom}>
              {this.renderMessageToast(TOASTPOSITON.BOTTOM)}
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return null;
    }
  }




  /*************************************/
  /*      password input prompt        */
  /*************************************/

  _renderPasswordPrompt = (title=_t('common.inputPassword')) => {
    // Type A
    // return (
    //   <PasswordInputPrompt
    //     ref={(prompt)=> {this._PasswordPrompt = prompt;}}
    //     title={title}
    //     placeholder={_t('common.password')}
    //     onSubmit={this.state._onInputPasswordPromptSubmit}
    //     onCancel={this.state._onInputPasswordPromptCancel}
    //   />
    // );

    // Type B
    return (
      <PasswordInputPromptTypeB
        ref={(prompt)=> {this._PasswordPrompt = prompt;}}
        title={title}
        placeholder={_t('common.password')}
        onSubmit={this.state._onInputPasswordPromptSubmit}
        onCancel={this.state._onInputPasswordPromptCancel}
      />
    );
  }
  passwordPrompt = () => {
    return new Promise((resolve, reject) => {
      this.setState({
        _onInputPasswordPromptSubmit: (password) => {
          resolve(password);
        },
        _onInputPasswordPromptCancel: () => {
          reject();
        },
      }, () => {
        if (this._PasswordPrompt) {
          this._PasswordPrompt.show();
        }
      });
    });
  }



  //
  buildProps() {
    let {style, pageBackgroundColor, ...others} = this.props;
    style = [{
      flex: 1,
      backgroundColor: pageBackgroundColor ? pageBackgroundColor : Theme.Page.BGColor,
    }].concat(style);

    return ({style, ...others});

  }

  renderPage() {
    return null;
  }

  render() {
    let {autoKeyboardInsets, keyboardTopInsets, ...others} = this.buildProps();
    return (
      <View {...others}>
        {this.renderRefreshNumber()}
        {this.renderPage()}
        {autoKeyboardInsets ? <KeyboardSpace topInsets={keyboardTopInsets} /> : null}
        {this.renderToastView()}
        {this._renderProgressView()}
        {this._renderPasswordPrompt()}
      </View>
    );
  }


}


const styles = StyleSheet.create({

  containerPage: {
    flex: 1,
    backgroundColor: Theme.Page.BGColor,
  },

  // force refresh
  refreshNumberView: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  refreshNumber: {
    fontSize: FONT_SIZE(5),
    color: 'rgba(255, 255, 255, 0.01)',
  },

  // Toast View
  toastContainerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent', // 用这个透明view覆盖住页面，不知道能不能截断点击事件
    // backgroundColor: '#efce6d',
  },
  toastContainerTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastContainerCenter: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#bbffbd',
  },
  toastContainerBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#4de2ff',
  },



  toastView: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: Theme.Toast.BorderRadius,
  },
  activityToastView: {
    paddingTop: 2,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: Theme.Toast.BorderRadius,
  },
  activityIndicator: {
    marginVertical: 16,
  },
  toastMessage: {
    fontSize: FONT_SIZE(9),
    color: 'white',
  },

  // progress
  activityProgressView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT + 60,  // +60：安卓取出来的屏幕高度缺少状态栏高度
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Toast.BGColor, //  'rgba(0, 0, 0, 0.7)',
  },
});


export { BasePage };
