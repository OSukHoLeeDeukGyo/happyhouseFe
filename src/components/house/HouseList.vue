<template>
  <b-container
    v-if="houselist && houselist.length != 0"
    class="bv-example-row mt-3"
  >
    <house-list-item
      v-for="(house, index) in houselist"
      :key="index"
      :house="house"
    />
  </b-container>
  <b-container v-else class="bv-example-row mt-3">
    <b-row>
      <b-col><b-alert show>주택 목록이 없습니다.</b-alert></b-col>
    </b-row>
  </b-container>
</template>

<script>
//import HouseListItem from "@/components/house/HouseListItem.vue";
import { mapState } from "vuex";

export default {
  name: "HouseList",
  components: {},
  props: { aptSelected: Boolean },
  data() {
    return {};
  },
  computed: {
    ...mapState("houseStore", ["house", "houselist"]),
    // houses() {
    //   return this.$store.state.houses;
    // },
  },
  methods: {
    close() {
      console.log(this.guSelected);
      //this.aptSelected = false;
      this.$emit("isGuSelected");
      //this.currentApt;
    },
  },
};
</script>

<style></style>
