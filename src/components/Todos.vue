<template>
  <div class="todos">
    <input
      type="text"
      v-model="newTodo"
      @keypress.enter="addTodo"
      placeholder="Add a new todo..."
    />
    <div v-if="todos.length">
      <ul>
        <li v-for="todo in todos" :key="todo.id">
          <div v-if="editState">
            <form @submit.prevent="saveEditedTodo(todo)" class="form-edit">
              <input type="text" v-model="todo.todo" class="todo-input" />
              <button class="icon-save">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon-save"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
              </button>
            </form>
          </div>
          <div v-else class="todo-item">
            <span>{{ todo.todo }}</span>
            <div class="icon-group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon-edit"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                @click="editTodo"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon-delete"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                @click="deleteTodo(todo.id)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else>Woohoo, nothing left todo!</div>
    <!-- <div v-else><Spinner /></div> -->
  </div>
</template>

<script>
import { ref } from "vue";
import useFirestore from "../composables/useFirestore";
import { db } from "../firebase/config";
import { Spinner } from "./Spinner.vue";

export default {
  components: { Spinner },
  // we must put props in the argument even it is not applied
  setup(props, { emit }) {
    const { todos, error, load } = useFirestore("vue-animations-todos");
    const editState = ref(false);

    load();

    const newTodo = ref("");

    const addTodo = () => {
      if (newTodo.value) {
        const id = Math.random();
        // todos.value = [{ text: newTodo.value, id }, ...todos.value]
        db.collection("vue-animations-todos").add({
          todo: newTodo.value,
          id: Date.now(),
        });
        newTodo.value = "";
      } else {
        emit("badValue");
      }
    };

    const saveEditedTodo = (todo) => {
      db.collection("vue-animations-todos")
        .doc(todo.id)
        .update({ todo: todo.todo });

      editState.value = false;      
    };

    const editTodo = () => {
      // const selectedTodo =
      editState.value = true;
    };

    const deleteTodo = (id) => {
      const r = confirm("Are you sure to delete this todo permanently ? 🙄");
      if (r == true) {
        // todos.value = todos.value.filter(todo => todo.id != id)
        db.collection("vue-animations-todos")
          .doc(id)
          .delete();
      } else {
        return;
      }
    };

    return { todos, addTodo, editTodo, deleteTodo, newTodo, editState, saveEditedTodo };
  },
};
</script>

<style>
.todos {
  max-width: 400px;
  margin: 20px auto;
  position: relative;
}
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.todos ul {
  position: relative;
  padding: 0;
}
.todos li {
  list-style-type: none;
  /* display: flex;
  justify-content: space-between; */
  margin-bottom: 10px;
  padding: 10px;
  background: white;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
}
.todos li:hover {
  cursor: pointer;
}
.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-group {
  margin-left: auto;
}
.icon-save,
.icon-edit,
.icon-delete {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
.icon-save {
  border: none;
  outline: none;
  background: none;
  /* margin-left: 0; */
}
.form-edit {
  display: flex;
  align-items: center;
}
.todo-input {
  margin: 0;
  padding: 6px;
  width: 90%;
}
</style>
