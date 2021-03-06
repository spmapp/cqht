/**
 * Created by wangdi on 22/11/16.
 */
'use strict';

import React, {Component} from 'react';
import {StyleSheet, Platform, View, Text, Image, ToastAndroid, BackAndroid} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import HomeFragment from './HomeTab/index';
import DiscoveryFragment from './DiscoveryTab/index';
import MoreFragment from './MoreTab/index';
import CollectionFragment from './CollectionTab/index';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../constants/theme';
import px2dp from '../utils/px2dp';
import {connect} from 'react-redux';
import {store} from '../store/index';
import {fetchStarList} from '../actions/handleCollectionData';
import {fetchSearchList} from '../actions/SearchAction';
import {initialSettingsStateFacade} from '../actions/modifySettings';
import {initLoginState} from '../actions/LoginAction';

class MainPage extends Component{

    render(){
        return(
            <BottomTabBar
                navigator={this.props.navigator}
                mainThemeColor={this.props.mainThemeColor}
                rowItemBackgroundColor={this.props.rowItemBackgroundColor}
                tabIconColor={this.props.tabIconColor}
            />
        );
    }
}

class BottomTabBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTab: 'home'
        };
    }

    _renderItem(Component, tab, tabName, normalIcon, selectedIcon){
        const {navigator, tabIconColor} = this.props;
        return(
            <TabNavigator.Item
                selected={this.state.selectedTab === tab}
                title={tabName}
                selectedTitleStyle={{color: tabIconColor}}
                renderIcon={() => <Image style={styles.tabBarItemIcon} source={normalIcon} />}
                renderSelectedIcon={() => <Image style={[styles.tabBarItemIcon, {tintColor: tabIconColor}]} source={selectedIcon} />}
                onPress={() => this.setState({ selectedTab: tab })}>
                {<Component navigator={navigator}/>}
            </TabNavigator.Item>
        );
    }

    render(){
        return(
            <TabNavigator
                hidesTabTouch={true}
                tabBarStyle={[styles.tabBarStyle, {backgroundColor: this.props.rowItemBackgroundColor}]}
                sceneStyle={{
                    paddingTop: theme.toolbar.paddingTop, //immersive experience
                    paddingBottom: styles.tabBarStyle.height}}>
                {this._renderItem(HomeFragment, 'home', '首页', this.state.homeNormal, this.state.homeSelected)}
                {this._renderItem(DiscoveryFragment, 'discovery', '发现', this.state.compassNormal, this.state.compassSelected)}
                {this._renderItem(CollectionFragment, 'collection', '收藏', this.state.collectionNormal, this.state.collectionSelected)}
                {this._renderItem(MoreFragment, 'more', '我的', this.state.moreNormal, this.state.moreSelected)}
            </TabNavigator>
        );
    }

    componentWillMount(){
        const tabIconColor = this.props.tabIconColor;
        if(Platform.OS === 'ios') {
            Icon.getImageSource('ios-home-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({homeNormal: source}));
            Icon.getImageSource('ios-home-outline', 100, tabIconColor).then((source) => this.setState({homeSelected: source}));
            Icon.getImageSource('ios-compass-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({compassNormal: source}));
            Icon.getImageSource('ios-compass-outline', 100, tabIconColor).then((source) => this.setState({compassSelected: source}));
            Icon.getImageSource('ios-list-box-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({moreNormal: source}));
            Icon.getImageSource('ios-list-box-outline', 100, tabIconColor).then((source) => this.setState({moreSelected: source}));
            Icon.getImageSource('ios-cube-outline', 100, theme.tabButton.normalColor).then((source) => this.setState({collectionNormal: source}));
            Icon.getImageSource('ios-cube-outline', 100, tabIconColor).then((source) => this.setState({collectionSelected: source}));
        }else if(Platform.OS === 'android'){
            Icon.getImageSource('md-home', 100, theme.tabButton.normalColor).then((source) => this.setState({homeNormal: source}));
            Icon.getImageSource('md-home', 100, tabIconColor).then((source) => this.setState({homeSelected: source}));
            Icon.getImageSource('md-compass', 100, theme.tabButton.normalColor).then((source) => this.setState({compassNormal: source}));
            Icon.getImageSource('md-compass', 100, tabIconColor).then((source) => this.setState({compassSelected: source}));
            Icon.getImageSource(/*'md-list-box'*/'md-person', 100, theme.tabButton.normalColor).then((source) => this.setState({moreNormal: source}));
            Icon.getImageSource(/*'md-list-box'*/'md-person', 100, tabIconColor).then((source) => this.setState({moreSelected: source}));
            Icon.getImageSource('md-cube', 100, theme.tabButton.normalColor).then((source) => this.setState({collectionNormal: source}));
            Icon.getImageSource('md-cube', 100, tabIconColor).then((source) => this.setState({collectionSelected: source}));
        }
		if (Platform.OS === 'android') {
			//返回键监听
			BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
		}
    }

    componentDidMount(){
        store.dispatch(fetchStarList());
        store.dispatch(fetchSearchList()); //搜索记录
        store.dispatch(initialSettingsStateFacade());
		store.dispatch(initLoginState());
    }

	componentWillUnmount() {
		if (Platform.OS === 'android') {
			//卸载返回键监听
			BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
		}
	}
	
	onBackAndroid = () => {
		if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
				//最近2秒内按过back键，可以退出应用。
				return false;
		}
		this.lastBackPressed = Date.now();
		ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);
		return true;
	};
}

const mapStateToProps = (state) => {
    return {
        mainThemeColor: state.settingState.colorScheme.mainThemeColor,
        rowItemBackgroundColor: state.settingState.colorScheme.rowItemBackgroundColor,
        tabIconColor: state.settingState.colorScheme.tabIconColor
    };
};

const styles = {
    tabBarItemIcon: {
        width: px2dp(20),
        height: px2dp(20)
    },
    tabBarStyle: {
        height: px2dp(45),
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? px2dp(6) : px2dp(3)
    }
}

export default connect(mapStateToProps)(MainPage);