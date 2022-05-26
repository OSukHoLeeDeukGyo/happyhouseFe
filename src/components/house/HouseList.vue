<template>
  <b-container
    v-if="houselist && houselist.length != 0"
    class="bv-example-row"
    style="overflow: hidden margin-top: !important 0;"
  >
    <b-img
      :src="require('@/assets/xbtn.png')"
      @click="close"
      class="popupclose"
      style="height: 1rem; width: 1rem"
    />
    <b-list-group class="listarea"
      ><house-list-item
        v-for="(apt, index) in houselist"
        :key="index"
        :apt="apt"
    /></b-list-group>
  </b-container>
  <b-container v-else class="bv-example-row">
    <b-img
      :src="require('@/assets/xbtn.png')"
      @click="close"
      class="popupclose"
      style="height: 1rem; width: 1rem"
    />
    <b-row>
      <b-col><b-alert show>주택 목록이 없습니다.</b-alert></b-col>
    </b-row>
  </b-container>
</template>

<script>
import HouseListItem from "@/components/house/HouseListItem.vue";
import { mapState } from "vuex";

export default {
  name: "HouseList",
  components: { HouseListItem },
  props: { aptSelected: Boolean },
  data() {
    return {};
  },
  computed: {
    ...mapState("houseStore", ["houselist"]),
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

<style>
.listarea {
  height: 100%;
  overflow: auto;
}
.popupclose {
  right: 0;
  cursor: pointer;
  margin: 0.5rem 0;
}
</style>
