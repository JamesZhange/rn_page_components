import React, { Component } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Prompt from './prompt';
import { ImageButton } from '../button';

const AnimationInDuration = 270;
const AnimationOutDuration = 200;

// 默认样式
const Pop_Header_Height = 44;
const Pop_Cell_Height = 48;



export default class CustomizeActionSheetPrompt extends Prompt {
  static propTypes = {
    ...Prompt.propTypes,
    // type1: 完全自定义界面
    dialog: PropTypes.element,
    popViewHeight: PropTypes.number,

    // type2: 自定义header和cell
    popHeader: PropTypes.element,
    popButtons: PropTypes.array,
    popHeaderHeight: PropTypes.number,
    popButtonHeight: PropTypes.number,

    // type3: 使用默认样式
    data: PropTypes.array,
    onCellClicked: PropTypes.func,
  };

  static defaultProps = {
    ...Prompt.defaultProps,
    dialog: null,
    popViewHeight: 0,

    popHeader: null,
    popButtons: null,

    data: null,
    onCellClicked: null,
  };

  constructor(props) {
    super(props);

    if (this.props.popViewHeight) {
      this.PopViewHeight = this.props.popViewHeight;
    } else {
      let listLength = 0;
      let headerHeight = Pop_Header_Height;
      let cellHeight = Pop_Cell_Height;

      if (this.props.popButtons) {
        listLength = this.props.popButtons.length;
      } else if (this.props.data) {
        listLength = this.props.data.length;
      }
      if (this.props.popHeaderHeight) {
        headerHeight = this.props.popHeaderHeight;
      }
      if (this.props.popButtonHeight) {
        cellHeight = this.props.popButtonHeight;
      }

      this.PopViewHeight = headerHeight + (listLength * cellHeight) + ThemeMgr.SafeArea.bottom + 30;
    }

    this.state = {
      ...this.state,

      // pop info view
      offset: new Animated.Value(0),
      opacity: new Animated.Value(0),
    };
  }





  /****************
   * 弹出界面
   * */

  show = (callback=()=>{}) => {
    this.setState({visible: true}, () => {
      this.popViewIn(callback);
    });
  }

  close = (callback=()=>{}) => {
    Keyboard.dismiss();
    this.popViewOut(() => {
      this.setState({visible: false}, callback);
    });
  };

  //显示动画
  popViewIn = (callback) => {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          easing: Easing.linear,
          duration: AnimationInDuration,
          toValue: 0.7,
        }
      ),
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.linear,
          duration: AnimationInDuration,
          toValue: 1,
        }
      ),
    ]).start(callback);
  }

  //隐藏动画
  popViewOut = (callback) => {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          easing: Easing.linear,
          duration: AnimationOutDuration,
          toValue: 0,
        }
      ),
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.linear,
          duration: AnimationOutDuration,
          toValue: 0,
        }
      ),
    ]).start(callback);
  }


  /****************
   * Render
   * */

  _renderPopDialog = () => {
    // type1
    if (this.props.dialog) {
      return this.props.dialog;
    }

    // type2 / type3
    return (
      <View style={styles.dialog}>
        {this._renderHeader()}
        {this._renderButtonList()}
      </View>
    );
  }

  _renderHeader = () => {
    // type2
    if (this.props.popHeader) {
      return this.props.popHeader;
    }

    // type3
    if (this.props.data) {
      return (
        <View style={styles.popHeaderView}>
          <ImageButton
            image={Images.common.close}
            onPress={this.closeActionSheet}
            containerStyle={styles.navCloseButton}
            imageStyle={styles.navCloseButtonImage}
          />
        </View>
      );
    }

    return null;
  }

  _renderButtonList = () => {
    // type2
    if (this.props.popButtons) {
      return (
        <View style={styles.list}>
          {this.props.popButtons}
        </View>
      );
    }

    // type 3
    if (this.props.data) {
      let buttons = [];
      for (let data of this.props.data) {
        buttons.push(this._renderPopCell(data.text, data.key));
      }
      return (
        <View style={styles.list}>
          {buttons}
        </View>
      );
    }

    return null;
  }

  _renderPopCell = (title, cellKey) => {
    return (
      <TouchableOpacity
        key={cellKey}
        style={styles.popCell}
        activeOpacity={Theme.Button.ActiveOpacity}
        onPress={() => {
          this.closeActionSheet();
          this.props.onCellClicked(cellKey);
        }}
      >
        <Text style={styles.popCellText}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }




  // Pop
  _renderPopPage() {
    if (this.state.visible) {
      return (
        <View style={styles.page}>
          <Animated.View style={styles.mask}>
            <TouchableOpacity
              onPress={this.closeActionSheet}
              accessible={false}
              style={{flex: 1}}
              activeOpacity={Theme.Button.ActiveOpacity}
            />
          </Animated.View>
          <Animated.View
            style={[
              [styles.popInfoView, {height: this.PopViewHeight}],
              {
                transform: [
                  {
                    translateY: this.state.offset.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        SCREEN_HEIGHT,
                        (SCREEN_HEIGHT - this.PopViewHeight)],
                    }),
                  }],
              },
            ]}
          >

            {this._renderPopDialog()}

          </Animated.View>
        </View>
      );
    } else {
      return null;
    }
  }

  closeActionSheet = () => {
    Keyboard.dismiss();
    this.close();
  }




}



const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'transparent',
    // backgroundColor: '#9ca05788',
  },
  // popOutView: {
  //   position: 'absolute',
  //   width: SCREEN_WIDTH,
  //   height: iOS ? SCREEN_HEIGHT : SCREEN_HEIGHT + 36,
  //   left: 0,
  //   top: 0,
  // },
  mask: {
    justifyContent: 'center',
    backgroundColor: Theme.Prompt.MaskBGColor,
    opacity: 0.8,
    position: 'absolute',
    width: SCREEN_WIDTH+200,
    height: SCREEN_HEIGHT+200,
    left: 0,
    top: 0,
    // backgroundColor: '#8fee93',
  },
  popInfoView: {
    width: SCREEN_WIDTH,
    // left: 0,
    alignItems: 'stretch',
    backgroundColor: 'transparent', // Theme.Prompt.BGColor,
  },

  dialog: {
    // backgroundColor: '#e74fba',
    flex: 1,
    backgroundColor: Theme.Page.BGColor,
  },


  // pop
  navCloseButton: {
    width: Pop_Header_Height,
    height: Pop_Header_Height,
  },
  navCloseButtonImage: {
    width: 26,
    height: 26,
  },
  popHeaderView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Pop_Header_Height,
    marginHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Theme.SubView.SplitLineColor,
    // backgroundColor: '#c45454',
  },
  list: {
    // backgroundColor: '#83c454',
  },
  popCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Pop_Cell_Height,
    marginHorizontal: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: Theme.SubView.SplitLineColor,
    // backgroundColor: '#3b779f',
  },
  popCellText: {
    fontSize: FONT_SIZE(12),
    color: Theme.SubView.TitleColor,
    fontWeight: Theme.Page.TitleWeight,
  },

});


