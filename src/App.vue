<template>
  <div class="station-picker-rzt">
      <div class="style='margin-top:20px'">
          <van-button type="default" @click="showStation=true">显示</van-button>
      </div>
      <van-popup v-model="showStation" position="right" :style="{ width: '100%',height: '100%'}">
          <stationPage :stationsData="stationsData" @refreshStations="refreshStations"
          @refreshVoltageAndStations="refreshVoltageAndStations"
          @cancel="showStation=false" @accept="confirm"/>
      </van-popup>
  </div>
</template>

<script>
import stationPage from './plugin/station-picker';
export default {
  name: 'app',
  data () {
    return {
        showStation: false,
        stationsData: {
            regionData: {
                voltageArray: [
                    {name: "全部", type: ""},
                    {name: "1000kV", type: "1000"},
                    {name: "500kV", type: "500"},
                    {name: "220kV", type: "220"},
                    {name: "110kV", type: "110"},
                    {name: "35kV", type: "35"}
                ],
                stationArray: []
            },
            ownerData: {
                voltageArray: [
                    {name: "全部", type: ""}
                ],
                stationArray: []
            }
        }
    }
  },
  components: {
      stationPage,
  },
  created() {
  },
  mounted() {
  },
  methods:{
      refreshStations(params) {
          // 刷新厂站数据列表
          this.refreshStationDatas(params);
          console.info("refreshStations: " + JSON.stringify(params));
      },
      refreshVoltageAndStations(params) {
          // 刷新电压等级、厂站数据列表
          this.refreshVoltageDatas(params);
          this.refreshStationDatas(params);
          console.info("refreshVoltageAndStations: " + JSON.stringify(params));
      },
      confirm(items) {
          // 选择厂站列表
          this.showStation = false;
          console.info("stations: " + JSON.stringify(items));
      },
      refreshVoltageDatas(params) {
          // 行政区域
          if ("region" == params.partition) {
              // params.category: substation -- 变电站
              //                  plant -- 电厂
              //                  yhb -- 用户变
              //                  hlz -- 换流站
              this.stationsData.regionData.voltageArray = [];
              // 通过接口获取电压等级数据
              this.stationsData.regionData.voltageArray = [
                  {name: "全部", type: ""},
                  {name: "1000kV", type: "1000"},
                  {name: "500kV", type: "500"},
                  {name: "220kV", type: "220"},
                  {name: "110kV", type: "110"},
                  {name: "35kV", type: "35"}
              ];
          }
          // 电网
          else if ("owner" == params.partition) {
              // 清空电压等级数据
              this.stationsData.ownerData.voltageArray = [];
              // 通过接口获取电压等级数据
              this.stationsData.ownerData.voltageArray = [
                  {name: "全部", type: ""},
                  {name: "1000kV", type: "1000"},
                  {name: "500kV", type: "500"},
                  {name: "220kV", type: "220"},
                  {name: "110kV", type: "110"},
                  {name: "35kV", type: "35"}
              ];
          }
      },
      refreshStationDatas(params) {
          if ("region" == params.partition) {
              // 清空厂站数据列表
              this.stationsData.regionData.stationArray = [];
              // 通过接口获取厂站列表数据
              for (let i = 0; i < 100; ++i) {
                  this.stationsData.regionData.stationArray.push({
                      NAME: "测试" + (i + 1), ID: "" + (i + 1), OWNER: ""
                  });
              }
          }
          else if ("owner" == params.partition) {
              // 清空厂站数据列表
              this.stationsData.ownerData.stationArray = [];
              // 通过接口获取厂站列表数据
              for (let i = 0; i < 100; ++i) {
                  this.stationsData.ownerData.stationArray.push({
                      NAME: "测试" + (i + 1), ID: "" + (i + 1), OWNER: ""
                  });
              }
          }
      }
  }
}
</script>

<style lang="less">
.station-picker-rzt {
}
</style>
