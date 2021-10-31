const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");
const fileParser = require("express-multipart-file-parser");

// const { service } = require("firebase-functions/lib/providers/analytics");
// const Product = require("./modules/product.js");
// const Animal = require("./modules/animal.js");

const { getImageTags } = require("./utils/cloud");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "bgn-hack21-7005.appspot.com", // Specify the storage bucket name
});

// Get the Google Cloud storage bucket object
const bucket = admin.storage().bucket();

// // Allow cors GET requests from our deployed page
// // (for the model viewer to load the model files from the bucket)
// const configureBucketCors = async () => {
//   let method = ["GET"];
//   let origin = ["https://virtual-market.web.app"];
//   let responseHeader = ["Content-Type"];

//   await bucket.setCorsConfiguration([
//     {
//       maxAgeSeconds: 3600,
//       method,
//       origin,
//       responseHeader,
//     },
//   ]);

//   console.log(
//     `Bucket ${bucket.name} was updated with a CORS config to allow ${method} requests from ${origin} sharing ${responseHeader} responses across origins`
//   );
// };

// TODO: Need to do this to enable upload
// configureBucketCors();

const app = express();
const db = admin.firestore();

app.use(cors({ origin: true }));
app.use(fileParser);

// // Remove duplicates in array
// function arrayUnique(array) {
//   let a = array.concat();
//   for (let i = 0; i < a.length; ++i) {
//     for (let j = i + 1; j < a.length; ++j) {
//       if (a[i] === a[j]) a.splice(j--, 1);
//     }
//   }

//   return a;
// }

//FUNCTIONAL
app.get("/api/animals/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const animal = await db.collection("animals").doc(id);
    const data = await animal.get();
    if (!data.exists) {
      res.status(404).send("No such animal has been found");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//FUNCTIONAL
app.get("/api/animals", async (req, res) => {
  try {
    console.log("Fetching data");
    const animals = await db.collection("animals").get();
    const animalsArray = [];
    if (animals.empty) {
      res.status(404).send("No records found");
    } else {
      animals.forEach((doc) => {
        animalsArray.push({ id: doc.id, data: doc.data() });
      });
      res.send(animalsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//FUNCTIONAL
app.post("/api/predict", async (req, res) => {
  try {
    console.log("Hit endpoint");
    // Check and the parse the files
    if (req.files.length > 0) {
      // Get the image
      const image = req.files.filter((f) => f.fieldname === "imageFile")[0];
      // Upload the image to storage.
      const imageUrl = await uploadFileToStorage(image);
      console.log("Result of image: ", imageUrl);

      // Get image tags.
      if (imageUrl) {
        const imageTags = await getImageTags(imageUrl);

        if (imageTags) {
          // Get the combined tags from the cloud vision API and the product tags provided
          // let combinedTags = arrayUnique(productTags.concat(imageTags));

          res.json({
            image_link: imageUrl,
            imageTags,
          });
        } else {
          res.status(500).send("Unable to get image tags");
        }
      } else {
        res.send("No image url provided");
      }
    } else {
      res.status(403).send("No image/model files received.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    console.log("Fetching data");
    const users = await db.collection("users").get();
    const usersArray = [];
    if (users.empty) {
      res.status(404).send("No records found");
    } else {
      users.forEach((doc) => {
        usersArray.push({ id: doc.id, data: doc.data() });
      });
      res.send(usersArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//FUNCTIONAL
app.post("/api/animals", async (req, res) => {
  try {
    console.log("Hit endpoint");
    // Get the relevant information
    // const name = req.body["name"];
    // const description = req.body["description"];
    // const price = Number(req.body["price"]);
    // const quantity = Number(req.body["quantity"]);
    // const productTags = req.body["tags"].split(",").map((i) => i.trim());

    const username = req.body["username"];

    // Check and the parse the files
    if (req.files.length > 0) {
      // Get the image
      const image = req.files.filter((f) => f.fieldname === "imageFile")[0];

      // // Get models
      // const glbModel = req.files.filter((f) => f.fieldname === "glbFile");
      // const usdzModel = req.files.filter((f) => f.fieldname === "usdzFile");

      // Upload the image to storage.
      const imageUrl = await uploadFileToStorage(image);
      console.log("Result of image: ", imageUrl);

      // // Upload the models.
      // let glbLink = "";
      // let usdzLink = "";
      // if (glbModel.length > 0) {
      //   glbLink = await uploadFileToStorage(glbModel[0]);
      // }

      // if (usdzModel.length > 0) {
      //   usdzLink = await uploadFileToStorage(usdzModel[0]);
      // }

      // Get image tags.
      if (imageUrl) {
        const taggedAnimals = await getImageTags(imageUrl);
        console.log("Tagged animals: ", taggedAnimals);

        if (taggedAnimals) {
          // TODO: Add the animals and return the added product information
          const docRef = db.collection("animals").doc();

          // Get the combined tags from the cloud vision API and the product tags provided
          // let combinedTags = arrayUnique(productTags.concat(imageTags));

          const animal = {
            name: String(taggedAnimals[0]).toUpperCase(),
            imageUrl,
            username,
            taggedAnimals,
            species: "",
            description: "",
            facts: [],
            score: 1,
          };

          //{
          // description,
          // price,
          // quantity,
          // models: {
          //   glb_link: glbLink,
          //   usdz_link: usdzLink,
          // },
          // }

          // Set the properties of the animal
          await docRef.set(animal);
          res.json({
            id: docRef.id,
            ...animal,
          });
        } else {
          res.status(500).send("Unable to get image tags");
        }
      } else {
        res.send("No image url provided");
      }
    } else {
      res.status(403).send("No image/model files received.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// NOT FUNCTIONAL
// app.post("/api/upload", async (req, res) => {
//   try {
//     if (req.files.length > 0) {
//       const image = req.files[0]; //image should be the first file we send.
//       uploadFileToStorage(image).then((imageUrl) => {
//         getImageTags(imageUrl)
//           .then((tags) => {
//             object_tags = tags;
//             getProductIDs(object_tags)
//               .then((return_ids) => {
//                 res.status(200).send(return_ids);
//               })
//               .catch((error) => res.status(400).send(error.message));
//           })
//           .catch((error) => res.status(500).send(error.message));
//       });
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// // NOT FUNCTIONAL
// app.get("/api/search/:query", async (req, res) => {
//   try {
//     query = req.params.query;
//     getProductIDs([query])
//       .then((return_ids) => {
//         res.status(200).send(return_ids);
//       })
//       .catch((error) => res.status(400).send(error.message));
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// //update a product
// app.put("/api/products/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = req.body;
//     const product = await db.collection("products").doc(id);
//     await product.update(data);
//     res.send("Product record updated.");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// // NOT FUNCTIONAL
// app.delete("/api/products/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     await db.collection("products").doc(id).delete();
//     res.status(400).send("Record deleted.");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// // NOT FUNCTIONAL
// app.post("/api/imgquery", async (req, res) => {
//   try {
//     const imgUrl = req.body["url"];
//     console.log(imgUrl);

//     // Get the image tags
//     getImageTags(imgUrl)
//       .then((object_tags) => {
//         getProductIDs(object_tags)
//           .then((product_ids) => {
//             res.status(200).send(product_ids);
//           })
//           .catch((error) => res.status(400).send(error.message));
//       })
//       .catch((error) => res.status(400).send(error.message));
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// app.post("/api/imgQueryUrl", async (req, res) => {
//   try {
//     const imgUrl = req.body["url"];
//     console.log(imgUrl);

//     // Get the image tags
//     getImageTags(imgUrl)
//       .then((object_tags) => {
//         res.status(200).json({ tags: object_tags });
//       })
//       .catch((error) => res.status(400).send(error.message));
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// Upload a file to storage - FUNCTIONAL
const uploadFileToStorage = (fileInfo) => {
  return new Promise((resolve, reject) => {
    let fileName = `${Date.now()}-${fileInfo.originalname}`;
    let fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: fileInfo.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.log(`Unable to upload file (${fileName}) to the storage bucket`);
      reject(null);
    });

    blobStream.on("finish", async () => {
      const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

      // Make the file public
      await bucket.file(fileName).makePublic();
      console.log(`Public Uploaded URL: ${url}`);

      resolve(url);
    });

    blobStream.end(fileInfo.buffer);
  });
};

// NOT FUNCTIONAL
// function getProductIDs(object_tags) {
//   return new Promise(function (resolve, reject) {
//     console.log("Checking tags: ", object_tags);

//     product_ids = [];

//     db.collection("products")
//       .get()
//       .then((products) => {
//         products.forEach((doc) => {
//           id = doc.id;
//           tags = doc.data().product_tags;
//           console.log(tags);

//           ans = object_tags.some(function (e1) {
//             return tags.includes(e1);
//           });
//           if (ans) {
//             product_ids.push({ id: doc.id, data: doc.data() });
//           }
//         });

//         resolve(product_ids);
//       })
//       .catch((error) => reject(error));
//   });
// }

// // ----------------------- SELLER ----------------------------

// // add a seller
// app.post("/api/sellers", (req, res) => {
//   (async () => {
//     try {
//       const latitude = req.body.latitude;
//       const longitude = req.body.longitude;
//       const owner = req.body["owner"];
//       const name = req.body["name"];
//       await db
//         .collection("sellers")
//         .doc()
//         .set({
//           name,
//           location: new admin.firestore.GeoPoint(
//             Number(latitude),
//             Number(longitude)
//           ),
//           owner,
//         });
//       res.send("Added successfully");
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   })();
// });

// //fetch all sellers
// app.get("/api/sellers", async (req, res, next) => {
//   try {
//     const sellers = await db.collection("sellers");
//     const data = await sellers.get();
//     const sellersArray = [];
//     if (data.empty) {
//       res.status(404).send("No sellers in the table");
//     } else {
//       data.forEach((doc) => {
//         const seller = new Seller(
//           doc.sellerID,
//           doc.data().location,
//           doc.data().name,
//           doc.data().owner
//         );
//         sellersArray.push(seller);
//       });
//       res.send(sellersArray);
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// //get by id
// app.put("/api/sellers/:id", async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const latitude = req.body.latitude;
//     const longitude = req.body.longitude;

//     const seller = await db.collection("sellers").doc(id);
//     await seller.update({
//       location: new admin.firestore.GeoPoint(
//         Number(latitude),
//         Number(longitude)
//       ),
//       name: req.body.name,
//       owner: req.body.owner,
//     });
//     res.send("Seller record updated.");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// //delete a seller
// app.delete("/api/sellers/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     await db.collection("sellers").doc(id).delete();
//     res.send("Record deleted successfuly");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// //get seller by id
// app.get("/api/sellers/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const seller = await db.collection("sellers").doc(id);
//     const data = await seller.get();
//     if (!data.exists) {
//       res.status(404).send("No such product has been found");
//     } else {
//       res.send(data.data());
//     }
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

app.get("/api/", async (req, res) => {
  res.send("Working");
});

exports.app = functions.https.onRequest(app);
