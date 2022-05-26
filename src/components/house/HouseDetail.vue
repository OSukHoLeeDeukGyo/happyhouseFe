<template>
  <b-container class="bv-example-row p-3">
    <button @click="close">X</button>
    <b-row>
      <b-col>
        <br />
        <b-row>
          <b-col>
            <b-alert show variant="secondary"
              >일련번호 : {{ house.aptCode }}</b-alert
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-alert show variant="primary"
              >아파트 이름 : {{ house.aptName }}
            </b-alert>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-alert show variant="warning"
              >건축연도 : {{ house.buildYear }}년
            </b-alert>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-alert show variant="info"
              >주소 : {{ house.dongName }} {{ house.jibun }}</b-alert
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-alert show variant="danger"
              >최근 거래금액 :
              <span v-if="this.eok">{{ eok }}억</span>
              {{ man }}만원</b-alert
            >
          </b-col>
        </b-row>
        <line-chart />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import LineChart from "@/components/house/charts/HouseChart.vue";
//import http from "@/api/http";
export default {
  name: "HouseDetail",
  data() {
    return {
      numDealAmount: 0,
      eok: 0,
      man: 0,
      housedealstmp: null,
    };
  },

  components: { LineChart },
  props: { aptSelected: Boolean },
  methods: {
    ...mapMutations("houseStore", [
      "SET_DETAIL_HOUSE",
      "SET_HOUSE_DEALS",
      "SET_HOUSE_LIST",
    ]),
    close() {
      //this.aptSelected = false;
      this.SET_DETAIL_HOUSE(null);
      //this.$emit("isAptSelected");
      //this.currentApt;
    },
  },

  computed: {
    ...mapState("houseStore", ["house", "housedeals", "housedealsyearly"]),
    priceCal() {
      return this.housedeals;
    },

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
    priceCal(val) {
      this.housedeals = val;
      this.numDealAmount = +this.housedeals[
        this.housedeals.length - 1
      ].dealAmount.replace(",", "");
      this.eok = Math.floor(this.numDealAmount / 10000);
      this.man = this.numDealAmount % 10000;
    },
  },

  created() {
    console.log("이거", this.house);
    //console.log(this.housedeals);
    this.numDealAmount = +this.housedeals[
      this.housedeals.length - 1
    ].dealAmount.replace(",", "");
    this.eok = Math.floor(this.numDealAmount / 10000);
    this.man = this.numDealAmount % 10000;
    console.log(this.eok, this.man);
  },
};
</script>

<style></style>
