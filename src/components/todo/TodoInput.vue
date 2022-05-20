<template>
  <b-container class="bv-example-row">
    <b-row class="text-center">
      <b-col>
        <b-input-group prepend="할일" class="mt-3">
          <b-form-input
            v-model.trim="todoTitle"
<<<<<<< HEAD
            @keypress.enter="registerTodo"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-success" @click="registerTodo"
=======
            @keypress.enter="createTodo"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-success" @click="createTodo"
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
              >등록</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
<<<<<<< HEAD
import { mapActions } from "vuex";

const todoStore = "todoStore";

=======
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
export default {
  name: "TodoInput",
  data() {
    return {
      todoTitle: "",
    };
  },
  methods: {
<<<<<<< HEAD
    ...mapActions(todoStore, ["createTodo"]),
    registerTodo() {
=======
    createTodo() {
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
      //   console.log('Create Todo!!');
      //   console.log(this.$store);
      const todoItem = {
        title: this.todoTitle,
        completed: false,
      };
      //   this.$store.commit('CREATE_TODO', todoItem);
<<<<<<< HEAD
      if (todoItem.title) this.createTodo(todoItem);
      // this.$store.dispatch("createTodo", todoItem);

=======
      if (todoItem.title) this.$store.dispatch("createTodo", todoItem);
>>>>>>> 57b1d6c2ae20ba5f3e333c2b74e19dc83af08019
      this.todoTitle = "";
    },
  },
};
</script>

<style></style>
