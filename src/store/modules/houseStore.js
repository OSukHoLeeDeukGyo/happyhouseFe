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
  },

  getters: {
    getDeals: (state) => () => state.housedeals,
    gethouses: (state) => () => state.houselist,
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
    detailHouse: ({ commit }, house) => {
      commit("SET_DETAIL_HOUSE", house);
    },
  },
};

export default houseStore;
