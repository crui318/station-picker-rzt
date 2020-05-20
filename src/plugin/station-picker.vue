<template>
    <div class="station-picker">
        <van-search v-model="searchText" background="#0687FF" placeholder="请输入厂站名/拼音或首字母查询" show-action @search="onSearch">
            <div class="station-picker-button" slot="action" @click="onSearch">搜索</div>
        </van-search>
        <van-tabs class="cardTop" type="card" v-model='partitionTabIndex' @change="partitionChanged">
            <van-tab v-for="(partition,partitionIndex) in partitionArray" :key="partitionIndex" :title="partition.name">
                <div class="station-picker-label">
                    <label>{{currentStations[partitionIndex].stationsObjs.length > 0 ? "已选择" : "请选择"}}：</label>
                    <div class="station-picker-label-box" :id="`labelBoxView${partitionIndex}`">
                        <div v-for="(station,stationIndex) in currentStations[partitionIndex].stationsObjs" :key="stationIndex">
                            <van-tag plain closeable type="primary" size="large"
                            @close="deleteStation(station)">{{station.NAME}}</van-tag>
                        </div>
                    </div>
                </div>
                <van-tabs :class="`station-picker-list${currentStations[partitionIndex].listStyleIndex}`"
                    v-model='currentStations[partitionIndex].categoryIndex' @change="categoryChanged" :swipe-threshold="categoryArray.length">
                    <van-tab v-for="(category,categoryIndex) in categoryArray" :key="categoryIndex" :title='category.name'>
                        <stationPicker
                        :selectedIDs="currentStations[partitionIndex].stationIDs"
                        :categoryName="categoryArray[currentStations[partitionIndex].categoryIndex].name"
                        :voltageType="currentStations[partitionIndex].voltageType"
                        :stationsData="stationCacheData[partitionIndex][categoryIndex]"
                        :listStyleIndex="currentStations[partitionIndex].listStyleIndex"
                        @voltageChanged="voltageChanged"
                        @stationChanged="stationChanged"
                        @loadingMoreData="loadingMoreData"/>
                    </van-tab>
                </van-tabs>
            </van-tab>
        </van-tabs>
        <div class="bottom">
            <van-button plain color="#0687FF" @click="cancel">取消</van-button>
            <van-button color="#0687FF" @click="accept">确定</van-button>
        </div>
    </div>
</template>

<script>
    // rem转换
    import '../libs/rem';
    // 自定义的样式
    import '../assets/less/index.less';
    // vant样式导入
    import 'vant/lib/index.css';
    import 'vant/lib/icon/local.css';

    import {Notify} from 'vant';
    import stationPicker from "./station-picker-panel";

    export default {
        name: "station-picker",
        components: {
            stationPicker
        },
        data() {
            return {
                searchText: "",
                partitionTabIndex: 0,
                lastCategoryIndex: 0,
                partitionArray: [
                    {name: "行政区域", type: "region"},
                    {name: "电网", type: "pwgrid"}
                ],
                categoryArray: [
                    {name: "全部", type: "all"},
                    {name: "变电站", type: "substation"},
                    {name: "电厂", type: "plant"},
                    {name: "用户变", type: "yhb"},
                    {name: "换流站", type: "hlz"}
                ],
                stationCacheData: [[{
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }], [{
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }, {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                }]],
                currentStations: [
                    {
                        listStyleIndex: 0,
                        categoryIndex: 0,
                        voltageType: "",
                        stationIDs: [],
                        stationsObjs: []
                    },
                    {
                        listStyleIndex: 0,
                        categoryIndex: 0,
                        voltageType: "",
                        stationIDs: [],
                        stationsObjs: []
                    }
                ],
                requestParams: {
                    search: "",
                    partition: "region",
                    category: "all",
                    voltage: ""
                }
            };
        },
		props: {
			stationsData: {
				type: Object,
				default: () => {
					return {
                        voltageArray: [
                            {name: "全部", type: "all"}
                        ],
                        stationArray: [],
                        moreData: false
                    };
                }
            }
        },
		watch: {
			stationsData: {
				handler(n, m) {
                    let index = this.partitionTabIndex;
                    let subIndex = this.currentStations[index].categoryIndex;
                    this.stationCacheData[index][subIndex] = this.stationsData;
				},
                immediate: true,
				deep: true
			},
            regionSelectedsLength: function() {
                this.$nextTick(function() {
                    this.refreshListStyle(0);
                });
            },
            ownerSelectedsLength: function() {
                this.$nextTick(function() {
                    this.refreshListStyle(1);
                });
            }
		},
        computed: {
            regionSelectedsLength: function() {
                return this.currentStations[0].stationsObjs.length;
            },
            ownerSelectedsLength: function() {
                return this.currentStations[1].stationsObjs.length;
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.$emit("refreshVoltageAndStations", this.requestParams);
            });
        },
        methods: {
            resetCacheData(index, subIndex) {
                this.stationCacheData[index][subIndex] = {
                    voltageArray: [
                        {name: "全部", type: "all"}
                    ],
                    stationArray: [],
                    moreData: false
                };
            },
            refreshListStyle(index) {
                let label = document.getElementById(`labelBoxView${index}`);
                if (undefined != label) {
                    this.currentStations[index].listStyleIndex = Math.floor(label.offsetHeight / 30);
                    // let labelStyle = window.getComputedStyle(label);
                    // if (undefined != labelStyle) {
                    //     labelStyle.height
                    // }
                }
            },
            deleteStation(item) {
                this.stationChanged(item);
            },
            onSearch() {
                // 刷新厂站数据列表
                if (this.searchText != this.requestParams.search) {
                    this.requestParams.search = this.searchText;
                    this.$emit("refreshStations", this.requestParams);
                }
            },
            partitionChanged() {
                // 刷新电压等级、及厂站数据列表
                let tabIndex = this.partitionTabIndex;
                let lastTabIndex = (0 == tabIndex) ? 1 : 0;
                this.requestParams.partition = this.partitionArray[tabIndex].type;
                // 刷新对应类型参数
                let subTabIndex = this.currentStations[tabIndex].categoryIndex;
                let lastSubTabIndex = this.currentStations[lastTabIndex].categoryIndex;
                this.lastCategoryIndex = subTabIndex;
                this.requestParams.category = this.categoryArray[subTabIndex].type;
                // 电压等级初始化全部
                // this.currentStations[tabIndex].voltageType = "";
                // this.requestParams.voltage = "";
                this.requestParams.voltage = this.currentStations[tabIndex].voltageType;
                this.resetCacheData(lastTabIndex, lastSubTabIndex);
                this.$emit("refreshVoltageAndStations", this.requestParams);
            },
            categoryChanged() {
                // 刷新电压等级、及厂站数据列表
                let tabIndex = this.partitionTabIndex;
                let subTabIndex = this.currentStations[tabIndex].categoryIndex;
                let lastSubTabIndex = this.lastCategoryIndex;
                this.lastCategoryIndex = subTabIndex;
                this.requestParams.category = this.categoryArray[subTabIndex].type;
                // 电压等级初始化全部
                this.currentStations[tabIndex].voltageType = "";
                this.requestParams.voltage = "";
                this.resetCacheData(tabIndex, lastSubTabIndex);
                this.$emit("refreshVoltageAndStations", this.requestParams);
            },
            voltageChanged(item) {
                // 刷新厂站数据列表
                let tabIndex = this.partitionTabIndex;
                if (item.type != this.currentStations[tabIndex].voltageType) {
                    this.currentStations[tabIndex].voltageType = item.type;
                    this.requestParams.voltage = item.type;
                    this.$emit("refreshStations", this.requestParams);
                }
            },
            stationChanged(item) {
                let tabIndex = this.partitionTabIndex;
                let idLength = this.currentStations[tabIndex].stationIDs.length;
                let subIndex = idLength > 0 ?
                this.currentStations[tabIndex].stationIDs.indexOf(item.ID) : -1;
                if (subIndex >= 0) {
                    this.currentStations[tabIndex].stationIDs.splice(subIndex, 1);
                    this.currentStations[tabIndex].stationsObjs.splice(subIndex, 1);
                }
                else {
                    if (idLength >= 8) {
                        Notify.clear();
                        Notify({type: 'danger', message: '最多选择8个厂站！'});
                        return;
                    }
                    this.currentStations[tabIndex].stationIDs.push(item.ID);
                    this.currentStations[tabIndex].stationsObjs.push(item);
                }
            },
            loadingMoreData() {
                this.$emit("loadingMoreData", this.requestParams);
            },
            cancel() {
                this.$emit("cancel");
            },
            accept() {
                // 选择厂站完成
                let tabIndex = this.partitionTabIndex;
                if (this.currentStations[tabIndex].stationsObjs.length <= 0) {
                    Notify.clear();
                    Notify({type: 'primary', message: '请选择厂站！', duration: 1000});
                    return;
                }
                this.$emit("accept", this.currentStations[tabIndex].stationsObjs);
            }
        }
    }
</script>

<style lang="less">
    @maxVanTagWidth: calc(100vw - 110px);
    @minVanTagWidth: calc(33.33vw - 52px);
    @stationsViewHeight1: calc(100vh - 185px);
    @stationsViewHeight2: calc(100vh - 215px);
    @stationsViewHeight3: calc(100vh - 245px);
    @stationsViewHeight4: calc(100vh - 275px);
    @stationsViewHeight5: calc(100vh - 305px);
    @stationsViewHeight6: calc(100vh - 335px);
    @stationsViewHeight7: calc(100vh - 365px);
    @stationsViewHeight8: calc(100vh - 395px);
    .station-picker {
        width: 100%;
        // height: 100%;
        overflow: hidden;
        .cardTop {
            padding-top: 5px;
        }
        .van-search {
            padding: 5px;
            &__action {
                &:active {
                    background-color: #0687FF;
                }
            }
        }
        &-button {
            color: #fff;
            &:active {
                width: 30px;
                // font-size: 13px;
                background-color: #0687FF;
            }
        }
        .van-tabs__nav--card .van-tab {
            border-right: #0687FF;
        }
        .van-tabs__nav--card {
            width: 65%;
            margin: 0 auto;
            border: solid 1px #0687FF;
            .van-tab {
                color: #0687FF;
            }
        }
        .van-tabs__line {
            background-color: #0687FF;
        }
        .van-tabs__wrap {
            padding-top: 4px;
            .van-tab {
                margin-left: 0px;
            }
        }
        .van-tab {
            background-color: #fff;
            &--active {
                color: #0687FF;
            }
        }
        .van-tabs__nav--card .van-tab.van-tab--active {
            background-color: #0687FF;
            color: #fff;
            margin-left: 0px;
        }
        .van-tabs__nav {
            position: relative;
            display: -webkit-box;
            background-color: #fff;
        }
        .van-hairline {
            &--top-bottom::after {
                border-width: 0px 0px 1px 0px;
                border-color: #0687FF;
            }
        }
        &-label {
            width: 100%;
            padding-top: 10px;
            padding-left: 10px;
            text-align: left;
            line-height: 30px;
            display: inline-block;
            color: #666666;
            &-box {
                position: relative;
                vertical-align: top;
                display: inline-block;
                width: calc(100% - 75px);
                div {
                    height: 20px;
                    line-height: 20px;
                    display: inline-block;
                    padding-left: 10px;
                    font-size: 13px;
                    .van-tag {
                        width: auto!important;
                        width: @minVanTagWidth;
                        min-width: @minVanTagWidth;
                        max-width: @maxVanTagWidth;
                        justify-content: center;
                        color: #0687FF;//666666
                        &--large {
                            // display: block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            // text-align: center;
                        }
                        &__close {
                            // vertical-align: middle;
                        }
                    }
                }
            }
        }
        &-list0 {
            height: @stationsViewHeight1;
        }
        &-list1 {
            height: @stationsViewHeight1;
        }
        &-list2 {
            height: @stationsViewHeight2;
        }
        &-list3 {
            height: @stationsViewHeight3;
        }
        &-list4 {
            height: @stationsViewHeight4;
        }
        &-list5 {
            height: @stationsViewHeight5;
        }
        &-list6 {
            height: @stationsViewHeight6;
        }
        &-list7 {
            height: @stationsViewHeight7;
        }
        &-list8 {
            height: @stationsViewHeight8;
        }
        .bottom {
            width: 100%;
            height: 35px;
            position: absolute;
            bottom: 10px;
            border-top: 1px solid rgb(246, 247, 247);
            align-items: center;
            .van-button {
                width: 44%;
                height: 35px;
                line-height: 35px;
                margin: 0 2%;
            }
        }
    }
</style>
