// export function searchByWord(word) {
//   return new Promise((resolve, reject) => {
//     let query =
//       "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/search/" +
//       word;
//     console.log("Query", query);
//     fetch(query, { method: "GET" })
//       .then((documents) => documents.json().then((data) => resolve(data)))
//       .catch((err) => reject(err));
//   });
// }

// export function searchByImage(file) {
//   return new Promise((resolve, reject) => {
//     // Get the file
//     let formData = new FormData();
//     formData.append("image", file);
//     console.log("Image: ", file);

//     let query =
//       "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/upload";
//     console.log("Query", query);
//     fetch(query, { method: "POST", body: formData })
//       .then((documents) => documents.json().then((data) => resolve(data)))
//       .catch((err) => reject(err));
//   });
// }

export function getAllAnimals() {
  return new Promise((resolve, reject) => {
    let query =
      "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/animals";
    console.log("Query", query);
    fetch(query, { method: "GET" })
      .then((documents) => documents.json().then((data) => resolve(data)))
      .catch((err) => reject(err));
  });
}

export function getAnimal(id) {
  return new Promise((resolve, reject) => {
    let query =
      "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/animals/" +
      id;
    console.log("Query", query);
    fetch(query, { method: "GET" })
      .then((documents) => documents.json().then((data) => resolve(data)))
      .catch((err) => reject(err));
  });
}
