import { sidoList, gugunList } from "@/api/house.js";
//import http from "@/api/http";

const houseStore = {
  namespaced: true,
  state: {
    sidos: [{ value: null, text: "선택하세요" }],
    guguns: [{ value: null, text: "선택하세요" }],

    house: null,
    housedeals: [],
    houselist: [],
    center: [],
    housedealsyearly: [],
    amenity: {
      name: "",
      phone: "",
      address: "",
    },
  },

  getters: {
    getDeals: (state) => () => state.housedeals,
    getDealsYearly: (state) => () => state.housedealsyearly,
    gethouses: (state) => () => state.houselist,
    getcenter(state) {
      return state.center;
    },
    getamenity(state) {
      return state.amenity;
    },
  },

  mutations: {
    SET_SIDO_LIST: (state, sidos) => {
      sidos.forEach((sido) => {
        state.sidos.push({ value: sido.sidoCode, text: sido.sidoName });
      });
    },
    SET_GUGUN_LIST: (state, guguns) => {
      guguns.forEach((gugun) => {
        state.guguns.push({ value: gugun.gugunCode, text: gugun.gugunName });
      });
    },
    CLEAR_SIDO_LIST: (state) => {
      state.sidos = [{ value: null, text: "선택하세요" }];
    },
    CLEAR_GUGUN_LIST: (state) => {
      state.guguns = [{ value: null, text: "선택하세요" }];
    },
    SET_HOUSE_LIST: (state, houselist) => {
      //   console.log(houselist);
      state.houselist = houselist;
    },
    SET_DETAIL_HOUSE: (state, house) => {
      state.house = house;
    },
    SET_HOUSE_DEALS: (state, housedeals) => {
      state.housedeals = housedeals;
    },
    SET_HOUSE_DEALS_YEARLY: (state, housedealsyearly) => {
      state.housedealsyearly = housedealsyearly;
    },
    SET_CENTER: (state, center) => {
      state.center = center;
    },
    SET_DETAIL_AMENITY: (state, amenity) => {
      state.amenity = amenity;
    },
  },

  actions: {
    getSido: ({ commit }) => {
      sidoList(
        ({ data }) => {
          // console.log(data);
          commit("SET_SIDO_LIST", data);
        },
        (error) => {
          console.log(error);
        },
      );
    },
    getGugun: ({ commit }, sidoCode) => {
      const params = {
        sido: sidoCode,
      };
      gugunList(
        params,
        ({ data }) => {
          // console.log(commit, response);
          commit("SET_GUGUN_LIST", data);
        },
        (error) => {
          console.log(error);
        },
      );
    },
    getHouseList: ({ commit }, data) => {
      commit("SET_HOUSE_LIST", data);
    },
    houseDeals: ({ commit }, data) => {
      commit("SET_HOUSE_DEALS", data);
    },
    houseDealsYearly: ({ commit }, data) => {
      commit("SET_HOUSE_DEALS_YEARLY", data);
    },
    detailHouse: ({ commit }, house) => {
      commit("SET_DETAIL_HOUSE", house);
    },
    getCenter: ({ commit }, center) => {
      commit("SET_CENTER", center);
    },
    getAmenity: ({ commit }, amenity) => {
      commit("SET_DETAIL_AMENITY", amenity);
    },
  },
};

export default houseStore;
