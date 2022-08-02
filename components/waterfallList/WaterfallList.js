import React from 'react';
import { Dimensions, View, StyleSheet, VirtualizedList, ScrollView,RefreshControl,Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import WaterFlow from 'react-native-waterflow-list/src/';
import {FlatList } from 'react-native-scroll-head-tab-view';
const { createAnimatableComponent } = Animatable;
const AnimatableView = createAnimatableComponent(View);


const { width } = Dimensions.get('window');


class WaterfallList extends React.Component {
  static defaultProps = {
    numColumns: 2,
    onEndReachedThreshold: 0.1,
    gap: 5,
    enableFadeIn: false,
    keyExtractor: (item, index) => {
      if (item.key != null) {
        return item.key;
      }
      if (item.id != null) {
        return item.id;
      }

      return String(index);
    },

  }

  constructor(props) {
    super(props);
    const { refreshing, numColumns } = this.props;
    let data = [...Array(numColumns)].map(_ => []);

    this.state = {
      data,
      loading:false
    };
  }

  checkHasData = () => {
    const { data = [] } = this.state;
    let hasData = false;
    data.forEach(columns => {
      columns.forEach(item => {
        if (item) {
          hasData = true;
        }
      });
    });
    return hasData;
  }

  clearData = (cb=()=>{}) => {
    this.setState({
      data: this.state.data.map(columns => ([])),
    }, cb);
  }

  addMoreData = (items = [], cb=()=>{}) => {
    // const startTime = new Date().getTime();
    const { numColumns } = this.props;

    // 为当前 items 放置位置而设计的数据块 _data
    let _data = [...Array(numColumns)].map(_ => []);


    let dataDimensions = this.state.data.map(columns => columns.map(item => ({ height: item.height || 0 })));

    // let i = 0;
    items.forEach((item, index) => {
      // 获得到待放置位置的 column 索引
      const readyColumnIndex = this.getReadyColumnIndex(dataDimensions);
      // console.log(`readyColumnIndex(${i++}) = ${readyColumnIndex}`);
      _data[readyColumnIndex].push(item);
      dataDimensions[readyColumnIndex].push({ height: item.height || 0 }); // 对当前分配的位置的下一次计算，进行补加
    });


    this.preDataDimensions = this.state.data.map(columns => columns.map(item => ({ height: item.height || 0 })));

    // 位置分配结束
    this.setState({
      data: this.state.data.map((lastColumnData, columnIndex) => {
        return lastColumnData.concat(_data[columnIndex]);
      }),
    }, cb);
  }

  getReadyColumnIndex = (dimensions = []) => {
    const columnsTotalHeights = dimensions.map(columnDimensions => columnDimensions.map(_ => _.height).reduce((x, y) => x + y, 0));
    const minHeights = Math.min(...columnsTotalHeights);
    const minIndex = columnsTotalHeights.indexOf(minHeights);
    return minIndex;
  }


  componentDidMount = async () => {
  }

  _captureRef = ref => {
    this._listRef = ref;
  }

  _keyExtractor = (items, index) => {
    const { keyExtractor } = this.props;
    return keyExtractor(items, index);
  }

  _getItem = (data, index, columnIndex) => {
    return data[index];
  }

  _getItemCount = (data, index) => {
    return data.length || 0;
  }

  _renderItem = ({ item, index,columnIndex}) => {
    const { renderItem_w, gap } = this.props;

    if (this.props.enableFadeIn) {
      const { preDataDimensions = [] } = this;
      const preColumns = preDataDimensions[columnIndex] || [];
      let _index = index;
      if (index > preColumns.length - 1) {
        _index = index - (preColumns.length - 1);
      }

      return (
        <AnimatableView
          // animation={"fadeInUp"}
          animation={{
            from: {
              opacity: 0.7,
              translateY: 50,
            },
            to: {
              opacity: 1,
              translateY: 0,
            },
          }}
          delay={200 * _index}
          style={{
            marginBottom: gap,
          }}
        >
          {renderItem_w({ item, index })}
        </AnimatableView>
      );
    }

    return (
      <View style={{
        marginBottom: gap,
      }}>
        {renderItem_w({ item, index })}
      </View>
    );
  }


  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    // console.log('saul layoutMeasrement.height & contentSize.height', layoutMeasurement.height, contentSize.height, contentOffset.y);

    // 解决顶部滑动误触发。内容高度必须大于容器高度。滑动距离必须有一定的距离
    if (layoutMeasurement.height > contentSize.height || contentOffset.y <= 20) {
      return false;
    }
    const { onEndReachedThreshold = 0.1 } = this.props;
    const visibleLength = layoutMeasurement.height;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - onEndReachedThreshold * visibleLength;
  }

  isLeaveToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const { onEndReachedThreshold = 0.1 } = this.props;
    const visibleLength = layoutMeasurement.height;
    return layoutMeasurement.height + contentOffset.y < contentSize.height - onEndReachedThreshold * visibleLength;
  }

  onEndReached = (e) => {
    const { onEndReached } = this.props;
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceFromEnd = contentSize.height - layoutMeasurement.height - contentOffset.y;
    onEndReached && onEndReached({ distanceFromEnd });
  }

  onScroll = (e) => {
    const { onScroll } = this.props;
    onScroll && onScroll(e);

    if (this.isLeaveToBottom(e.nativeEvent)) {
      this.hasReachedEnd = false;
    }

    if (this.hasReachedEnd) {
      return;
    }

    if (this.isCloseToBottom(e.nativeEvent)) {
      this.hasReachedEnd = true;
      this.onEndReached(e);
    }
  }

  render() {
    const {
      ListEmptyComponent = () => null,
      ListHeaderComponent = () => null,
      ListFooterComponent = () => null,
      style = {},
    } = this.props;

    const emptyElement = React.isValidElement(ListEmptyComponent) ? (ListEmptyComponent) : (<ListEmptyComponent />);
    const headerElement = React.isValidElement(ListHeaderComponent) ? (ListHeaderComponent) : (<ListHeaderComponent />);
    const footerElement = React.isValidElement(ListFooterComponent) ? (ListFooterComponent) : (<ListFooterComponent />);

    let data = [];
    this.state.data.map((columnsData, columnIndex) => {
      if (columnsData.length>0) {
        for (let i = 0; i < columnsData.length; i++) {
          let info = columnsData[i];
          info.id = info.key;
          data.push(info);
        }
      }
      
    });

    return (
      <FlatList
        {...this.props}
        numColumns={1}
        data={[data]}
        renderItem={(info) => {
          return (
            <View>
              {!this.checkHasData() && emptyElement}
              <WaterFlow
                ref={ref => this.WaterFlowRef = ref}
                data={info.item}
                keyExtractor={this.props.keyExtractor_w}
                keyForItem={citem => `WaterFlowKey-${citem.id}`}
                numColumns={2}
                renderItem={({ item, index }) => this._renderItem({ item, index, index })}
              />
            </View>
          )
        }}
      />
    );
  }

}

const styles = StyleSheet.create({
  container: {
  },
  row: {
    flexDirection: 'row',
  },
});

export default WaterfallList;
