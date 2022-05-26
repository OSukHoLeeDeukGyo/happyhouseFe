<template>
  <b-container class="bv-example-row p-3">
    <b-row
      ><b-button class="closebutton" @click="close">X</b-button>
      <b-col class="setup">
        <hr />
        <hr />
        <hr />
        <b-row class="amenity-name">
          <span style="font-weight: 600">시설명 :&nbsp; </span>
          {{ amenity.name }}
        </b-row>
        <br />
        <b-row class="amenity-phone">
          <span style="font-weight: 600">시설 전화번호 :&nbsp; </span>
          {{ amenity.phone }}
        </b-row>
        <br />
        <b-row class="amenity-address">
          <span style="font-weight: 600">시설 주소 :&nbsp; </span>
          {{ amenity.address }}
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
//import http from "@/api/http";
export default {
  name: "HouseDetail",
  data() {
    return {};
  },

  components: {},
  methods: {
    ...mapMutations("houseStore", ["SET_DETAIL_AMENITY"]),
    close() {
      //this.aptSelected = false;
      this.SET_DETAIL_AMENITY(null);
      //this.$emit("isAptSelected");
      //this.currentApt;
    },
  },

  computed: {
    ...mapState("houseStore", ["amenity"]),
    // priceCal() {
    //   return this.housedeals;
    // },

    // house() {
    //   return this.$store.state.house;
    // },
  },
  filters: {
    price(value) {
      if (!value) return value;
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  watch: {
    // priceCal(val) {
    //   this.housedeals = val;
    //   this.numDealAmount = +this.housedeals[
    //     this.housedeals.length - 1
    //   ].dealAmount.replace(",", "");
    //   this.eok = Math.floor(this.numDealAmount / 10000);
    //   this.man = this.numDealAmount % 10000;
    // },
  },

  created() {
    // console.log("이거", this.house);
    // //console.log(this.housedeals);
    // this.numDealAmount = +this.housedeals[
    //   this.housedeals.length - 1
    // ].dealAmount.replace(",", "");
    // this.eok = Math.floor(this.numDealAmount / 10000);
    // this.man = this.numDealAmount % 10000;
    // console.log(this.eok, this.man);
  },
};
</script>

<style>
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
.closebutton {
  margin-left: 10px;
  height: 40px;
  width: 40px;
}
</style>
