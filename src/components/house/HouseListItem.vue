<template>
  <b-list-group-item
    class="m-2"
    @click="selectHouse"
    @mouseover="colorChange(true)"
    @mouseout="colorChange(false)"
    :class="{ 'mouse-over-bgcolor': isColor }"
    style="cursor: pointer"
  >
    <b-col cols="10" id="aptname" class="align-self-center">
      {{ apt.aptName }}
    </b-col>
  </b-list-group-item>
</template>

<script>
import { mapState } from "vuex";
import http from "@/api/http";
import { mapMutations } from "vuex";
export default {
  name: "HouseListItem",
  data() {
    return {
      isColor: false,
    };
  },
  props: {
    apt: Object,
  },
  computed: {
    ...mapState("houseStore", ["house", "center"]),
    // houses() {
    //   return this.$store.state.houses;
    // },
  },
  methods: {
    ...mapMutations("houseStore", [
      "SET_DETAIL_HOUSE",
      "SET_HOUSE_DEALS",
      "SET_HOUSE_LIST",
      "SET_CENTER",
      "SET_HOUSE_DEALS_YEARLY",
    ]),
    selectHouse() {
      console.log("listRow : ", this.apt.aptCode);
      // this.$store.dispatch("getHouse", this.house);
      //this.detailHouse(this.house);
      let lat = this.apt.lat;
      let lng = this.apt.lng;
      this.SET_CENTER([lat, lng]);
      this.getHouseInfo(this.apt.aptCode);
      this.getHouseDealsYearly(this.apt.aptCode);
      this.getHouseDeals(this.apt.aptCode);
    },
    colorChange(flag) {
      this.isColor = flag;
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
  },
};
</script>

<style scoped>
.apt {
  width: 50px;
}
#aptname {
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mouse-over-bgcolor {
  background-color: lightblue;
}
</style>
