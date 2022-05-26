<template>
  <div class="mapwrap">
    <div id="map"></div>
    <div class="gu-select">
      <b-form-select
        @change="setCurrentGu"
        v-model="currentGu"
        :options="options"
      ></b-form-select>

      <b-button size="sm" variant="primary" @click="getCurrentGu">
        현재 위치 </b-button
      ><b-button size="sm" @click="emptyMarkers">마커 지우기</b-button>
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

    <ul id="category">
      <li id="BK9" data-order="0">
        <span class="category_bg bank"></span>
        은행
      </li>
      <li id="MT1" data-order="1">
        <span class="category_bg mart"></span>
        마트
      </li>
      <li id="PM9" data-order="2">
        <span class="category_bg pharmacy"></span>
        약국
      </li>
      <li id="OL7" data-order="3">
        <span class="category_bg oil"></span>
        주유소
      </li>
      <li id="CE7" data-order="4">
        <span class="category_bg cafe"></span>
        카페
      </li>
      <li id="CS2" data-order="5">
        <span class="category_bg store"></span>
        편의점
      </li>
    </ul>
    <amenity-detail class="amenitypopup" v-if="amenity"></amenity-detail>
  </div>
</template>
<script>
//import axios from "axios";
import http from "@/api/http";
import HouseDetail from "@/components/house/HouseDetail.vue";
import HouseList from "@/components/house/HouseList.vue";
import AmenityDetail from "@/components/house/AmenityDetail.vue";
import { mapMutations } from "vuex";
import { mapState } from "vuex";
import latLngs from "@/utils/guLatLng";
//import { mapGetters } from "vuex";
export default {
  name: "HouseMap",
  components: {
    HouseDetail,
    HouseList,
    AmenityDetail,
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
      ps: null,
      contentNode: null,
      clusterer: null,
      // placeOverlay: null,
      currCategory: "",
      amenitymarkers: [],
    };
  },
  computed: {
    ...mapState("houseStore", ["house", "houselist", "center", "amenity"]),
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
      "SET_HOUSE_DEALS_YEARLY",
      "SET_DETAIL_AMENITY",
    ]),
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.5666805, 126.9784147),
        level: 4,
      };

      this.map = new kakao.maps.Map(container, options);
      this.ps = new kakao.maps.services.Places(this.map);
      this.geocoder = new kakao.maps.services.Geocoder();
      //빈곳 클릭시 팝업 제거
      // kakao.maps.event.addListener(this.map, "idle", () => {
      //   this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo);
      // });
      this.SET_DETAIL_AMENITY(null);
      this.contentNode = document.createElement("div");
      this.addCategoryClickEvent();
      kakao.maps.event.addListener(this.map, "idle", this.searchPlaces);
      var zoomControl = new kakao.maps.ZoomControl();
      this.map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);
      var mapTypeControl = new kakao.maps.MapTypeControl();
      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      this.map.addControl(
        mapTypeControl,
        kakao.maps.ControlPosition.BOTTOMRIGHT,
      );

      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
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

            //console.log(this.houselist);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      await this.getHouseList(gu);
      //this.getAptListCenter();
      this.aptListToMarkers();
    },
    setCurrentGu() {
      console.log(this.currentGu);
      console.log(latLngs[this.currentGu]);
      this.guSelected = true;
      let moveLatLng = new kakao.maps.LatLng(
        latLngs[this.currentGu][0],
        latLngs[this.currentGu][1],
      );
      this.map.panTo(moveLatLng);
      this.getPositions();
    },
    // async setCurrentGu() {
    //   console.log("setcurrentGu");
    //   this.guSelected = true;
    //   this.getPositions();
    // },
    async getCurrentGu() {
      this.guSelected = true;
      await this.searchAddrFromCoords(
        this.map.getCenter(),
        this.displayCenterInfo,
      );
    },
    // getAptListCenter() {
    //   let maxLng = 0;
    //   let minLng = 180;
    //   let maxLat = 0;
    //   let minLat = 180;
    //   this.houselist.forEach((apt) => {
    //     if (maxLat < apt.lat) maxLat = apt.lat;

    //     if (minLat > apt.lat) minLat = apt.lat;
    //     if (maxLng < apt.lng) maxLng = apt.lng;
    //     if (minLng > apt.lng) minLng = apt.lng;
    //   });
    //   this.aptListCenter = {
    //     lngCenter: (parseFloat(maxLng) + parseFloat(minLng)) / 2,
    //     latCenter: (parseFloat(maxLat) + parseFloat(minLat)) / 2,
    //   };
    //   this.panTo();
    //   //지도 범위조정
    //   /* let sw = new kakao.maps.LatLng(minLat, minLng),
    //     ne = new kakao.maps.LatLng(maxLat, maxLng);
    //   console.log(sw);
    //   let bounds = kakao.maps.LatLngBounds(sw, ne);
    //   this.map.setBounds(bounds);*/
    // },
    // panTo() {
    //   console.log(this.aptListCenter.lngCenter);
    //   // 이동할 위도 경도 위치를 생성합니다
    //   var moveLatLon = new kakao.maps.LatLng(
    //     this.aptListCenter.latCenter,
    //     this.aptListCenter.lngCenter,
    //   );

    //   // 지도 중심을 부드럽게 이동시킵니다
    //   // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    //   this.map.panTo(moveLatLon);
    // },
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
        kakao.maps.event.addListener(marker, "click", async () => {
          //클릭이벤트 추가
          this.aptSelected = true;
          //console.log(marker);
          await this.getHouseInfo(marker.getTitle(), marker);
          this.getHouseDealsYearly(marker.getTitle());
          this.getHouseDeals(marker.getTitle());
          /*if (this.infowindow) this.infowindow.close();
          this.infowindow = new kakao.maps.InfoWindow({
            content: this.house.aptName, // 인포윈도우에 표시할 내용
          });

          this.infowindow.open(this.map, marker);*/
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
    getHouseDealsYearly(aptCode) {
      http
        .get(`/map/aptDealsYearly`, {
          params: {
            aptCode: aptCode,
          },
        })
        .then(({ data }) => {
          this.SET_HOUSE_DEALS_YEARLY(data);
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
    //////////////////////////////////////////////////////   부대시설 함수   ////////////////
    searchPlaces() {
      if (!this.currCategory) {
        console.log("curr empty");
        return;
      }

      // 커스텀 오버레이를 숨깁니다
      // this.placeOverlay.setMap(null);

      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeAmenityMarker();

      this.ps.categorySearch(this.currCategory, this.placesSearchCB, {
        useMapBounds: true,
      });
    },
    placesSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
        this.displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
      } else if (status === kakao.maps.services.Status.ERROR) {
        // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
      }
    },
    displayPlaces(places) {
      // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
      // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
      var order = document
        .getElementById(this.currCategory)
        .getAttribute("data-order");

      for (var i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = this.addAmenityMarker(
          new kakao.maps.LatLng(places[i].y, places[i].x),
          order,
        );

        // 마커와 검색결과 항목을 클릭 했을 때
        // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
        ((marker, place) => {
          kakao.maps.event.addListener(marker, "click", () => {
            this.displayPlaceInfo(place);
            console.log(place);
          });
        })(marker, places[i]);
      }
    },
    addAmenityMarker(position, order) {
      var imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(11, 28), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imgOptions,
        ),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage,
        });

      marker.setMap(this.map); // 지도 위에 마커를 표출합니다
      this.amenitymarkers.push(marker); // 배열에 생성된 마커를 추가합니다

      return marker;
    },
    removeAmenityMarker() {
      for (var i = 0; i < this.amenitymarkers.length; i++) {
        this.amenitymarkers[i].setMap(null);
      }
      this.amenitymarkers = [];
      this.SET_DETAIL_AMENITY(null);
    },
    displayPlaceInfo(place) {
      let temp = {
        name: "",
        phone: "",
        address: "",
      };
      temp.name = place.place_name;
      temp.phone = place.phone;
      temp.address = place.road_address_name;

      this.SET_DETAIL_AMENITY(temp);
      console.log(this.amenity);
      // var content =
      //   '<div class="placeinfo">' +
      //   '   <a class="title" href="' +
      //   place.place_url +
      //   '" target="_blank" title="' +
      //   place.place_name +
      //   '">' +
      //   place.place_name +
      //   "</a>";

      // if (place.road_address_name) {
      //   content +=
      //     '    <span title="' +
      //     place.road_address_name +
      //     '">' +
      //     place.road_address_name +
      //     "</span>" +
      //     '  <span class="jibun" title="' +
      //     place.address_name +
      //     '">(지번 : ' +
      //     place.address_name +
      //     ")</span>";
      // } else {
      //   content +=
      //     '    <span title="' +
      //     place.address_name +
      //     '">' +
      //     place.address_name +
      //     "</span>";
      // }

      // content +=
      //   '    <span class="tel">' +
      //   place.phone +
      //   "</span>" +
      //   "</div>" +
      //   '<div class="after"></div>';

      // this.contentNode.innerHTML = content;
      // this.placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
      // this.placeOverlay.setMap(this.map);
    },
    // 각 카테고리에 클릭 이벤트를 등록합니다
    addCategoryClickEvent() {
      var category = document.getElementById("category"),
        children = category.children;

      console.log(category);
      console.log(children);

      for (var i = 0; i < children.length; i++) {
        children[i].onclick = this.onClickCategory;
      }
    },
    // 카테고리를 클릭했을 때 호출되는 함수입니다
    onClickCategory(e) {
      var id = e.target.closest("li").id;
      var className = e.target.closest("li").className;
      // this.placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
      // this.placeOverlay.setMap(null);
      console.log(e.currentTarget);

      if (className === "on") {
        this.currCategory = "";
        this.changeCategoryClass();
        this.removeAmenityMarker();
        //this.searchPlaces();
      } else {
        this.currCategory = id;
        this.changeCategoryClass(e.target.closest("li"));
        this.searchPlaces();
      }
    },
    // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
    changeCategoryClass(el) {
      var category = document.getElementById("category"),
        children = category.children,
        i;

      for (i = 0; i < children.length; i++) {
        children[i].className = "";
      }

      if (el) {
        console.log("이거", el);
        if (el) el.className = "on";
      }
    },
  },
  watch: {
    center(latlng) {
      console.log("watched");
      this.map.setCenter(new kakao.maps.LatLng(latlng[0], latlng[1]));
      //this.center = nv;
    },
    house(house) {
      console.log("watched");
      if (this.infowindow) this.infowindow.close();
      //console.log(this.markers);
      this.markers.forEach((marker) => {
        if (marker.getTitle() == house.aptCode) {
          console.log(marker);
          this.infowindow = new kakao.maps.InfoWindow({
            content: this.house.aptName, // 인포윈도우에 표시할 내용
          });

          this.infowindow.open(this.map, marker);
        }
      });
    },
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
      console.log("kakao exist");
    } else {
      console.log("kakao not exist");
      const script = document.createElement("script");
      /* global kakao */
      //console.log(process.env.VUE_APP_MAP_KEY);
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.VUE_APP_MAP_KEY}&libraries=services,clusterer`;
      document.head.appendChild(script);
    }
    // this.SET_DETAIL_AMENITY(null);
    // this.contentNode = document.createElement("div");
    // this.addCategoryClickEvent();
    // kakao.maps.event.addListener(this.map, "idle", this.searchPlaces);
    // var mapTypeControl = new kakao.maps.MapTypeControl();
    // // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    // this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

    // // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    // var zoomControl = new kakao.maps.ZoomControl();
    // this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  },
  created() {
    this.SET_HOUSE_LIST([]);
    this.SET_DETAIL_HOUSE(null);
    for (let i = 0; i < 25; i++) {
      this.options.push(new Object());
      this.options[i].value = Object.keys(latLngs)[i];
      this.options[i].text = Object.keys(latLngs)[i];
      this.guList.push(new Object());
      this.guList[i].gugunName = Object.keys(latLngs)[i];
      this.guList[i].gugunCode = Object.values(latLngs)[i][2];
    }
    // http
    //   .get(`/map/gugun`, {
    //     params: {
    //       sido: "11",
    //     },
    //   })
    //   .then(({ data }) => {
    //     this.guList = data;
    //     for (let i = 0; i < data.length; i++) {
    //       this.options.push(new Object());
    //       this.options[i].value = data[i].gugunName;
    //       this.options[i].text = data[i].gugunName;
    //     }
    //     console.log(this.guList);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
.amenitypopup {
  height: 100%;
  position: absolute;
  top: 100px;
  right: 50px;
  display: flex;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  width: 300px;
  height: 300px;
}

.mapwrap {
  height: 100%;
  width: 100%;
  position: relative;
}
.gu-select {
  position: absolute;
  top: 20px;
  display: flex;
  z-index: 1;
  margin-left: 50%;
}
#category {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 5px;
  border: 1px solid #909090;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
  background: #fff;
  overflow: hidden;
  z-index: 2;
}
#category li {
  float: left;
  list-style: none;
  width: 50px;
  border-right: 1px solid #acacac;
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
}
#category li.on {
  background: #eee;
}
#category li:hover {
  background: #ffe6e6;
  border-left: 1px solid #acacac;
  margin-left: -1px;
}
#category li:last-child {
  margin-right: 0;
  border-right: 0;
}
#category li span {
  display: block;
  margin: 0 auto 3px;
  width: 27px;
  height: 28px;
}
#category li .category_bg {
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png)
    no-repeat;
}
#category li .bank {
  background-position: -10px 0;
}
#category li .mart {
  background-position: -10px -36px;
}
#category li .pharmacy {
  background-position: -10px -72px;
}
#category li .oil {
  background-position: -10px -108px;
}
#category li .cafe {
  background-position: -10px -144px;
}
#category li .store {
  background-position: -10px -180px;
}
#category li.on .category_bg {
  background-position-x: -46px;
}
</style>
