<template>
  <b-container class="bv-example-row mt-3">
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
          v-if="isWriter"
          >글수정</b-button
        >
        <b-button
          variant="outline-danger"
          size="sm"
          @click="deleteArticle"
          v-if="isWriter"
          >글삭제</b-button
        >
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col>
        <b-card
          :header-html="`<h3>${article.articleno}.
          ${article.subject}</h3><div><h6>작성자 : ${article.userid}</div><div>${article.regtime}</div><div>조회수 : ${article.hit}</h6></div>`"
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
    <hr />
    <!-- 댓글이 없거나 수정중이면 -->
    <b-row class="mb-1" v-if="!isReplied || isModifying">
      <b-col>
        <b-form @submit="onSubmit" v-if="this.userInfo">
          <b-form-group
            id="userid-group"
            label="답변 작성자:"
            label-for="userid"
          >
            <b-form-input
              id="userid"
              v-model="userInfo.userid"
              type="text"
              required
              readonly
            ></b-form-input>
          </b-form-group>
          <b-form-group id="reply-group" label="답변 내용:" label-for="reply">
            <b-form-textarea
              id="reply"
              v-model="article.reply"
              placeholder="내용 입력..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary" class="m-1"
            >답글작성</b-button
          >
          <b-button
            type="button"
            variant="danger"
            class="m-1"
            @click="cancleReply"
            >취소</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <!-- 댓글이 있으면 -->
    <b-row class="mb-1" v-if="isReplier && !isModifying">
      <b-col class="text-right">
        <b-button
          variant="outline-info"
          size="sm"
          @click="modifyReply"
          class="mr-2"
          >답글수정</b-button
        >
        <b-button variant="outline-danger" size="sm" @click="deleteReply"
          >답글삭제</b-button
        >
      </b-col>
    </b-row>
    <b-row class="mb-1" v-if="isReplied && !isModifying">
      <b-col>
        <b-card
          :header-html="`<div><h6>${article.replier}님의 답변</div><div>${article.replyregtime}</h6></div>`"
          class="mb-2"
          border-variant="dark"
          no-body
        >
          <b-card-body class="text-left">
            <div v-html="replymsg"></div>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import moment from "moment";
import { getArticle, deleteArticle } from "@/api/qna";
import { mapState } from "vuex";
import http from "@/api/http";
const memberStore = "memberStore";

export default {
  name: "QnaDetail",
  data() {
    return {
      article: {},
      isWriter: false,
      isReplied: false,
      isReplier: false,
      isModifying: false,
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
    message() {
      if (this.article.content)
        return this.article.content.split("\n").join("<br>");
      return "";
    },
    replymsg() {
      console.log(this.article.reply);
      if (this.article.reply)
        return this.article.reply.split("\n").join("<br>");
      return "";
    },
  },
  created() {
    getArticle(
      this.$route.params.articleno,
      (response) => {
        this.article = response.data;
        http.get(`/qna/hit/${this.article.articleno}`).then(() => {
          if (this.article.reply) {
            this.isReplied = true;
            if (
              this.userInfo &&
              this.article.replier === this.userInfo.userid
            ) {
              this.isReplier = true;
            }
          }
          if (this.userInfo && this.userInfo.userid === this.article.userid) {
            this.isWriter = true;
          }
        });
      },
      (error) => {
        console.log("삭제시 에러발생!!", error);
      },
    );
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      let err = true;
      let msg = "";
      !this.article.content &&
        ((msg = "답변 내용을 입력해주세요"),
        (err = false),
        this.$refs.content.focus());

      if (!err) alert(msg);
      else this.submitReply();
    },
    submitReply() {
      http
        .post(`/qna/reply/${this.article.articleno}`, {
          articleno: this.article.articleno,
          replier: this.userInfo.userid,
          reply: this.article.reply,
        })
        .then(({ data }) => {
          let msg = "댓글 등록 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "댓글 등록이 완료되었습니다.";
          }
          alert(msg);
          location.reload(true);
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
      if (confirm("정말로 글을 삭제하시겠습니까?")) {
        deleteArticle(this.article.articleno, () => {
          this.$router.push({ name: "qnaList" });
        });
      }
    },
    modifyReply() {
      this.isModifying = true;
    },
    cancleReply() {
      this.isModifying = false;
    },
    deleteReply() {
      if (confirm("정말로 답글을 삭제하시겠습니까?")) {
        http
          .delete(`/qna/reply/delete/${this.article.articleno}`)
          .then(({ data }) => {
            let msg = "답글 삭제 처리시 문제가 발생했습니다.";
            if (data === "success") {
              msg = "답글 삭제가 완료되었습니다.";
              alert(msg);
              location.reload(true);
            } else alert(msg);
          });
      }
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
