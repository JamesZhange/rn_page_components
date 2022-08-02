import React, { Component } from 'react';
import {
  Platform,
  View,
  ViewPropTypes,
  StatusBar,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  AppState,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import KeyboardSpace from './keyboardSpace/KeyboardSpace';
import * as Progress from 'react-native-progress';
// import PasswordInputPrompt from './prompt/passwordInputPrompt';
import PasswordInputPromptTypeB from './prompt/passwordInputPrompt2';


const TOASTPOSITON = {
  TOP: 0,
  CENTER: 1,
  BOTTOM: 2,
};

let PageIndex = 0;

const ProgressViewState = {
  NoProgress: 'ProgressViewState_NoProgress',
  Indeterminate: 'ProgressViewState_Indeterminate',
  Progressing: 'ProgressViewState_Progressing',
};
const ProgressIndicatorSize = 50;
const ProgressBorderWidth = 1.5;


export default class BasePage extends Component {
  static propTypes = {
    ...ViewPropTypes,
    statueBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    autoKeyboardInsets: PropTypes.bool, //自动插入键盘占用空间
    keyboardTopInsets: PropTypes.number, //插入键盘占用空间顶部偏移，用于底部有固定占用空间(如TabNavigator)的页面
    pageBackgroundColor: PropTypes.string,
  };

  static defaultProps = {
    ...View.defaultProps,
    statueBarStyle: 'light-content',
    autoKeyboardInsets: Platform.OS === 'ios',
    keyboardTopInsets: 0,
    pageBackgroundColor: Theme.Page.BGColor,
  };

  constructor(props) {
    super(props);

    this.PageIndex = this.anonymousPageName();

    this.didMount = false; //代替被废弃的isMounted
    this.state = {
      isFocused: false,
      forceRefresh: 0,
      showingToastMessage: false,
      showingToastActivity: false,
      ActivityMessage: '正在运行',
      localLanguage: undefined,
      appState: 'active',

      // progress view
      progressState: ProgressViewState.NoProgress,
      progressingValue: 0,

      // scan
      nfc_supported: undefined,
      nfc_android_enable: undefined,
      nfcTag: '',

      // password input prompt
      _onInputPasswordPromptSubmit: () => {},
      _onInputPasswordPromptCancel: () => {},

    };

    this.timerArray = [];

    this.eventArray = [];

    // toast
    this.ToastMessage = 'aaa测试字段bbb';
    this.ToastMessagePosition = TOASTPOSITON.BOTTOM;

    this.ActivitySpaceTouch = null;

    // page
    this._pageSceneKey = 'BasePageUndefined';
  }

  componentDidMount() {
    this.didMount = true;
    AppLanguage.addRefreshFunc({page: this.PageIndex, refreshFunc: this.setLanguageSetting});
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    // console.log(`${this.constructor.name} will Unmount`);
    this.didMount = false;
    this.clearAllTimer();
    this.clearAllEvent();
    this.setState({showingToastMessage: false, showingToastActivity: false});
    AppLanguage.removeRefreshFunc(this.PageIndex);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // language
  setLanguageSetting = (localL) => {
    this.setState({localLanguage: localL});
  }

  //Call after the scene transition by Navigator.onDidFocus
  onDidFocus() {
    if (!this.state.isFocused) {this.setState({isFocused: true});}
  }

  //Call before the scene transition by Navigator.onWillFocus
  onWillFocus() {
  }

  // timer creat and clean
  runDelay(callback, delay, args) {
    let timer = setTimeout(
      () => {
        this.removeTimerFromArray(timer);
        callback(args);
      },
      delay);
    this.timerArray.push(timer);
    return timer;
  }
  removeTimerFromArray(timer) {
    for (let i = 0; i < this.timerArray.length; i++) {
      let t = this.timerArray[i];
      if (timer === t) {
        this.timerArray.splice(i, 1);
      }
    }
  }
  clearAllTimer() {
    for (let timer of this.timerArray) {
      if (timer) {
        clearTimeout(timer);
      }
    }
    this.timerArray = [];
  }
  cleanDelayTimer(timer) {
    this.removeTimerFromArray(timer);
    clearTimeout(timer);
  }

  // --- refresh ? ----
  refreshPage = () => {
    this.setState((oldState) => {
      return {
        forceRefresh: Math.random(),
      };
    });
  }
  renderRefreshNumber = () => {
    return (
      <View style={styles.refreshNumberView}>
        <Text style={styles.refreshNumber}>
          {this.state.forceRefresh}
        </Text>
      </View>
    );
  }

  // --- Event ---

  addEvent = (eventName, callback) => {
    // 去重
    this.removeEvent(eventName);
    // 添加
    let event = EvtEmitter.addListener(eventName, callback);
    this.eventArray.push({name: eventName, event: event});
  }
  removeEvent = (eventName) => {
    for (let i = 0; i < this.eventArray.length; i++) {
      let ev = this.eventArray[i];
      if (ev.name === eventName) {
        ev.event.remove();
        this.eventArray.splice(i, 1);
        break;
      }
    }
  }
  clearAllEvent = () => {
    for (let ev of this.eventArray) {
      ev.event.remove();
    }
    this.eventArray = [];
  }
  sendEvent = (event, data) => {
    EvtEmitter.sendEvent(event, data);
  }


  // 退入后台，返回前台
  _handleAppStateChange = (nextAppState) => {
    // if (this.state.appState !== nextAppState) {
    //   this._dealReCheckPinCode(RedQueen.CurrentWallet);
    // }
    // this.setState({appState: nextAppState});
    // if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    //   console.log('App has come to the foreground!')
    // }
  }

  // push 过程中 button 重入
  runInCurrentScene(action = ()=>{}) {
    if (UIMgr.currentScene === this._pageSceneKey) {
      action();
    } else {
      // console.log('Not in aim scene! return');
    }
  }
  // runInCurrentScene 的细化
  pushPage(sceneKey, props = null) {
    if (UIMgr.currentScene === this._pageSceneKey) {
      UIMgr.push(sceneKey, props);
    }
  }
  popPage(props = null) {
    if (UIMgr.currentScene === this._pageSceneKey) {
      UIMgr.pop(props);
    }
  }
  popToPage(sceneKey, props = null) {
    if (UIMgr.currentScene === this._pageSceneKey) {
      UIMgr.popTo(sceneKey, props);
    }
  }
  popAndPush(sceneKey, props = null) {
    if (UIMgr.currentScene === this._pageSceneKey) {
      UIMgr.popAndPush(sceneKey, props);
    }
  }


  /***************************************/
  /*           Toast View                */
  /***************************************/

  toastMessage = (text, duration = 2000, position = TOASTPOSITON.BOTTOM) => {
    if (!this.state.showingToastMessage) {
      this.ToastMessage = text;
      this.ToastMessagePosition = position;
      this.setState({showingToastMessage: true});
      this.runDelay(() => {
        this.setState({showingToastMessage: false});
        this.ToastMessage = '';
      }, duration);
    }
  }

  showActivityToast = (text, spaceTouch = null, duration = Number.MAX_SAFE_INTEGER) => {
    if (!this.state.showingToastActivity) {
      this.ActivitySpaceTouch = spaceTouch;
      this.setState({showingToastActivity: true, ActivityMessage: text});
      this.runDelay(() => {
        this.setState({showingToastActivity: false, ActivityMessage: ''});
      }, duration);
    } else {
      this.ActivitySpaceTouch = spaceTouch;
      this.changeActivityToastText(text);
    }
  }
  changeActivityToastText = (text) => {
    if (this.state.showingToastActivity) {
      this.setState({ActivityMessage: text});
    }
  }
  hideActivityToast = () => {
    this.ActivitySpaceTouch = null;
    this.setState({showingToastActivity: false, ActivityMessage: ''});
  }
  onActivitySpaceViewTouched = () => {
    if (this.ActivitySpaceTouch) {
      this.ActivitySpaceTouch();
    }
  }

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

  // TODO: 以后定制在这里修改
  showAlert = (
    title, message='',
    btn1={text:_t('common.ok'), onPress:()=>{}},
    btn2=null,
  ) => {

    let buttons = [btn1];
    if (btn2) {
      buttons.push(btn2);
    }

    return (
      Alert.alert(
        title,
        message,
        buttons,
        { cancelable: true },
      )
    );
  }



  /*************************************/
  /*             progress              */
  /*************************************/

  setProgressIndeterminate = () => {
    this.setProgressView(ProgressViewState.Indeterminate);
  }
  setProgressValue = (value = 0) => {
    this.setProgressView(ProgressViewState.Progressing, value);
  }
  hideProgressView = () => {
    this.setProgressView(ProgressViewState.NoProgress);
  }

  setProgressView = (state, value = 0) => {
    let progressValue = 0;
    if (!Number(value).isNaN) {
      progressValue = Number(value);
      if (progressValue < 0) { progressValue = 0; }
      if (progressValue > 1) { progressValue = 1; }
    }
    // console.log(`setProgressView: ${progressValue}`);
    this.setState({progressState: state, progressingValue: progressValue});
  }

  _renderProgressView = () => {
    if (this.state.progressState === ProgressViewState.Indeterminate) {
      return (
        <View style={styles.activityProgressView}>
          <Progress.Circle
            size={ProgressIndicatorSize}
            indeterminate={true}
            color={'white'}
            borderWidth={ProgressBorderWidth}
          />
        </View>
      );
    } else if (this.state.progressState === ProgressViewState.Progressing) {
      return (
        <View style={styles.activityProgressView}>
          <Progress.Circle
            size={ProgressIndicatorSize}
            color={'white'}
            borderWidth={ProgressBorderWidth}
            progress={this.state.progressingValue}
            thickness={(ProgressIndicatorSize - ProgressBorderWidth - 1) / 2}
          />
        </View>
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
        <StatusBar
          backgroundColor={'transparent'} //状态栏的背景色
          translucent={true}
          barStyle={this.props.statueBarStyle}
        />
        {this.renderRefreshNumber()}
        {this.renderPage()}
        {autoKeyboardInsets ? <KeyboardSpace topInsets={keyboardTopInsets} /> : null}
        {this.renderToastView()}
        {this._renderProgressView()}
        {this._renderPasswordPrompt()}
      </View>
    );
  }


  /***************************************/
  /*           Tools                     */
  /***************************************/
  anonymousPageName = () => {
    return `page${PageIndex++}`;
  }

  startNFCAfterCheckSupportAndEnable = () => {
    return new Promise((resolve, reject) => {
      NFCManager.isSupported().then((supported) => {
        this.setState({nfc_supported: supported});
        if (Platform.OS === 'android') {
          NFCManager.isEnabled().then(enabled => {
            this.setState({ nfc_android_enable: enabled });
            if (!enabled) {
              Alert.alert(
                _t('nfcManager.notEnable'),
                _t('nfcManager.notEnableMsg'),
                [
                  {
                    text: _t('nfcManager.cancel'),
                    onPress: () => {UIMgr.pop();},
                    style: 'cancel',
                  },
                  {
                    text: _t('nfcManager.toOpenNFC'),
                    onPress: () => { NFCManager.goToNFCSetting(); },
                    style: 'destructive',
                  },
                ],
                {cancelable: true}
              );
            }
            this._startNFC();
            resolve();

          }).catch(err => {
            let errString = `check nfc is enabled error: ${err.toString()}`;
            console.log(errString);
            reject(errString);
          });
        } else {
          this._startNFC();
          resolve();
        }

      }).catch((err) => {
        let errStr = 'Not support NFC!';
        Alert.alert(errStr);
        reject(errStr);
      });
    });
  }

  scrollViewOnTouchStart(event){
    if (event._targetInst.elementType !== 'RCTSinglelineTextInputView' // 单行输入框
      && event._targetInst.elementType !== 'RCTMultilineTextInputView' // ios多行输入框
      && event._targetInst.elementType !== 'AndroidTextInput') { // 安卓输入框
      Keyboard.dismiss();
    }
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
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'stretch',
    backgroundColor: 'transparent', // 用这个透明view覆盖住页面，不知道能不能截断点击事件
  },
  toastContainerTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30 + Theme.NavigationBar.Height + ThemeMgr.StatusBarHeight,
    // backgroundColor: '#eaffa5',
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
    paddingBottom: 40 + ThemeMgr.SafeArea.bottom,
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
