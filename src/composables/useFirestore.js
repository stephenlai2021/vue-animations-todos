import { db } from "../firebase/config";
import { ref } from "vue";

const useFirestore = (collection) => {
  const error = ref(null);
  const todos = ref([]);

  // we must create a separate function (e.g. load()) to fetch firestore 
  const load = async () => {
    try {
      await db.collection(collection).onSnapshot((snap) => {

        // method 1: use map() to loop through a collection of documents
        todos.value = snap.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        // methods 2: use forEach to loop through a collection of documents
        // let docs = [];
        // snap.forEach((doc) => {
        //   docs.push({
        //     ...doc.data(),
        //     id: doc.id,
        //   });
        // });
        // todos.value = docs;
      });
    } catch (err) {
      // if there is an error, firebase will send back the error messages
      error.value = err.message;
    }
  };

  return { todos, error, load };
};

export default useFirestore;
