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
                <div :class="selectedIDs.length <= 3 ? 'station-picker-panel-list1' :
                (selectedIDs.length > 6 ? 'station-picker-panel-list3' :
                'station-picker-panel-list2')">
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
                        stationArray: []
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
            }
		},
		watch: {
			stationsData: {
				handler(n, m) {
                    this.resetStationDataArray();
				},
				deep: true
			}
		},
        mounted() {
        },
        methods: {
            resetStationDataArray() {
                this.list = [];
                this.dataIndex = 0;
                this.finished = false;
            },
            voltageChanged(item) {
                this.$emit("voltageChanged", item);
            },
            stationChanged(item) {
                this.$emit("stationChanged", item);
            },
            onLoad() {
                // 异步更新数据
                // setTimeout 仅做示例，真实场景中一般为 ajax 请求
                setTimeout(() => {
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
                        this.finished = true;
                    }
                }, 1000);
            }
        }
    }
</script>

<style lang="less">
    @stationsSubViewHeight1: calc(100vh - 385px);
    @stationsSubViewHeight2: calc(100vh - 415px);
    @stationsSubViewHeight3: calc(100vh - 445px);
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
                    color: #646465;
                    border-radius: 4px;
                    border: 1px solid #CDCDCD;
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
                    border: 1px solid #CDCDCD;
                }
            }
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
    }
</style>
