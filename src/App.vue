<template>
  <div class="station-picker-rzt">
      <div class="style='margin-top:20px'" v-if="false">
          <van-button type="default" @click="showStation=true">显示</van-button>
      </div>
      <!-- <van-popup v-model="showStation" position="right" :style="{ width: '100%',height: '100%'}"> -->
          <stationPage :stationsData="stationsData" @refreshStations="refreshStations"
          @refreshVoltageAndStations="refreshVoltageAndStations"
          @cancel="showStation=false" @accept="confirm"/>
      <!-- </van-popup> -->
  </div>
</template>

<script>
import stationPage from '../src/plugin/station-picker';
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
      this.setTestDatas();
  },
  methods:{
      refreshStations(params) {
          // 刷新厂站数据列表
          console.info("refreshStations: " + JSON.stringify(params));
      },
      refreshVoltageAndStations(params) {
          // 刷新电压等级、厂站数据列表
          console.info("refreshVoltageAndStations: " + JSON.stringify(params));
      },
      confirm(items) {
          // 选择厂站列表
          this.showStation = false;
          console.info("stations: " + JSON.stringify(items));
      },
      setTestDatas() {
          this.stationsData.ownerData.stationArray = [];
          this.stationsData.regionData.stationArray = [];
          for (let i = 0; i < 100; ++i) {
              this.stationsData.ownerData.stationArray.push({
                  NAME: "测试" + (i + 1), ID: "" + (i + 1), OWNER: ""
              });
              this.stationsData.regionData.stationArray.push({
                  NAME: "测试" + (i + 1), ID: "" + (i + 1), OWNER: ""
              });
          }
      }
  }
}
</script>

<style lang="less">
.station-picker-rzt {
}
</style>
