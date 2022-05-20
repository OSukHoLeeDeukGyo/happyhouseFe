<template>
  <b-container class="bv-example-row mt-3">
    <b-row>
      <b-col>
        <b-alert show><h3>글보기</h3></b-alert>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col class="text-left">
        <b-button variant="outline-primary" @click="listArticle">목록</b-button>
      </b-col>
      <b-col class="text-right">
        <b-button
          variant="outline-info"
          size="sm"
          @click="moveModifyArticle"
          class="mr-2"
          >글수정</b-button
        >
        <b-button variant="outline-danger" size="sm" @click="deleteArticle"
          >글삭제</b-button
        >
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col>
        <b-card
          :header-html="`<h3>${article.articleno}.
          ${article.subject} [${article.hit}]</h3><div><h6>${article.userid}</div><div>${article.regtime}</h6></div>`"
          class="mb-2"
          border-variant="dark"
          no-body
        >
          <b-card-body class="text-left">
            <div v-html="message"></div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mb-1" v-if="article.reply">
      <b-col>
        <b-card
          :header-html="`<div><h6>admin</h6></div>`"
          class="mb-2"
          border-variant="dark"
          no-body
        >
          <b-card-body class="text-left">
            <div>{{ article.reply }}</div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mb-1" v-if="isAdmin">
      <b-form @submit="registReply">
        <b-form-group id="content-group" label="내용:" label-for="content">
          <b-form-textarea
            id="content"
            v-model="reply"
            placeholder="내용 입력..."
            cols="150"
            rows="10"
            max-rows="15"
          ></b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary" class="m-1" v-if="!isReply"
          >답변작성</b-button
        >
        <b-button type="submit" variant="primary" class="m-1" v-else
          >답변수정</b-button
        >
        <b-button
          type="button"
          variant="danger"
          class="m-1"
          @click="deleteReply"
          >답변삭제</b-button
        >
      </b-form>
    </b-row>
  </b-container>
</template>

<script>
// import moment from "moment";
import http from "@/api/http";

export default {
  name: "QnaDetail",
  data() {
    return {
      article: {},
      reply: "",
      isAdmin: false,
      isReply: false,
    };
  },
  computed: {
    message() {
      if (this.article.content)
        return this.article.content.split("\n").join("<br>");
      return "";
    },
  },
  created() {
    http
      .get(`/qna/getdetail/${this.$route.params.articleno}`)
      .then(({ data }) => {
        this.article = data;
        if (this.article.reply) this.isReply = true;
      });
    if (sessionStorage.getItem("userid") === "admin") this.isAdmin = true;
  },
  methods: {
    registReply(event) {
      event.preventDefault();
      http
        .put(`/qna/admin/${this.article.articleno}`, {
          articleno: this.article.articleno,
          hit: this.article.hit,
          regtime: this.article.regtime,
          userid: this.article.userid,
          subject: this.article.subject,
          content: this.article.content,
          reply: this.reply,
        })
        .then(({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "등록이 완료되었습니다.";
          }
          alert(msg);
          this.$router.push({
            name: "qnaList",
          });
          //location.href = `/qna/detail/${this.article.articleno}`;
        });
    },
    deleteReply() {
      http
        .put(`/qna/admin/${this.article.articleno}`, {
          articleno: this.article.articleno,
          hit: this.article.hit,
          regtime: this.article.regtime,
          userid: this.article.userid,
          subject: this.article.subject,
          content: this.article.content,
          reply: null,
        })
        .then(({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "답변 삭제가 완료되었습니다.";
          }
          alert(msg);
          this.$router.push({
            name: "qnaList",
          });
          //this.$router.go();
          //location.href = `/qna/detail/${this.article.articleno}`;
        });
    },
    listArticle() {
      this.$router.push({ name: "qnaList" });
    },
    moveModifyArticle() {
      this.$router.replace({
        name: "qnaModify",
        params: { articleno: this.article.articleno },
      });
      //   this.$router.push({ path: `/qna/modify/${this.article.articleno}` });
    },
    deleteArticle() {
      if (confirm("정말로 삭제?")) {
        this.$router.replace({
          name: "qnaDelete",
          params: { articleno: this.article.articleno },
        });
      }
    },
    refresh() {
      this.$router.push({
        name: "qnaList",
        params: { articleno: this.article.articleno },
      });
    },
  },
  // filters: {
  //   dateFormat(regtime) {
  //     return moment(new Date(regtime)).format("YY.MM.DD hh:mm:ss");
  //   },
  // },
};
</script>

<style></style>
