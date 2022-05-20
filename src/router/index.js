import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

<<<<<<< HEAD
import store from "@/store/index.js";

Vue.use(VueRouter);

// https://router.vuejs.org/kr/guide/advanced/navigation-guards.html
const onlyAuthUser = async (to, from, next) => {
  // console.log(store);
  const checkUserInfo = store.getters["memberStore/checkUserInfo"];
  const getUserInfo = store._actions["memberStore/getUserInfo"];
  let token = sessionStorage.getItem("access-token");
  if (checkUserInfo == null && token) {
    await getUserInfo(token);
  }
  if (checkUserInfo === null) {
    alert("로그인이 필요한 페이지입니다..");
    next({ name: "signIn" });
    // router.push({ name: "signIn" });
  } else {
    // console.log("로그인 했다.");
    next();
  }
};

=======
Vue.use(VueRouter);

>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/views/MemberView.vue"),
    children: [
      {
<<<<<<< HEAD
        path: "singin",
=======
        path: "signin",
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
        name: "signIn",
        component: () => import("@/components/user/MemberLogin.vue"),
      },
      {
<<<<<<< HEAD
        path: "singup",
        name: "signUp",
        component: () => import("@/components/user/MemberRegister.vue"),
      },
      {
        path: "mypage",
        name: "mypage",
        beforeEnter: onlyAuthUser,
        component: () => import("@/components/user/MemberMyPage.vue"),
      },
=======
        path: "signup",
        name: "signUp",
        component: () => import("@/components/user/MemberRegister.vue"),
      },
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    ],
  },
  {
    path: "/board",
    name: "board",
    component: () => import("@/views/BoardView.vue"),
    redirect: "/board/list",
    children: [
      {
        path: "list",
        name: "boardList",
        component: () => import("@/components/board/BoardList.vue"),
      },
      {
        path: "write",
        name: "boardRegister",
<<<<<<< HEAD
        beforeEnter: onlyAuthUser,
=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
        component: () => import("@/components/board/BoardRegister.vue"),
      },
      {
        path: "detail/:articleno",
        name: "boardDetail",
<<<<<<< HEAD
        beforeEnter: onlyAuthUser,
=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
        component: () => import("@/components/board/BoardDetail.vue"),
      },
      {
        path: "modify/:articleno",
        name: "boardModify",
<<<<<<< HEAD
        beforeEnter: onlyAuthUser,
        component: () => import("@/components/board/BoardModify.vue"),
      },
    ],
  },
  {
    path: "/AmenityView",
    name: "amenity",
    component: () => import("@/views/AmenityView.vue"),
=======
        component: () => import("@/components/board/BoardModify.vue"),
      },
      {
        path: "delete/:articleno",
        name: "boardDelete",
        component: () => import("@/components/board/BoardDelete.vue"),
      },
    ],
  },
  {
    path: "/qna",
    name: "qna",
    component: () => import("@/views/QnaView.vue"),
    redirect: "/qna/list",
    children: [
      {
        path: "list",
        name: "qnaList",
        component: () => import("@/components/qna/QnaList.vue"),
      },
      {
        path: "write",
        name: "qnaRegister",
        component: () => import("@/components/qna/QnaRegister.vue"),
      },
      {
        path: "detail/:articleno",
        name: "qnaDetail",
        component: () => import("@/components/qna/QnaDetail.vue"),
      },
      {
        path: "modify/:articleno",
        name: "qnaModify",
        component: () => import("@/components/qna/QnaModify.vue"),
      },
      {
        path: "delete/:articleno",
        name: "qnaDelete",
        component: () => import("@/components/qna/QnaDelete.vue"),
      },
    ],
  },
  {
    path: "/instagram",
    name: "instagram",
    component: () => import("@/views/InstagramView.vue"),
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
  },
  {
    path: "/house",
    name: "house",
<<<<<<< HEAD
    beforeEnter: onlyAuthUser,
=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    component: () => import("@/views/HouseView.vue"),
  },
  {
    path: "/todo",
    name: "todo",
<<<<<<< HEAD
    beforeEnter: onlyAuthUser,
=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    component: () => import("@/views/TodoView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
