<template>
  <div class="mapwrap">
    <div id="map"></div>
    <div class="button-group">
      <button @click="emptyMarkers">마커 지우기</button>
      <button @click="displayInfoWindow">infowindow</button>
    </div>
    <b-form-select
      @change="setCurrentGu"
      v-model="currentGu"
      :options="options"
    ></b-form-select>
    <div class="hAddr">
      <button @click="getCurrentGu">현재 구 불러오기</button>
      <span id="centerAddr">{{ currentGu }}</span>
    </div>
    <div class="popuparea">
      <button class="listclose" @click="toggleGuSelected" v-show="!guSelected">
        >
      </button>
      <house-list
        v-show="guSelected"
        @isGuSelected="isGuSelected"
        class="popup"
      ></house-list>
      <house-detail v-if="house" class="popup"></house-detail>
    </div>
  </div>
</template>
<script>
//import axios from "axios";
import http from "@/api/http";
import HouseDetail from "@/components/house/HouseDetail.vue";
import HouseList from "@/components/house/HouseList.vue";
import { mapMutations } from "vuex";
import { mapState } from "vuex";
//import { mapGetters } from "vuex";
export default {
  name: "HouseMap",
  components: {
    HouseDetail,
    HouseList,
  },
  data() {
    return {
      currentGu: null,
      currentDong: null,
      aptListCenter: null,
      guList: [],
      options: [],
      markers: [],
      aptSelected: false,
      guSelected: false,
      infowindow: null,
      geocoder: null,
      map: null,
    };
  },
  computed: {
    ...mapState("houseStore", ["house", "houselist", "center"]),
  },
  methods: {
    isGuSelected() {
      this.guSelected = false;
    },
    toggleGuSelected() {
      this.guSelected = !this.guSelected;
    },
    ...mapMutations("houseStore", [
      "SET_DETAIL_HOUSE",
      "SET_HOUSE_DEALS",
      "SET_HOUSE_LIST",
    ]),
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.5666805, 126.9784147),
        level: 4,
      };

      this.map = new kakao.maps.Map(container, options);
      this.geocoder = new kakao.maps.services.Geocoder();
      //빈곳 클릭시 팝업 제거
      // kakao.maps.event.addListener(this.map, "idle", () => {
      //   this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo);
      // });
    },
    async getPositions() {
      let gu; //현재 구 코드
      if (this.currentGu != null) {
        this.guList.forEach((data) => {
          if (data.gugunName == this.currentGu) {
            gu = data.gugunCode;
          }
        });
        console.log("currentgu: " + gu);

        await http
          .get(`/map/guApt`, {
            params: {
              gu: gu,
            },
          })
          .then(({ data }) => {
            this.houselist = data;

            console.log(this.houselist);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      await this.getHouseList(gu);
      this.getAptListCenter();
      this.aptListToMarkers();
    },
    async setCurrentGu() {
      console.log("setcurrentGu");
      this.guSelected = true;
      this.getPositions();
    },
    async getCurrentGu() {
      this.guSelected = true;
      await this.searchAddrFromCoords(
        this.map.getCenter(),
        this.displayCenterInfo,
      );
    },
    getAptListCenter() {
      let maxLng = 0;
      let minLng = 180;
      let maxLat = 0;
      let minLat = 180;
      this.houselist.forEach((apt) => {
        if (maxLat < apt.lat) maxLat = apt.lat;

        if (minLat > apt.lat) minLat = apt.lat;
        if (maxLng < apt.lng) maxLng = apt.lng;
        if (minLng > apt.lng) minLng = apt.lng;
      });
      this.aptListCenter = {
        lngCenter: (parseFloat(maxLng) + parseFloat(minLng)) / 2,
        latCenter: (parseFloat(maxLat) + parseFloat(minLat)) / 2,
      };
      this.panTo();
      //지도 범위조정
      /* let sw = new kakao.maps.LatLng(minLat, minLng),
        ne = new kakao.maps.LatLng(maxLat, maxLng);
      console.log(sw);
      let bounds = kakao.maps.LatLngBounds(sw, ne);
      this.map.setBounds(bounds);*/
    },
    panTo() {
      console.log(this.aptListCenter.lngCenter);
      // 이동할 위도 경도 위치를 생성합니다
      var moveLatLon = new kakao.maps.LatLng(
        this.aptListCenter.latCenter,
        this.aptListCenter.lngCenter,
      );

      // 지도 중심을 부드럽게 이동시킵니다
      // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
      this.map.panTo(moveLatLon);
    },
    async searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      await this.geocoder.coord2RegionCode(
        coords.getLng(),
        coords.getLat(),
        callback,
      );
    },
    emptyMarkers() {
      //마커 초기화
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }
    },
    aptListToMarkers() {
      //aptList로 마커 생성하는 함수

      this.emptyMarkers();
      //this aptList 에 있는 아파트 정보로 마커 생성
      for (let i = 0; i < this.houselist.length; i++) {
        let marker = new kakao.maps.Marker({
          map: this.map,
          position: new kakao.maps.LatLng(
            this.houselist[i].lat,
            this.houselist[i].lng,
          ),
          title: this.houselist[i].aptCode,
        });
        kakao.maps.event.addListener(marker, "click", () => {
          //클릭이벤트 추가
          this.aptSelected = true;
          //console.log(marker);
          this.getHouseInfo(marker.getTitle());
          this.getHouseDeals(marker.getTitle());
          //console.log(this.housedeals);
        });
        //마커 넣기
        this.markers.push(marker);
      }
    },
    displayCenterInfo(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        //var infoDiv = document.getElementById("centerAddr");

        // for (var i = 0; i < result.length; i++) {
        // 행정동의 region_type 값은 'H' 이므로
        // if (result[i].region_type === "H") {
        //   infoDiv.innerHTML = result[i].address_name;
        //   break;
        // }

        //}
        //console.log(result);
        //infoDiv.innerHTML = result[0].region_2depth_name;
        this.currentGu = result[0].region_2depth_name;
        this.currentDong = result[0].region_3depth_name;
        this.getPositions();
      }
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition());
        return;
      }
      let lng = this.house.lng;
      let lat = this.house.lat;
      var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(lat, lng), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      this.map.setCenter(iwPosition);
    },
    async getHouseList(guCode) {
      console.log("gethouselist :" + guCode);
      await http
        .get(`/map/guApt`, {
          params: {
            gu: guCode,
          },
        })
        .then(({ data }) => {
          this.SET_HOUSE_LIST(data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getHouseInfo(aptCode) {
      await http
        .get(`/map/aptDetail`, {
          params: {
            aptCode: aptCode,
          },
        })
        .then(({ data }) => {
          this.SET_DETAIL_HOUSE(data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getHouseDeals(aptCode) {
      http
        .get(`/map/aptDeals`, {
          params: {
            aptCode: aptCode,
          },
        })
        .then(({ data }) => {
          this.SET_HOUSE_DEALS(data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {},
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      console.log(process.env.VUE_APP_MAP_KEY);
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_MAP_KEY}&libraries=services`;
      document.head.appendChild(script);
    }
  },
  created() {
    this.SET_HOUSE_LIST([]);
    this.SET_DETAIL_HOUSE(null);
    http
      .get(`/map/gugun`, {
        params: {
          sido: "11",
        },
      })
      .then(({ data }) => {
        this.guList = data;
        for (let i = 0; i < data.length; i++) {
          this.options.push(new Object());
          this.options[i].value = data[i].gugunName;
          this.options[i].text = data[i].gugunName;
        }
        console.log(this.guList);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
.listclose {
  background-color: rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1;
}

.popuparea {
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
}
.popup {
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  width: 300px;
  height: 100%;
  position: relative;
}
.mapwrap {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
