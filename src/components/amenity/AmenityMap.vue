<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col cols="8">
        <div class="map_wrap">
          <div
            id="map"
            style="
              width: 100%;
              height: 100%;
              position: relative;
              overflow: hidden;
            "
          ></div>
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
        </div>
      </b-col>
      <b-col cols="4" class="setup">
        <b-row>
          <p style="margin: auto; font-weight: 600">위치</p>
          <b-form-select
            @change="setCurrentGu"
            v-model="currentGu"
            :options="options"
            :select-size="5"
            class="gu-select"
          ></b-form-select>
        </b-row>
        <hr />
        <b-row class="amenity">
          <b-row class="amenity-name">
            <span style="font-weight: 600">시설명 :&nbsp; </span>
            {{ placeData.name }}
          </b-row>
          <b-row class="amenity-phone">
            <span style="font-weight: 600">시설 전화번호 :&nbsp; </span>
            {{ placeData.phone }}
          </b-row>
          <b-row class="amenity-address">
            <span style="font-weight: 600">시설 주소 :&nbsp; </span>
            {{ placeData.address }}
          </b-row>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import latLngs from "@/utils/guLatLng";
import { mapState, mapActions } from "vuex";
const houseStore = "houseStore";
export default {
  name: "HouseMap",
  data() {
    return {
      map: null,
      ps: null,
      contentNode: null,
      clusterer: null,
      // placeOverlay: null,
      currCategory: "",
      amenitymarkers: [],
      placeData: {
        name: "",
        phone: "",
        address: "",
      },
      options: [],
      currentGu: "",
    };
  },
  props: {},
  created() {
    console.log(Object.keys(latLngs));
    for (let i = 0; i < 25; i++) {
      this.options.push(new Object());
      this.options[i].value = Object.keys(latLngs)[i];
      this.options[i].text = Object.keys(latLngs)[i];
    }
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" +
        process.env.VUE_APP_MAP_KEY +
        "&libraries=services,clusterer";
      document.head.appendChild(script);
    }
    this.contentNode = document.createElement("div");
    this.addCategoryClickEvent();
    kakao.maps.event.addListener(this.map, "idle", this.searchPlaces);
    var mapTypeControl = new kakao.maps.MapTypeControl();
    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    var zoomControl = new kakao.maps.ZoomControl();
    this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  },
  computed: {
    ...mapState(houseStore, ["sido", "gugun", "isDetail"]),
  },
  watch: {},
  methods: {
    ...mapActions(houseStore, ["detailHouse", "getIsDetail"]),
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
    },
    // 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
    // addEventHandle(target, type, callback) {
    //   if (target.addEventListener) {
    //     target.addEventListener(type, callback);
    //   } else {
    //     target.attachEvent("on" + type, callback);
    //   }
    // },

    // 카테고리 검색을 요청하는 함수입니다
    searchPlaces() {
      if (!this.currCategory) {
        console.log("curr empty");
        return;
      }

      // 커스텀 오버레이를 숨깁니다
      // this.placeOverlay.setMap(null);

      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeMarker();

      this.ps.categorySearch(this.currCategory, this.placesSearchCB, {
        useMapBounds: true,
      });
    },

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
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

    // 지도에 마커를 표출하는 함수입니다
    displayPlaces(places) {
      // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
      // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
      var order = document
        .getElementById(this.currCategory)
        .getAttribute("data-order");

      for (var i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var marker = this.addMarker(
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

    // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
    addMarker(position, order) {
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

    // 지도 위에 표시되고 있는 마커를 모두 제거합니다
    removeMarker() {
      for (var i = 0; i < this.amenitymarkers.length; i++) {
        this.amenitymarkers[i].setMap(null);
      }
      this.amenitymarkers = [];
    },

    // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
    displayPlaceInfo(place) {
      this.placeData.name = place.place_name;
      this.placeData.phone = place.phone;
      this.placeData.address = place.road_address_name;
      console.log(this.placeData);
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
        this.removeMarker();
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
    setCurrentGu() {
      console.log(this.currentGu);
      console.log(latLngs[this.currentGu]);
      let moveLatLng = new kakao.maps.LatLng(
        latLngs[this.currentGu][0],
        latLngs[this.currentGu][1],
      );
      this.map.panTo(moveLatLng);
    },
  },
};
</script>

<style lang="scss" scope>
.map_wrap,
.map_wrap * {
  margin: 0;
  padding: 0;
  font-family: "Malgun Gothic", dotum, "돋움", sans-serif;
  font-size: 12px;
}
.map_wrap {
  position: relative;
  width: 100%;
  height: 700px;
}
#category {
  position: absolute;
  top: 10px;
  left: 10px;
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
.placeinfo_wrap {
  position: absolute;
  bottom: 28px;
  left: -150px;
  width: 300px;
}
.placeinfo {
  position: relative;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  background: #fff;
}
.placeinfo:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.placeinfo_wrap .after {
  content: "";
  position: relative;
  margin-left: -12px;
  left: 50%;
  width: 22px;
  height: 12px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}
.placeinfo a,
.placeinfo a:hover,
.placeinfo a:active {
  color: #fff;
  text-decoration: none;
}
.placeinfo a,
.placeinfo span {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.placeinfo span {
  margin: 5px 5px 0 5px;
  cursor: default;
  font-size: 13px;
}
.placeinfo .title {
  font-weight: bold;
  font-size: 14px;
  border-radius: 6px 6px 0 0;
  margin: -1px -1px 0 -1px;
  padding: 10px;
  color: #fff;
  background: #d95050;
  background: #d95050
    url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png)
    no-repeat right 14px center;
}
.placeinfo .tel {
  color: #0f7833;
}
.placeinfo .jibun {
  color: #999;
  font-size: 11px;
  margin-top: 0;
}
.amenity {
  display: flex;
  justify-content: center;
  text-align: center;

  .amenity-name {
    width: 30rem;
    height: 2rem;
    background: #ffdfdf;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    margin: 1rem;
  }
  .amenity-phone {
    width: 30rem;
    height: 2rem;
    background: #deffce;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    margin: 1rem;
  }
  .amenity-address {
    width: 30rem;
    height: 2rem;
    background: #ecfcff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    margin: 1rem;
  }
}
</style>
