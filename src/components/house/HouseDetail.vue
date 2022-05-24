<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col>
        <br />
        <b-row>
          <b-col>
            <b-alert show variant="secondary">일련번호 : {{}}</b-alert>
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
            <b-alert show variant="info"
              >주소 : {{ house.dongName }} {{ house.jibun }}</b-alert
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-alert show variant="danger"
              >최근 거래금액 :
              {{ housedeals[housedeals.length - 1].dealAmount }}원</b-alert
            >
          </b-col>
        </b-row>
        <line-chart />
      </b-col>
      <b-col
        ><b-row>
          <button @click="close">X</button>
        </b-row></b-col
      >
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import LineChart from "@/components/house/HouseChart.vue";
//import http from "@/api/http";
export default {
  name: "HouseDetail",
  data() {
    return {};
  },

  components: { LineChart },
  props: { aptSelected: Boolean },
  methods: {
    close() {
      console.log(this.aptSelected);
      //this.aptSelected = false;
      this.$emit("isAptSelected");
      //this.currentApt;
    },
  },

  computed: {
    ...mapState("houseStore", ["house", "housedeals"]),

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
  created() {
    console.log(this.house);
    console.log(this.housedeals);
  },
};
</script>

<style></style>
