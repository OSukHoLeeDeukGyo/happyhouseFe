<template>
  <b-container
    v-if="houselist && houselist.length != 0"
    class="bv-example-row p-3"
  >
    <b-button class="popupclose" @click="close">X</b-button>
    <b-list-group class="listarea"
      ><house-list-item
        v-for="(apt, index) in houselist"
        :key="index"
        :apt="apt"
    /></b-list-group>
  </b-container>
  <b-container v-else class="bv-example-row mt-3">
    <b-button class="popupclose" @click="close">X</b-button>
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
  height: 40px;
  width: 40px;
}
</style>
