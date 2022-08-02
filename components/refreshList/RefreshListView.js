import React, {Component} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import PropTypes from 'prop-types';
import RefreshState from './RefreshState';
import RefreshFooter from './RefreshFooter';

export default class RefreshListView extends Component {

  static propTypes = {
    onHeaderRefresh: PropTypes.func, // 下拉刷新的方法
    onFooterRefresh: PropTypes.func, // 上拉加载的方法
  };

  constructor(props) {
    super(props);
    this.state = {
      isHeaderRefreshing: false,  // 头部是否正在刷新
      isFooterRefreshing: false,  // 尾部是否正在刷新
      footerState: RefreshState.Idle, // 尾部当前的状态，默认为Idle，不显示控件
    };
    this.onEndReachedCalledDuringMomentum = false;
  }

  render() {

    //Outside of the component
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
      const paddingToBottom = 40; //Distance from the bottom you want it to trigger.

      let isClose = false;

      // 1、原判断，当 内容(contentSize) 小于 UI(layoutMeasurement) 时，会错误触发
      // isClose = (layoutMeasurement.height + contentOffset.y) >= (contentSize.height - paddingToBottom);

      // 2、[2022-03-16 James]
      if (contentSize.height > layoutMeasurement.height) { // TODO: 不知道这样会不会无法触发上拉加载
        isClose = (layoutMeasurement.height + contentOffset.y) >= (contentSize.height - paddingToBottom);
      }

      return isClose;
    };

    return (
      <FlatList
        {...this.props}
        ref={(ref) => {this._flatListRef = ref;}}
        onRefresh={()=>{ this.beginHeaderRefresh(); }}
        refreshing={this.state.isHeaderRefreshing}
        keyboardShouldPersistTaps={'always'}

        // // test 1
        // onEndReached={() => {
        //   console.log('FlatList onEndReached, beginFooterRefresh');
        //   this.beginFooterRefresh(); }}
        // onEndReachedThreshold={0.01}  // 这里取值0.1，可以根据实际情况调整，取值尽量小


        // test 2
        //other flatlist props, then...
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            // console.log('FlatList isCloseToBottom, beginFooterRefresh');
            this.beginFooterRefresh();
          }
        }}
        scrollEventThrottle={1000}

        ListFooterComponent={this._renderFooter}
        onMomentumScrollBegin={() => {
          // console.log('onMomentumScrollBegin, set onEndReachedCalledDuringMomentum false');
          this.onEndReachedCalledDuringMomentum = false;
        }}  // for how to avoid the second onEndReached call with the bouncing effect enabled on iOS

        refreshControl={
          <RefreshControl
            refreshing={this.state.isHeaderRefreshing}
            onRefresh={()=>{ this.beginHeaderRefresh(); }}
            title={_t('common.refreshing')}
            progressViewOffset={40}
            tintColor={Theme.SubView.TitleColor}
            titleColor={Theme.SubView.TitleColor}
          />
        }

        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  _renderFooter = () => {

    // console.log(`render Footer: ${this.state.footerState}`);
    //
    // if (this.state.footerState === RefreshState.Idle) {
    //   if (this._flatListRef) {
    //     // this._flatListRef.scrollToEnd({animated: true});
    //     // this._flatListRef.scrollToEnd({animated: false});
    //   }
    //   return null;
    // }
    //
    // return (
    //   <RefreshFooter
    //     state={this.state.footerState}
    //     onRetryLoading={()=>{
    //       this.beginFooterRefresh();
    //     }}
    //   />
    //
    // );

    return (
      <View style={{}}>
        {this.props.ListFooterComponent}
        <RefreshFooter
          state={this.state.footerState}
          onRetryLoading={()=>{
            this.beginFooterRefresh();
          }}
        />
      </View>

    );
  };

  /// 尾部组件的状态，供外部调用，一般不会用到
  footerState() {
    return this.state.footerState;
  }

  /// 开始下拉刷新
  beginHeaderRefresh() {
    if (this.shouldStartHeaderRefreshing()) {
      const nowTimestamp = new Date().getTime();
      const subTimestamp = nowTimestamp - this.lastTimesttamp;
      if (subTimestamp < 500) {
        return;
      }
      this.lastTimesttamp = new Date().getTime();
      this.startHeaderRefreshing();
    }
  }

  /// 开始上拉加载更多
  beginFooterRefresh() {
    // console.log('beginFooterRefresh');
    if (!this.onEndReachedCalledDuringMomentum) {

      if (this.shouldStartFooterRefreshing()) {
        this.onEndReachedCalledDuringMomentum = true;
        this.lastTimesttamp = new Date().getTime();
        this.startFooterRefreshing();
      }

    } else {
      // console.log(`XXX -- Refuse beginFooterRefresh, onEndReachedCalledDuringMomentum:${this.onEndReachedCalledDuringMomentum}`);
    }
  }

  /// 下拉刷新，设置完刷新状态后再调用刷新方法，使页面上可以显示出加载中的UI，注意这里setState写法
  startHeaderRefreshing() {
    this.setState(
      {
        isHeaderRefreshing: true,
      },
      () => {
        this.props.onHeaderRefresh && this.props.onHeaderRefresh();
      }
    );
  }

  /// 上拉加载更多，将底部刷新状态改为正在刷新，然后调用刷新方法，页面上可以显示出加载中的UI，注意这里setState写法
  startFooterRefreshing() {
    setTimeout(() => {
      this.setState(
        {
          footerState: RefreshState.Refreshing,
          isFooterRefreshing: true,
        },
        () => {
          // this.props.onFooterRefresh && this.props.onFooterRefresh();
          if (this.props.onFooterRefresh) {
            setTimeout(() => {
              this.props.onFooterRefresh();
            },50);
          }
        }
      );
    },100);
  }

  /***
   * 当前是否可以进行下拉刷新
   * @returns {boolean}
   *
   * 如果列表尾部正在执行上拉加载，就返回false
   * 如果列表头部已经在刷新中了，就返回false
   */
  shouldStartHeaderRefreshing() {
    if (this.state.footerState === RefreshState.refreshing ||
      this.state.isHeaderRefreshing ||
      this.state.isFooterRefreshing) {
      return false;
    }
    return true;
  }

  /***
   * 当前是否可以进行上拉加载更多
   * @returns {boolean}
   *
   * 如果底部已经在刷新，返回false
   * 如果底部状态是没有更多数据了，返回false
   * 如果头部在刷新，则返回false
   * 如果列表数据为空，则返回false（初始状态下列表是空的，这时候肯定不需要上拉加载更多，而应该执行下拉刷新）
   */
  shouldStartFooterRefreshing() {
    if (this.state.footerState === RefreshState.refreshing ||
      this.state.footerState === RefreshState.NoMoreData ||
      this.props.data.length === 0 ||
      this.state.isHeaderRefreshing ||
      this.state.isFooterRefreshing) {

      // console.log(`footerState:${this.state.footerState}, dataLength:${this.props.data.length}, HeaderRefreshing(${this.state.isHeaderRefreshing}), FooterRefreshing(${this.state.isFooterRefreshing})---XXX---> Not shouldStartFooterRefreshing`);

      return false;
    } else {
      const nowTimestamp = new Date().getTime();
      const subTimestamp = nowTimestamp - this.lastTimesttamp;
      if (subTimestamp < 500) {

        // console.log(`Action too fast(${subTimestamp}), reject return`);

      } else {

        // console.log(`footerState:${this.state.footerState}, dataLength:${this.props.data.length}, HeaderRefreshing(${this.state.isHeaderRefreshing}), FooterRefreshing(${this.state.isFooterRefreshing})------> shouldStartFooterRefreshing`);
        return true;
      }
    }

  }

  /**
   * 根据尾部组件状态来停止刷新
   * @param footerState
   *
   * 如果刷新完成，当前列表数据源是空的，就不显示尾部组件了。
   * 这里这样做是因为通常列表无数据时，我们会显示一个空白页，如果再显示尾部组件如"没有更多数据了"就显得很多余
   */
  endRefreshing(footerState: RefreshState) {

    // console.log(`endRefreshing: footerState: ${footerState}`);

    let footerRefreshState = footerState;
    if (this.props.data.length === 0) {
      footerRefreshState = RefreshState.Idle;
    }
    this.setState({
      footerState: footerRefreshState,
      isHeaderRefreshing: false,
      isFooterRefreshing: false,
    });
    this.lastTimesttamp = new Date().getTime();
  }
}

export {RefreshListView, RefreshState};
