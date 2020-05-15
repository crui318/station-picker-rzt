<template>
    <div class="station-picker">
        <van-search v-model="searchText" background="#0687FF" placeholder="请输入厂站名/拼音或首字母查询" show-action @search="onSearch">
            <div class="station-picker-button" slot="action" @click="onSearch">搜索</div>
        </van-search>
        <van-tabs class="cardTop" type="card" v-model='partitionTabIndex' @change="partitionChanged">
            <van-tab v-for="(partition,partitionIndex) in partitionArray" :key="partitionIndex" :title="partition.name">
                <div class="station-picker-label">
                    <label>{{currentStations[partitionIndex].stationsObjs.length > 0 ? "已选择" : "请选择"}}：</label>
                    <div class="station-picker-label-box">
                        <div v-for="(station,stationIndex) in currentStations[partitionIndex].stationsObjs" :key="stationIndex">
                            <van-tag plain closeable type="primary" size="large"
                            @close="deleteStation(station)">{{station.NAME}}</van-tag>
                        </div>
                    </div>
                </div>
                <van-tabs :class="currentStations[partitionIndex].stationsObjs.length <= 3 ?
                'station-picker-list1' : (currentStations[partitionIndex].stationsObjs.length > 6 ?
                    'station-picker-list3' : 'station-picker-list2')"
                    v-model='currentStations[partitionIndex].categoryIndex' @change="categoryChanged">
                    <van-tab v-for="(category,categoryIndex) in categoryArray" :key="categoryIndex" :title='category.name'>
                        <stationPicker ref="areaStationPicker"
                        :selectedIDs="currentStations[partitionIndex].stationIDs"
                        :categoryName="categoryArray[currentStations[partitionIndex].categoryIndex].name"
                        :voltageType="currentStations[partitionIndex].voltageType"
                        :stationsData="0 == partitionIndex ? stationsData.regionData : stationsData.ownerData"
                        @voltageChanged="voltageChanged"
                        @stationChanged="stationChanged"/>
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
                initFlag: false,
                searchText: "",
                partitionTabIndex: 0,
                partitionArray: [
                    {name: "行政区域", type: "region"},
                    {name: "电网", type: "owner"}
                ],
                categoryArray: [
                    {name: "变电站", type: "substation"},
                    {name: "电厂", type: "plant"},
                    {name: "用户变", type: "yhb"},
                    {name: "换流站", type: "hlz"}
                ],
                currentStations: [
                    {
                        categoryIndex: 0,
                        voltageType: "",
                        stationIDs: [],
                        stationsObjs: []
                    },
                    {
                        categoryIndex: 0,
                        voltageType: "",
                        stationIDs: [],
                        stationsObjs: []
                    }
                ],
                requestParams: {
                    search: "",
                    partition: "region",
                    category: "substation",
                    voltage: ""
                }
            };
        },
		props: {
			stationsData: {
				type: Object,
				default: () => {
					return {
                        regionData: {
                            voltageArray: [
                                {name: "全部", type: ""}
                            ],
                            stationArray: []
                        },
                        ownerData: {
                            voltageArray: [
                                {name: "全部", type: ""}
                            ],
                            stationArray: []
                        }
                    };
                }
            }
        },
        mounted() {
            this.$emit("refreshVoltageAndStations", this.requestParams);
        },
        methods: {
            deleteStation(item) {
                this.stationChanged(item);
            },
            onSearch() {
                // 刷新厂站数据列表
                if (this.searchText != this.requestParams.search) {
                    this.initFlag = false;
                    this.requestParams.search = this.searchText;
                    this.$emit("refreshStations", this.requestParams);
                }
            },
            partitionChanged() {
                // 刷新电压等级、及厂站数据列表
                let tabIndex = this.partitionTabIndex;
                this.requestParams.partition = this.partitionArray[tabIndex].type;
                // 刷新对应类型参数
                let subTabIndex = this.currentStations[tabIndex].categoryIndex;
                this.requestParams.category = this.categoryArray[subTabIndex].type;
                // 电压等级初始化全部
                // this.currentStations[tabIndex].voltageType = "";
                // this.requestParams.voltage = "";
                this.requestParams.voltage = this.currentStations[tabIndex].voltageType;
                if (!this.initFlag) {
                    this.initFlag = true;
                    this.$emit("refreshVoltageAndStations", this.requestParams);
                }
            },
            categoryChanged() {
                // 刷新电压等级、及厂站数据列表
                let tabIndex = this.partitionTabIndex;
                let subTabIndex = this.currentStations[tabIndex].categoryIndex;
                this.requestParams.category = this.categoryArray[subTabIndex].type;
                // 电压等级初始化全部
                this.currentStations[tabIndex].voltageType = "";
                this.requestParams.voltage = "";
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
                        Notify({type: 'danger', message: '最多选择8个厂站！'});
                        return;
                    }
                    this.currentStations[tabIndex].stationIDs.push(item.ID);
                    this.currentStations[tabIndex].stationsObjs.push(item);
                }
            },
            cancel() {
                this.$emit("cancel");
            },
            accept() {
                // 选择厂站完成
                let tabIndex = this.partitionTabIndex;
                if (this.currentStations[tabIndex].stationsObjs.length <= 0) {
                    Notify({type: 'primary', message: '请选择厂站！', duration: 1000});
                    return;
                }
                this.$emit("accept", this.currentStations[tabIndex].stationsObjs);
            }
        }
    }
</script>

<style lang="less">
    @maxVanTagWidth: calc(33.33vw - 52px);
    @stationsViewHeight1: calc(100vh - 185px);
    @stationsViewHeight2: calc(100vh - 215px);
    @stationsViewHeight3: calc(100vh - 245px);
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
                        width: @maxVanTagWidth;
                        min-width: @maxVanTagWidth;
                        justify-content:center;
                        color: #0687FF;//666666
                        &--large {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
        }
        &-list1 {
            height: @stationsViewHeight1;
            // overflow-y: auto;
        }
        &-list2 {
            height: @stationsViewHeight2;
            // overflow-y: auto;
        }
        &-list3 {
            height: @stationsViewHeight3;
            // overflow-y: auto;
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
