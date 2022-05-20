<template>
  <b-row class="mt-4 mb-4 text-center">
<<<<<<< HEAD
    <!-- <b-col class="sm-3">
=======
    <!--<b-col class="sm-3">
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
      <b-form-input
        v-model.trim="dongCode"
        placeholder="동코드 입력...(예 : 11110)"
        @keypress.enter="sendKeyword"
      ></b-form-input>
    </b-col>
    <b-col class="sm-3" align="left">
      <b-button variant="outline-primary" @click="sendKeyword">검색</b-button>
<<<<<<< HEAD
    </b-col> -->
=======
    </b-col>
    --->
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    <b-col class="sm-3">
      <b-form-select
        v-model="sidoCode"
        :options="sidos"
        @change="gugunList"
      ></b-form-select>
    </b-col>
    <b-col class="sm-3">
      <b-form-select
        v-model="gugunCode"
        :options="guguns"
        @change="searchApt"
      ></b-form-select>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

<<<<<<< HEAD
/*
  namespaced: true를 사용했기 때문에 선언해줍니다.
  index.js 에서 modules 객체의 '키' 이름입니다.

  modules: {
    키: 값
    memberStore: memberStore,
    houseStore: houseStore
  }  
*/
const houseStore = "houseStore";

=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
export default {
  name: "HouseSearchBar",
  data() {
    return {
      sidoCode: null,
      gugunCode: null,
    };
  },
  computed: {
<<<<<<< HEAD
    ...mapState(houseStore, ["sidos", "guguns", "houses"]),
=======
    ...mapState(["sidos", "guguns", "houses"]),
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    // sidos() {
    //   return this.$store.state.sidos;
    // },
  },
  created() {
    // this.$store.dispatch("getSido");
    // this.sidoList();
    this.CLEAR_SIDO_LIST();
    this.getSido();
  },
  methods: {
<<<<<<< HEAD
    ...mapActions(houseStore, ["getSido", "getGugun", "getHouseList"]),
    ...mapMutations(houseStore, ["CLEAR_SIDO_LIST", "CLEAR_GUGUN_LIST"]),
=======
    ...mapActions(["getSido", "getGugun", "getHouseList"]),
    ...mapMutations(["CLEAR_SIDO_LIST", "CLEAR_GUGUN_LIST"]),
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    // sidoList() {
    //   this.getSido();
    // },
    gugunList() {
      console.log(this.sidoCode);
      this.CLEAR_GUGUN_LIST();
      this.gugunCode = null;
      if (this.sidoCode) this.getGugun(this.sidoCode);
    },
    searchApt() {
      if (this.gugunCode) this.getHouseList(this.gugunCode);
    },
  },
};
</script>

<style></style>
