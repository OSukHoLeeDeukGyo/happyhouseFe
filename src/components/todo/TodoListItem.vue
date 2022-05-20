<template>
  <b-container class="bv-example-row">
    <b-row class="mt-3">
      <b-col cols="11" class="bg-light p-2 pl-5 text-left">
<<<<<<< HEAD
        <span :class="{ completed: todo.completed }" @click="statusChange">{{
          todo.title
        }}</span>
      </b-col>
      <b-col class="p-2"
        ><b-button variant="danger" @click="cancelTodo">X</b-button></b-col
=======
        <span
          :class="{ completed: todo.completed }"
          @click="updateTodoStatus"
          >{{ todo.title }}</span
        >
      </b-col>
      <b-col class="p-2"
        ><b-button variant="danger" @click="deleteTodo">X</b-button></b-col
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
      >
    </b-row>
  </b-container>
</template>

<script>
<<<<<<< HEAD
import { mapActions } from "vuex";

const todoStore = "todoStore";
=======
// import { maxActions } from "vuex";
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019

export default {
  name: "TodoListItem",
  props: {
    todo: Object,
  },
  methods: {
<<<<<<< HEAD
    ...mapActions(todoStore, ["deleteTodo", "updateTodoStatus"]),
    cancelTodo() {
      // this.$store.dispatch("deleteTodo", this.todo);
      this.deleteTodo(this.todo);
    },
    statusChange() {
      // this.$store.dispatch("updateTodoStatus", this.todo);
      this.updateTodoStatus(this.todo);
=======
    // ...mapActions(["deleteTodo", "updateTodoStatus"])
    deleteTodo() {
      console.log("deleteTodo Call");
      this.$store.dispatch("deleteTodo", this.todo);
    },
    updateTodoStatus() {
      this.$store.dispatch("updateTodoStatus", this.todo);
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
    },
  },
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  font-style: italic;
  font-weight: bold;
}
</style>
