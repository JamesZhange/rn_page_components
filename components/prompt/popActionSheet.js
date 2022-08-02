import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import {
    ImageButton,
} from '../index';

export default class PopActionSheet extends Component {
    static propTypes = {
        listData: PropTypes.array,
        modalTitle: PropTypes.string,
        listHeaderView: PropTypes.any,
        showCellImage: PropTypes.any,
        currentChoose: PropTypes.any,
        modalCallback: PropTypes.func,
        cellkey: PropTypes.string,
    }

    static defaultProps = {
        flatListData: [],
        modalTitle: '请选择',
        listHeaderView: null,
        showCellImage: true,
        currentChoose: null,
        cellkey: null,
        modalCallback: () => { },
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };

        this.showCellImage = this.props.showCellImage;
    }

    show(){
        this.setState({ visible: true });
    }

    cancelModal = () => {
        this.setState({ visible: false });
    }

    cellChooseClick = (item) => {
        this.cancelModal();
        this.props.modalCallback(item);
    }

    renderItem = (cell) => {
        // console.log(cell);
        let choose = false;
        if (this.props.currentChoose && (this.props.currentChoose !== '')) {
            if (cell.item === this.props.currentChoose) {
                choose = true;
            }
        } else {
            if (cell.index === 0) {
                choose = true;
            }
        }
        
        let text = cell.item;
        if (this.props.cellkey) {
            text = cell.item[this.props.cellkey]
        }

        return (
            <TouchableOpacity
              onPress={() => { this.cellChooseClick(cell.item); }}
              activeOpacity={Theme.Button.ActiveOpacity}
            >
                <View style={styles.cellStyle}>
                    <View style={styles.cellTextView}>
                        {this.showCellImage ? <ImageButton image={Images.tmp} containerStyle={styles.imageStyle} disabled={true} onPress={() => { }} /> : null}
                        <Text style={styles.cellText}>{text}</Text>
                    </View>
                    <ImageButton
                        image={choose ? Images.workStudioPage.choose : null}
                        imageStyle={styles.imageStyle}
                        disabled={true}
                        onPress={() => { }}
                    />

                </View>
            </TouchableOpacity>
        );
    }

    renderSubView = () => {

        const {
            listData,
            modalTitle,
            listHeaderView,
        } = this.props;

        return (
            <View style={styles.subView}>
                    <View style={styles.titleView}>

                        <View style={styles.textView}>
                            <Text style={styles.actionTitle}>
                                {modalTitle}
                            </Text>
                        </View>
                        <ImageButton
                            image={Images.workStudioPage.close}
                            imageStyle={styles.imageStyle}
                            onPress={this.cancelModal}
                        />
                    </View>
                    <FlatList
                        data={listData}
                        renderItem={this.renderItem}
                        ListHeaderComponent={listHeaderView}
                        ListFooterComponent={<View style={{ height: 50 }} />} // 占位防止底部太低
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
            </View>);
    }

    render() {
        return (
            <Modal
                animationType="slide"
                visible={this.state.visible}
                transparent={true}
                onRequestClose={() => this.setState({ visible: false })}
            >
                <View style={styles.modalStyle}>
                    <TouchableOpacity
                      style={styles.modalBGStyle} onPress={this.cancelModal}
                      activeOpacity={Theme.Button.ActiveOpacity}
                    />
                    {this.renderSubView()}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
    },
    modalBGStyle: {
        flex: 1,
        backgroundColor: Theme.SubView.BGColor,
        opacity: 0.5,
    },
    cellView:{
        borderBottomWidth:0.5,
        borderBottomColor:Theme.Page.SplitLineColor,
        marginHorizontal:15,
    },
    subView: {
        maxHeight: SCREEN_HEIGHT * 0.8,
        minHeight: 300,
        backgroundColor: Theme.Page.BGColor,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    titleView: {
        marginVertical: 10,
        marginHorizontal: 15,
        flexDirection: 'row',

    },
    textView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        height: 25,
        width: 25,
    },
    cellStyle: {
        flexDirection: 'row',
        marginVertical: 10,
        borderBottomWidth:0.5,
        borderBottomColor:Theme.Page.SplitLineColor,
        marginHorizontal:15,
        paddingVertical:10,
    },
    cellTextView: {
        flex: 1,
        flexDirection:
            'row',
        alignItems: 'center',
    },
    cellText: {
        // marginHorizontal: 10,
        color: Theme.Page.TextColor,
        fontSize: 14,
    },
    actionTitle: {
        fontSize: 15,
        color: Theme.Page.TextColor,
    },
});


