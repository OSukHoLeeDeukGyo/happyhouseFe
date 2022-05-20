<template>
  <b-container class="bv-example-row">
    <div id="map"></div>
    <div class="button-group">
      <button @click="changeSize(0)">Hide</button>
      <button @click="changeSize(400)">show</button>
      <button @click="displayMarker(markerPositions1)">marker set 1</button>
      <button @click="displayMarker(markerPositions2)">marker set 2</button>
      <button @click="displayMarker([])">marker set 3 (empty)</button>
      <button @click="displayInfoWindow">infowindow</button>
    </div>
    <b-form-select v-model="currentGu" :options="options"></b-form-select>
    <div class="hAddr">
      <button @click="getCurrentGu">현재 구 불러오기</button>
      <span id="centerAddr">{{ currentGu }}</span>
    </div>
  </b-container>
</template>
<script>
import axios from "axios";
import http from "@/api/http";
export default {
  name: "HouseMap",
  components: {},
  data() {
    return {
      aptList: [],
      currentGu: null,
      guList: [],
      options: [],
      markerPositions1: [
        [33.452278, 126.567803],
        [33.452671, 126.574792],
        [33.451744, 126.572441],
      ],
      markerPositions2: [
        [37.499590490909185, 127.0263723554437],
        [37.499427948430814, 127.02794423197847],
        [37.498553760499505, 127.02882598822454],
        [37.497625593121384, 127.02935713582038],
        [37.49629291770947, 127.02587362608637],
        [37.49754540521486, 127.02546694890695],
        [37.49646391248451, 127.02675574250912],
      ],
      markerPositions: [],
      markers: [],
      infowindow: null,
      geocoder: null,
      map: null,
    };
  },
  computed: {
    // houses() {
    //   return this.$store.state.houses;
    // },
  },
  methods: {
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
    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },
    getPositions() {
      //현재 구의 아파트
      const SERVICE_KEY = process.env.VUE_APP_SERVICE_KEY;
      // const SERVICE_KEY =
      //   "9Xo0vlglWcOBGUDxH8PPbuKnlBwbWU6aO7%2Bk3FV4baF9GXok1yxIEF%2BIwr2%2B%2F%2F4oVLT8bekKU%2Bk9ztkJO0wsBw%3D%3D";
      const SERVICE_URL =
        "http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade";

      let gu;
      console.log("currentgu: " + this.currentGu);

      this.guList.forEach((data) => {
        if (data.gugunName == this.currentGu) {
          gu = data.gugunCode;
        }
      });
      console.log("gucode : " + gu);
      const params = {
        LAWD_CD: gu,
        DEAL_YMD: "201512",
        serviceKey: decodeURIComponent(SERVICE_KEY),
      };

      axios
        .get(SERVICE_URL, {
          params,
        })
        .then((response) => {
          console.log(response.data.response.body.items.item);
          this.aptList = response.data.response.body.items.item;
          this.aptlisttocoord();
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    displayMarker(markerPositions) {
      //마커 없애기
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position),
      );

      if (positions.length > 0) {
        this.markers = positions.map((position) => {
          const marker = new kakao.maps.Marker({
            map: this.map,
            position,
            //clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
          });
          kakao.maps.event.addListener(marker, "click", function () {
            //클릭이벤트
            console.log("clicked");
            //this.infowindow.open(this.map, this.marker);
          });
        });

        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds(),
        );

        this.map.setBounds(bounds);
      }
    },
    async getCurrentGu() {
      await this.searchAddrFromCoords(
        this.map.getCenter(),
        this.displayCenterInfo,
      );
      console.log(this.markerPositions);
      this.displayMarker(this.markerPositions);
    },
    async searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      await this.geocoder.coord2RegionCode(
        coords.getLng(),
        coords.getLat(),
        callback,
      );
    },
    aptlisttocoord() {
      for (let i = 0; i < this.aptList.length; i++) {
        let dong = this.aptList[i]["법정동"];
        let jibun = this.aptList[i]["지번"];
        //주소로 좌표얻기
        this.geocoder.addressSearch(`${dong} ${jibun}`, (result, status) => {
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK) {
            this.markerPositions.push([result[0].y, result[0].x]);
            // var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            // // 결과값으로 받은 위치를 마커로 표시합니다
            // var marker = new kakao.maps.Marker({
            //   map: this.map,
            //   position: coords,
            // });
          }
        });
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
    // const SERVICE_KEY = process.env.VUE_APP_SERVICE_KEY;
    // const SERVICE_URL =
    //   "http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade";
    // const params = {
    //   LAWD_CD: 11110,
    //   DEAL_YMD: "201512",
    //   serviceKey: decodeURIComponent(SERVICE_KEY),
    // };

    // axios
    //   .get(SERVICE_URL, {
    //     params,
    //   })
    //   .then((response) => {
    //     console.log(response.data.response.body.items.item);
    //     //this.aptList = response.data.response.body.items.item;
    //   })
    //   .catch((error) => {
    //     console.dir(error);
    //   });

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
