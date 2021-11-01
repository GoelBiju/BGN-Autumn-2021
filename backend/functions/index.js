const functions = require("firebase-functions");
const admin = require("firebase-admin");

const express = require("express");
const cors = require("cors");
const fileParser = require("express-multipart-file-parser");

const { getImageTags } = require("./utils/cloud");

// Load mobilenet model
const tf = require("@tensorflow/tfjs");
const mobilenet = require("@tensorflow-models/mobilenet");
const jpeg = require("jpeg-js");

const NUMBER_OF_CHANNELS = 3;

// Used code from: https://gist.github.com/jthomas/145610bdeda2638d94fab9a397eb1f1d
const imageByteArray = (image, numChannels) => {
  const pixels = image.data;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++) {
    for (let channel = 0; channel < numChannels; ++channel) {
      values[i * numChannels + channel] = pixels[i * 4 + channel];
    }
  }

  return values;
};

const imageToInput = (image, numChannels) => {
  const values = imageByteArray(image, numChannels);
  const outShape = [image.height, image.width, numChannels];
  const input = tf.tensor3d(values, outShape, "int32");

  return input;
};

console.log("MobileNet version:", mobilenet.version);
const model = mobilenet.load({ version: 2, alpha: 0.5 });

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "bgn-hack21-7005.appspot.com", // Specify the storage bucket name
});

// Get the Google Cloud storage bucket object
const bucket = admin.storage().bucket();

const app = express();
const db = admin.firestore();

app.use(cors({ origin: true }));
app.use(fileParser);

// FUNCTIONAL
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

// FUNCTIONAL
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

// FUNCTIONAL
app.post("/api/predict", async (req, res) => {
  try {
    console.log("Hit endpoint");
    // Check and the parse the files
    if (req.files.length > 0) {
      // Get the image
      const image = req.files.filter((f) => f.fieldname === "imageFile")[0];

      // Get image tags.
      const taggedAnimals = await getImageTags(image.buffer);

      if (taggedAnimals) {
        // Convert to pixel
        const pixels = jpeg.decode(image.buffer);
        // console.log("Pixels: ", pixels);
        const tensor = imageToInput(pixels, NUMBER_OF_CHANNELS);
        console.log("Tensor: ", tensor);

        // TODO: Needs to implement transfer learning when image was
        //       incorrectly by the model?
        const predictions = await (await model).classify(tensor);
        console.log("Predictions: ", predictions);

        res.json({
          animalName: taggedAnimals[0],
          predictions,
        });
      } else {
        res.status(500).send("Unable to get image tags");
      }
    } else {
      res.status(403).send("No image files received.");
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

// FUNCTIONAL
app.post("/api/animals", async (req, res) => {
  try {
    console.log("Hit endpoint");
    // Get the relevant information

    const username = req.body["username"];
    const animalName = req.body["animalName"];
    const exactName = req.body["exactName"];
    const predictions = JSON.parse(req.body["predictions"]);
    const location = req.body["location"];
    const coords = JSON.parse(req.body["coords"]);

    // Check and the parse the files
    if (req.files.length > 0) {
      // Get the image
      const image = req.files.filter((f) => f.fieldname === "imageFile")[0];

      // Upload the image to storage.
      const imageUrl = await uploadFileToStorage(image);
      console.log("Result of image: ", imageUrl);

      // Get image tags.
      if (imageUrl) {
        const taggedAnimals = await getImageTags(imageUrl);
        console.log("Tagged animals: ", taggedAnimals);

        if (taggedAnimals) {
          const docRef = db.collection("animals").doc();

          // description: The Vizsla is a versatile, red-coated gundog built for long days in the field. For centuries these rugged but elegant athletes have been the pride of Hungarian sportsmen, and their popularity in America increases with each passing year.
          // fact 1. A domesticated descendant of the wolf, characterised by an upturning tail. The dog derived from an ancient, extinct wolf, and the modern grey wolf is the dog's nearest living relative.
          // fact 2. Vizslas form a tight bond with their owners and hate to be left alone
          // fact 3. They can stand between 21 to 24 inches at the shoulder and are the picture of a lean, light-footed hunter's companion
          const dogDesc =
            "The Vizsla is a versatile, red-coated gundog built for long days in the field. For centuries these rugged but elegant athletes have been the pride of Hungarian sportsmen, and their popularity in America increases with each passing year.";
          const dogFacts = [
            "A domesticated descendant of the wolf, characterised by an upturning tail. The dog derived from an ancient, extinct wolf, and the modern grey wolf is the dog's nearest living relative.",
            "Vizslas form a tight bond with their owners and hate to be left alone",
            "They can stand between 21 to 24 inches at the shoulder and are the picture of a lean, light-footed hunter's companion",
          ];

          var today = new Date();
          var date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          var time =
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          var dateTime = date + " " + time;

          const animal = {
            name: animalName,
            exactName,
            imageUrl,
            username,
            location,
            coords,
            predictions,
            taggedAnimals,
            description: animalName === "DOG" ? dogDesc : "",
            facts: animalName === "DOG" ? dogFacts : [],
            score: 1,
            dateTime,
          };
          console.log("Animal info: ", animal);

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

app.get("/api/", async (req, res) => {
  res.send("Working");
});

exports.app = functions.https.onRequest(app);
