<template>
    <div class="station-picker-panel">
        <ul>
            <li>
                <label>电压等级</label>
                <span v-for="(item,index) in stationsData.voltageArray"
                      :key="index"
                      @click="voltageChanged(item)"
                      :class="item.type==voltageType?'active':''">
                      {{item.name}}</span>
            </li>
            <li>
                <label>{{categoryName}}列表</label>
                <div :class="`station-picker-panel-list${voltageRow}${listStyleIndex}`" ref="scrollListView">
                    <van-list v-model="loading" :finished="finished"
                    finished-text="没有更多数据了" @load="onLoad">
                        <span v-for="(item,index) in list" :key="index"
                              @click="stationChanged(item)"
                              :class="selectedIDs.indexOf(item.ID)>=0?'active':''">
                              {{item.NAME}}</span>
                    </van-list>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "station-picker-panel",
        data() {
            return {
                list: [],
                loading: false,
                finished: false,
                dataIndex: 0
            };
        },
		props: {
			stationsData: {
				type: Object,
				default: () => {
					return {
                        voltageArray: [
                            {name: "全部", type: ""}
                        ],
                        stationArray: [],
                        moreData: true
                    };
				}
			},
            categoryName: {
                type: String,
                default: function () {
                    return "变电站";
                }
            },
            voltageType: {
                type: String,
                default: function () {
                    return "";
                }
            },
            selectedIDs: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            listStyleIndex: {
                type: Number,
                default: function () {
                    return 0;
                }
            }
		},
		watch: {
			stationsData: {
				handler(n, m) {
                    this.resetStationDataArray();
				},
                immediate: true,
				deep: true
			}
		},
        computed: {
            voltageRow: function() {
                let length = this.stationsData.voltageArray.length;
                let row = length > 0 ? Math.floor((length - 1) / 4) : 0;
                return row + 1;
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            resetStationDataArray() {
                if (undefined != this.$refs.scrollListView &&
                    undefined != this.$refs.scrollListView.scrollTop) {
                    this.$refs.scrollListView.scrollTop = 0;
                }
                if (!this.loading || this.stationsData.stationArray.length <= 0) {
                    this.list = [];
                    this.dataIndex = 0;
                    this.finished = false;
                }
                this.onLoad();
            },
            voltageChanged(item) {
                this.$emit("voltageChanged", item);
            },
            stationChanged(item) {
                this.$emit("stationChanged", item);
            },
            onLoad() {
                // 更新数据
                let minI = this.dataIndex;
                let tmpI = minI + 40;
                let maxL = this.stationsData.stationArray.length;
                let maxI = tmpI < maxL ? tmpI : maxL;
                for (let i = minI; i < maxI; ++i) {
                    this.list.push(this.stationsData.stationArray[i]);
                }
                // 加载状态结束
                this.loading = false;
                this.dataIndex = maxI;
                // 数据全部加载完成
                if (this.list.length >= maxL) {
                    if (!this.stationsData.moreData) {
                        this.finished = true;
                    }
                    else if (maxL > 0) {
                        this.loading = true;
                        this.$emit("loadingMoreData");
                    }
                }
            }
        }
    }
</script>

<style lang="less">
    @stationsSubViewHeight11: calc(100vh - 350px);
    @stationsSubViewHeight12: calc(100vh - 380px);
    @stationsSubViewHeight13: calc(100vh - 410px);
    @stationsSubViewHeight14: calc(100vh - 440px);
    @stationsSubViewHeight15: calc(100vh - 470px);
    @stationsSubViewHeight16: calc(100vh - 500px);
    @stationsSubViewHeight17: calc(100vh - 530px);
    @stationsSubViewHeight18: calc(100vh - 560px);
    @stationsSubViewHeight21: calc(100vh - 390px);
    @stationsSubViewHeight22: calc(100vh - 420px);
    @stationsSubViewHeight23: calc(100vh - 450px);
    @stationsSubViewHeight24: calc(100vh - 480px);
    @stationsSubViewHeight25: calc(100vh - 510px);
    @stationsSubViewHeight26: calc(100vh - 540px);
    @stationsSubViewHeight27: calc(100vh - 570px);
    @stationsSubViewHeight28: calc(100vh - 600px);
    @stationsSubViewHeight31: calc(100vh - 430px);
    @stationsSubViewHeight32: calc(100vh - 460px);
    @stationsSubViewHeight33: calc(100vh - 490px);
    @stationsSubViewHeight34: calc(100vh - 520px);
    @stationsSubViewHeight35: calc(100vh - 550px);
    @stationsSubViewHeight36: calc(100vh - 580px);
    @stationsSubViewHeight37: calc(100vh - 610px);
    @stationsSubViewHeight38: calc(100vh - 640px);
    .station-picker-panel {
        ul {
            width: 100%;
            padding-top: 5px;
            li {
                display: block;
                text-align: left;
                color: #666666;
                &:last-child {
                    margin-top: -10px;
                }
                label {
                    display: block;
                    text-align: left;
                    padding: 10px 10px;
                }
                span {
                    width: calc(25% - 17px);
                    line-height: 30px;
                    display: inline-block;
                    text-align: center;
                    margin: 0 0 10px 12px;
                    color: #0b0f12;//#646465;
                    border-radius: 3px;
                    border: 1px solid #d8dde0;//#CDCDCD;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    &:nth-of-type(4n+1) {
                        // 第一列
                    }
                }
                span.active {
                    color: #0687FF;
                    background-color: #E9F6FD;
                    border: 1px solid #2e86ff;//#CDCDCD;
                }
            }
        }
        &-list10 {
            height: @stationsSubViewHeight11;
            overflow-y: auto;
        }
        &-list11 {
            height: @stationsSubViewHeight11;
            overflow-y: auto;
        }
        &-list12 {
            height: @stationsSubViewHeight12;
            overflow-y: auto;
        }
        &-list13 {
            height: @stationsSubViewHeight13;
            overflow-y: auto;
        }
        &-list14 {
            height: @stationsSubViewHeight14;
            overflow-y: auto;
        }
        &-list15 {
            height: @stationsSubViewHeight15;
            overflow-y: auto;
        }
        &-list16 {
            height: @stationsSubViewHeight16;
            overflow-y: auto;
        }
        &-list17 {
            height: @stationsSubViewHeight17;
            overflow-y: auto;
        }
        &-list18 {
            height: @stationsSubViewHeight18;
            overflow-y: auto;
        }
        &-list20 {
            height: @stationsSubViewHeight21;
            overflow-y: auto;
        }
        &-list21 {
            height: @stationsSubViewHeight21;
            overflow-y: auto;
        }
        &-list22 {
            height: @stationsSubViewHeight22;
            overflow-y: auto;
        }
        &-list23 {
            height: @stationsSubViewHeight23;
            overflow-y: auto;
        }
        &-list24 {
            height: @stationsSubViewHeight24;
            overflow-y: auto;
        }
        &-list25 {
            height: @stationsSubViewHeight25;
            overflow-y: auto;
        }
        &-list26 {
            height: @stationsSubViewHeight26;
            overflow-y: auto;
        }
        &-list27 {
            height: @stationsSubViewHeight27;
            overflow-y: auto;
        }
        &-list28 {
            height: @stationsSubViewHeight28;
            overflow-y: auto;
        }
        &-list30 {
            height: @stationsSubViewHeight31;
            overflow-y: auto;
        }
        &-list31 {
            height: @stationsSubViewHeight31;
            overflow-y: auto;
        }
        &-list32 {
            height: @stationsSubViewHeight32;
            overflow-y: auto;
        }
        &-list33 {
            height: @stationsSubViewHeight33;
            overflow-y: auto;
        }
        &-list34 {
            height: @stationsSubViewHeight34;
            overflow-y: auto;
        }
        &-list35 {
            height: @stationsSubViewHeight35;
            overflow-y: auto;
        }
        &-list36 {
            height: @stationsSubViewHeight36;
            overflow-y: auto;
        }
        &-list37 {
            height: @stationsSubViewHeight37;
            overflow-y: auto;
        }
        &-list38 {
            height: @stationsSubViewHeight38;
            overflow-y: auto;
        }
    }
</style>
