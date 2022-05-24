<template>
  <b-container class="bv-example-row">
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

    <house-detail
      v-if="aptSelected"
      :currentApt="currentApt"
      @isAptSelected="isAptSelected"
    ></house-detail>
  </b-container>
</template>
<script>
//import axios from "axios";
import http from "@/api/http";
import HouseDetail from "@/components/house/HouseDetail.vue";
import { mapActions, mapMutations } from "vuex";
import { mapState } from "vuex";
export default {
  name: "HouseMap",
  components: {
    HouseDetail,
  },
  data() {
    return {
      aptList: [],
      currentGu: null,
      currentDong: null,
      aptListCenter: null,
      guList: [],
      options: [],
      markers: [],
      aptSelected: false,
      currentApt: null,
      infowindow: null,
      geocoder: null,
      map: null,
    };
  },
  computed: {
    ...mapState("houseStore", ["house", "housedeals"]),
    //...mapMutations(["SET_DETAIL_HOUSE"]),
    // houses() {
    //   return this.$store.state.houses;
    // },
  },
  methods: {
    isAptSelected() {
      this.aptSelected = false;
    },
    ...mapActions("houseStore", ["detailHouse", "houseDeals"]),
    ...mapMutations("houseStore", ["SET_DETAIL_HOUSE", "SET_HOUSE_DEALS"]),
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.5666805, 126.9784147),
        level: 4,
      };

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);
      this.geocoder = new kakao.maps.services.Geocoder();
      // kakao.maps.event.addListener(this.map, "idle", () => {
      //   this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo);
      // });
    },
    async getPositions() {
      //현재 구의 아파트
      /*const SERVICE_KEY = process.env.VUE_APP_SERVICE_KEY;
      const SERVICE_URL =
        "http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade";

      const params = {
        LAWD_CD: gu,
        DEAL_YMD: "201512",
        serviceKey: decodeURIComponent(SERVICE_KEY),
      };

      await axios
        .get(SERVICE_URL, {
          params,
        })
        .then((response) => {
          console.log(response.data.response.body.items.item);
          this.aptList = response.data.response.body.items.item;
          this.aptListToMarkers();
        })
        .catch((error) => {
          console.dir(error);
        });*/
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
            this.aptList = data;

            console.log(this.aptList);
          })
          .catch((error) => {
            console.log(error);
          });
        this.getAptListCenter();
        this.aptListToMarkers();
      }
    },
    async setCurrentGu() {
      this.getPositions();
    },
    async getCurrentGu() {
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
      this.aptList.forEach((apt) => {
        if (maxLat < apt.lat) maxLat = apt.lat;

        if (minLat > apt.lat) minLat = apt.lat;
        if (maxLng < apt.lng) maxLng = apt.lng;
        if (minLng > apt.lng) minLng = apt.lng;
      });
      //console.log(maxLng, minLng);
      //console.log(maxLat, minLat);
      this.aptListCenter = {
        lngCenter: (parseFloat(maxLng) + parseFloat(minLng)) / 2,
        latCenter: (parseFloat(maxLat) + parseFloat(minLat)) / 2,
      };
      this.panTo();
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
      for (let i = 0; i < this.aptList.length; i++) {
        let marker = new kakao.maps.Marker({
          map: this.map,
          position: new kakao.maps.LatLng(
            this.aptList[i].lat,
            this.aptList[i].lng,
          ),
          title: this.aptList[i].aptCode,
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

        /*
        //주소로 좌표얻기
        this.geocoder.addressSearch(`${dong} ${jibun}`, (result, status) => {
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK) {
            //마커 객체 생성
            let marker = new kakao.maps.Marker({
              map: this.map,
              position: new kakao.maps.LatLng(result[0].y, result[0].x),
              title: this.aptList[i]["아파트"],
            });
            kakao.maps.event.addListener(marker, "click", function () {
              //클릭이벤트
              console.log(marker.getTitle());
            });
            //마커 넣기
            this.markers.push(marker);
          }
        });*/
      }

      //happyhouse db사용시 aptList에 lng lat 정보까지 포함
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

      var iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      this.map.setCenter(iwPosition);
    },
    getHouseInfo(aptCode) {
      http
        .get(`/map/aptDetail`, {
          params: {
            aptCode: aptCode,
          },
        })
        .then(({ data }) => {
          //console.log(data);
          //this.detailHouse(data);
          this.SET_DETAIL_HOUSE(data);
          // console.log(commit, response);
          //commit("SET_GUGUN_LIST", data);
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
          //console.log(data);
          //this.houseDeals = data;

          //this.options.value = data.gugunName;
          //console.log(this.aptDeals);

          //console.log(data);
          //commit("SET_GUGUN_LIST", data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
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
    http
      .get(`/map/gugun`, {
        params: {
          sido: "11",
        },
      })
      .then(({ data }) => {
        //console.log(data);
        this.guList = data;
        for (let i = 0; i < data.length; i++) {
          this.options.push(new Object());
          this.options[i].value = data[i].gugunName;
          this.options[i].text = data[i].gugunName;
        }
        //this.options.value = data.gugunName;
        console.log(this.guList);

        // console.log(commit, response);
        //commit("SET_GUGUN_LIST", data);
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
  height: 600px;
}
</style>
