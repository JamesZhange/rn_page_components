import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { QRCode } from './QRCodeGen';
import { NavBarPage } from './navBarPage';
import { IconTextButton } from './button';

const QRViewSize = (SCREEN_WIDTH * 2) / 3;
const QRViewMarginH = 20;

export default class BaseQRCodePage extends NavBarPage {
  static propTypes = {
    ...NavBarPage.propTypes,
  };

  static defaultProps = {
    ...NavBarPage.defaultProps,
    navTitle: '',
    showBackButton: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      qrCodeLogo: Images.tmp,
      qrCodeCurrentPage: 0,
      forceUpdate: 0,
    };

    this._qrCodeList = null;
    // this.qrCodeTotalPage = 0;

    this.buttonEndable = true;
  }

  componentDidMount() {
    super.componentDidMount();
    this.setState({ qrCodeCurrentPage: 0 });
  }

  // Data
  get qrCodeList() {
    return ['Base QRCode Page'];
  }
  get qrCodeTotalPage() {
    return this.qrCodeList.length;
  }

  // Action

  _onPrePageButtonClicked = () => {
    if (Android || this.buttonEndable) {
      // bug补丁： Android scrollTo 后不触发 onQRCodeScrollEnd， https://github.com/facebook/react-native/issues/11693
      if (this.state.qrCodeCurrentPage > 0) {
        this._moveScrollToPage(this.state.qrCodeCurrentPage - 1);
      }
    }
  };

  _onNextPageButtonClicked = () => {
    if (Android || this.buttonEndable) {
      // bug补丁： Android scrollTo 后不触发 onQRCodeScrollEnd， https://github.com/facebook/react-native/issues/11693
      if (this.state.qrCodeCurrentPage < this.qrCodeTotalPage - 1) {
        this._moveScrollToPage(this.state.qrCodeCurrentPage + 1);
      }
    }
  };
  _moveScrollToPage = page => {
    //让ScrollView动起来
    if (this.QRScrollView) {
      let fixPage = Math.round(page);
      if (fixPage < 0) {
        fixPage = 0;
      } else if (fixPage > this.qrCodeTotalPage - 1) {
        fixPage = this.qrCodeTotalPage - 1;
      }
      let offSetX = fixPage * (QRViewSize + QRViewMarginH);
      this.QRScrollView.scrollTo({ x: offSetX, y: 0, animated: true });
      this.buttonEndable = false;
      this.setState({ qrCodeCurrentPage: fixPage });
    }
  };
  onQRCodeScrollStart = () => {
    this.buttonEndable = false;
  };
  onQRCodeScrollEnd = e => {
    let offSetX = e.nativeEvent.contentOffset.x; // 求出水平方向上的偏移量
    let currentPage = Math.round(offSetX / (QRViewSize + QRViewMarginH)); // 计算当前页码
    if (currentPage < 0) {
      currentPage = 0;
    } else if (currentPage > this.qrCodeTotalPage - 1) {
      currentPage = this.qrCodeTotalPage - 1;
    }
    // console.log(`offset: ${offSetX}, currentPage: ${currentPage}`);
    this.setState({ qrCodeCurrentPage: currentPage });
    this.buttonEndable = true;
  };

  // Render

  renderQRCodeScrollView = () => {
    let qrCodeViewArray = [];
    for (let i = 0; i < this.qrCodeList.length; i++) {
      let qrCodeComp = <QRCode value={this.qrCodeList[i]} size={QRViewSize} logo={this.state.qrCodeLogo} />;
      // if (Android) {
      //   qrCodeComp = (
      //     <QRCode
      //       value={this.qrCodeList[i]}
      //       size={QRViewSize}
      //       //logo={this.QRCodeLogo}
      //       logoBackgroundColor={'transparent'}
      //       //logoSize = {this.QRCodeLogo.width}
      //     />
      //   );
      // }

      let qrCodeView = (
        <View
          key={`${i}`}
          style={{
            width: QRViewSize + QRViewMarginH,
            height: QRViewSize + QRViewMarginH,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {qrCodeComp}
        </View>
      );
      qrCodeViewArray.push(qrCodeView);
    }
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: QRViewSize + QRViewMarginH + 2,
          height: QRViewSize + QRViewMarginH + 2,
          backgroundColor: Theme.Page.BGColor,
          borderWidth: 1,
          borderColor: Theme.SubView.BorderColor,
        }}
      >
        <View
          style={{
            width: QRViewSize + QRViewMarginH,
            height: QRViewSize + QRViewMarginH,
            backgroundColor: Theme.Page.BGColor,
          }}
        >
          <ScrollView
            ref={(scrollView) => {this.QRScrollView = scrollView;}}
            overScrollMode={'auto'} // android
            alwaysBounceVertical={false} // ios
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            directionalLockEnabled={true}
            pagingEnabled={true}
            onMomentumScrollBegin={this.onQRCodeScrollStart}
            onMomentumScrollEnd={this.onQRCodeScrollEnd}
          >
            {qrCodeViewArray}
          </ScrollView>
        </View>
      </View>
    );
  };

  renderPageNumber = () => {
    if (this.qrCodeTotalPage === 1) {
      return null;
    } else {
      return (
        <View style={styles.pageNumberContent}>
          <Text style={styles.pageShowText}>{`${this.state.qrCodeCurrentPage + 1} 页 / ${this.qrCodeTotalPage} 页`}</Text>
        </View>
      );
    }
  };

  prePageButton = () => {
    return (
      <IconTextButton
        buttonStyle={styles.pageControllerTopButton}
        image={Images.tmp}
        imageStyle={styles.pageButtonIcon}
        title={_t('syncGasPricesPage.prePage')}
        titleStyle={styles.pageButtonTitle}
        onPress={this._onPrePageButtonClicked}
        disabled={this.state.qrCodeCurrentPage === 0}
      />
    );
  };
  nextPageButton = () => {
    if ((this.state.qrCodeCurrentPage + 1) < this.qrCodeTotalPage) {
      return (
        <IconTextButton
          buttonStyle={styles.pageControllerBottomButton}
          image={Images.tmp}
          imageStyle={styles.pageButtonIcon}
          title={_t('syncGasPricesPage.nextPage')}
          titleStyle={styles.pageButtonTitle}
          onPress={this._onNextPageButtonClicked}
          disabled={this.state.qrCodeCurrentPage + 1 === this.qrCodeTotalPage}
        />
      );
    } else {
      return this.endPageButton();
    }
  }
  endPageButton = () => {
    return (
      <IconTextButton
        buttonStyle={styles.pageControllerBottomButton}
        image={Images.tmp}
        imageStyle={styles.pageButtonIcon}
        title={_t('syncGasPricesPage.nextPage')}
        titleStyle={styles.pageButtonTitle}
        onPress={()=>{}}
        disabled={true}
      />
    );
  }

  renderPageController = () => {
    if (this.qrCodeTotalPage === 1) {
      return null;
    } else {
      return (
        <View style={styles.pageControllerContent}>
          {this.prePageButton()}
          {this.nextPageButton()}
        </View>
      );
    }
  };

  renderPage() {
    return (
      <View style={styles.page}>
        <View style={styles.topView}>
          {this.renderPageNumber()}
          {this.renderQRCodeScrollView()}
          <Text style={styles.messageText}>QR Code</Text>
        </View>
        <View style={styles.bottomView}>{this.renderPageController()}</View>
      </View>
    );
  }
}

const PageControlButtonHeigh = 80;
const PageControlButtonRadius = 20;

const PageControlImageButtonWidth = SCREEN_WIDTH - 60 + 20;
const PageControlImageButtonHeight = (PageControlImageButtonWidth * 110) / 630;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Theme.Page.BGColor,
  },
  topView: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 2,
    alignItems: 'center',
    marginBottom: 20 + ThemeMgr.SafeArea.bottom,
  },

  QRCodeView: {
    marginHorizontal: 40,
    marginTop: 10,
    //  aspectRatio: 1,  // debug, 这里设置比例后位置就偏移了
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: FONT_SIZE(9),
    color: Theme.SubView.TextColor,
  },

  pageButtonIcon: {
    width: 45,
    marginRight: 12,
  },
  pageButtonTitle: {
    fontSize: FONT_SIZE(13),
  },
  pageControllerContent: {
    alignItems: 'center',
  },
  pageNumberContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageShowText: {
    textAlign: 'center',
    fontSize: FONT_SIZE(12),
    fontWeight: 'bold',
    color: Theme.SubView.TextColor,
  },
  pageControllerTopButton: {
    width: (SCREEN_WIDTH * 2) / 3 + 2 * 10,
    height: PageControlButtonHeigh,
    marginBottom: 4,
    borderTopRightRadius: PageControlButtonRadius,
    borderTopLeftRadius: PageControlButtonRadius,
  },
  pageControllerBottomButton: {
    width: (SCREEN_WIDTH * 2) / 3 + 2 * 10,
    height: PageControlButtonHeigh,
    borderBottomRightRadius: PageControlButtonRadius,
    borderBottomLeftRadius: PageControlButtonRadius,
  },

  pageControllerTopImageButton: {
    width: PageControlImageButtonWidth,
    height: PageControlImageButtonHeight,
  },
  pageControllerBottomImageButton: {
    marginTop: 22,
    width: PageControlImageButtonWidth,
    height: PageControlImageButtonHeight,
  },
});

export { BaseQRCodePage, styles as QRCodePageStyle };
