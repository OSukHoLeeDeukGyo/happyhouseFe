<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col><button @click="close">X</button></b-col>
    </b-row>
    <b-row>
      <b-col
        ><h3>{{ currentApt }}</h3></b-col
      >
    </b-row>
    <b-row class="mb-2 mt-1">
      <b-col
        ><b-img :src="require('@/assets/apt.png')" fluid-grow></b-img
      ></b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert show variant="secondary">일련번호 : {{}}</b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert show variant="primary">아파트 이름 : {{}} </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert show variant="info">법정동 : {{}} </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert show variant="warning">층수 : {{}}층</b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert show variant="danger">거래금액 : {{}}원</b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
//import { mapState } from "vuex";
import http from "@/api/http";
export default {
  name: "HouseDetail",
  data() {
    return { aptDeals: [] };
  },
  props: { currentApt: String, aptSelected: Boolean },
  methods: {
    close() {
      console.log(this.aptSelected);
      //this.aptSelected = false;
      this.$emit("isAptSelected");
      //this.currentApt;
    },
  },

  computed: {
    //...mapState(["aptCode"]),
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
    http
      .get(`/map/aptDeals`, {
        params: {
          aptCode: this.currentApt,
        },
      })
      .then(({ data }) => {
        //console.log(data);
        this.aptDeals = data;

        //this.options.value = data.gugunName;
        console.log(this.aptDeals);

        // console.log(commit, response);
        //commit("SET_GUGUN_LIST", data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style></style>
