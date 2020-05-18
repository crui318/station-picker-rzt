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
                <div :class="`station-picker-panel-list${listStyleIndex}`" ref="scrollListView">
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
                        moreData: false
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
        created() {
        },
        mounted() {
        },
        methods: {
            resetStationDataArray() {
                if (!this.loading) {
                    this.list = [];
                    this.dataIndex = 0;
                    this.finished = false;
                    if (undefined != this.$refs.scrollListView &&
                        undefined != this.$refs.scrollListView.scrollTop) {
                        this.$refs.scrollListView.scrollTop = 0;
                    }
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
                let tmpI = minI + 32;
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
                    else {
                        this.loading = true;
                        this.$emit("loadingMoreData");
                    }
                }
            }
        }
    }
</script>

<style lang="less">
    @stationsSubViewHeight1: calc(100vh - 390px);
    @stationsSubViewHeight2: calc(100vh - 420px);
    @stationsSubViewHeight3: calc(100vh - 450px);
    @stationsSubViewHeight4: calc(100vh - 480px);
    @stationsSubViewHeight5: calc(100vh - 510px);
    @stationsSubViewHeight6: calc(100vh - 540px);
    @stationsSubViewHeight7: calc(100vh - 570px);
    @stationsSubViewHeight8: calc(100vh - 600px);
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
        &-list0 {
            height: @stationsSubViewHeight1;
            overflow-y: auto;
        }
        &-list1 {
            height: @stationsSubViewHeight1;
            overflow-y: auto;
        }
        &-list2 {
            height: @stationsSubViewHeight2;
            overflow-y: auto;
        }
        &-list3 {
            height: @stationsSubViewHeight3;
            overflow-y: auto;
        }
        &-list4 {
            height: @stationsSubViewHeight4;
            overflow-y: auto;
        }
        &-list5 {
            height: @stationsSubViewHeight5;
            overflow-y: auto;
        }
        &-list6 {
            height: @stationsSubViewHeight6;
            overflow-y: auto;
        }
        &-list7 {
            height: @stationsSubViewHeight7;
            overflow-y: auto;
        }
        &-list8 {
            height: @stationsSubViewHeight8;
            overflow-y: auto;
        }
    }
</style>
