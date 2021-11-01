import {
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import BarChartIcon from "@material-ui/icons/BarChart";
import React from "react";
import "./AddAnimal.css";
import CustomAppBar from "./CustomAppBar";

const API_BASE = "https://us-central1-bgn-hack21-7005.cloudfunctions.net";
// const API_BASE = "http://localhost:5001/bgn-hack21-7005/us-central1";

function AddAnimal() {
  // Files to upload
  const [animalName, setAnimalName] = React.useState("");
  const [exactName, setExactName] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);
  const [predictions, setPredictions] = React.useState(null);
  const [coords, setCoords] = React.useState(null);

  const userRef = React.useRef();
  const locationRef = React.useRef();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!coords)
      navigator.geolocation.getCurrentPosition((p) => {
        console.log("Latitude is :", p.coords.latitude);
        console.log("Longitude is :", p.coords.longitude);
        setCoords({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        });
      });
  }, [coords]);

  // Handle file change
  const handleFileChange = (event, type) => {
    console.log(event);
    console.log(type);
    event.persist();

    // Add the files to the state
    if (type === "image") {
      const file = event.target.files[0];
      setImageFile(file);
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  const handlePredict = () => {
    console.log("Add files");
    setLoading(true);

    // Create the form data and send it
    const animalData = new FormData();
    // Append the files
    if (imageFile) {
      animalData.append("imageFile", imageFile);
    }

    // Send a POST fetch request with the data
    fetch(`${API_BASE}/app/api/predict`, {
      method: "POST",
      body: animalData,
    })
      .then(async (res) => {
        const data = await res.json();
        console.log("Best prediction: ", data.predictions[0].className);

        console.log("Response: ", data);
        setAnimalName(String(data.animalName).toUpperCase());
        setPredictions(data.predictions);
        setExactName(String(data.predictions[0].className).toLowerCase());
        setLoading(false);
        alert("Predicted animal");
      })
      .catch(() => {
        setLoading(false);
        alert("An error occurred");
      });
  };

  const handleAdd = () => {
    console.log("Add files");
    setLoading(true);

    // Create the form data and send it
    const animalData = new FormData();
    animalData.append("username", userRef.current.value);
    animalData.append("animalName", animalName);
    animalData.append("exactName", exactName);
    animalData.append("predictions", JSON.stringify(predictions));

    animalData.append("location", locationRef.current.value);
    animalData.append("coords", JSON.stringify(coords));

    // Display the key/value pairs
    for (var pair of animalData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    // Append the files
    if (imageFile) {
      animalData.append("imageFile", imageFile);
    }
    // Send a POST fetch request with the data
    fetch(`${API_BASE}/app/api/animals`, {
      method: "POST",
      body: animalData,
    })
      .then(async (res) => {
        setLoading(false);
        alert("Added animal");
        const data = await res.json();
        console.log(data);
        const link = window.location.origin + "/animals/" + data.id;
        console.log(link);
        window.location = link;
      })
      .catch(() => {
        setLoading(false);
        alert("An error occurred");
      });
  };

  return (
    <>
      <CustomAppBar />
      <div
        className="decoration-div"
        style={{ textAlign: "center", marginBottom: "-250px" }}
      >
        <div className="inner-decoration">
          <br />
          {loading && <CircularProgress style={{ color: "#1976d2" }} />}
        </div>
      </div>
      <div className="paper-container">
        <div className="add-container">
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Typography>
              Take or upload an image of your animal to begin identification!
            </Typography>
            <Grid item xs={12}>
              {!selectedFile && (
                <>
                  <input
                    accept="image/*"
                    id="image-file"
                    type="file"
                    onChange={(event) => handleFileChange(event, "image")}
                    hidden
                  />
                  <label htmlFor="image-file">
                    <Button
                      variant="contained"
                      className="primary"
                      startIcon={<PhotoCamera />}
                      component="span"
                    >
                      Capture/Upload Image
                    </Button>
                  </label>
                </>
              )}
              {selectedFile && (
                <>
                  <img
                    style={{
                      maxWidth: "100%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    alt=""
                    src={selectedFile}
                  />
                  <Button
                    variant="outlined"
                    className="primary"
                    startIcon={<BarChartIcon />}
                    component="span"
                    onClick={handlePredict}
                  >
                    Classify
                  </Button>
                </>
              )}
            </Grid>

            <Typography>
              We will predict the type of animal (feel free to edit this if it
              is incorrect):
            </Typography>
            <Grid item xs={12}>
              <TextField
                label="Animal Name"
                required
                id="animal-name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={animalName}
                onChange={(event) => setAnimalName(event.target.value)}
              />
            </Grid>

            {!predictions ? (
              <Typography>
                We want to be as accurate as possible, so let us guess exact
                species:
              </Typography>
            ) : (
              <p>
                We're{" "}
                <b>{String(predictions[0].probability * 100).split(".")[0]}%</b>{" "}
                sure about this animal. If this is wrong tell us by changing it
                below!
              </p>
            )}
            <Grid item xs={12}>
              <TextField
                label="Exact Name"
                required
                id="animal-exact-name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={exactName}
                onChange={(event) => setExactName(event.target.value)}
              />
            </Grid>

            <Typography>Where did you spot this animal?</Typography>
            <Grid item xs={12}>
              <TextField
                label="Animal Location"
                required
                id="animal-location"
                fullWidth
                margin="normal"
                variant="outlined"
                inputRef={locationRef}
              />
            </Grid>

            <Typography>Enter your username to gain your point:</Typography>
            <Grid item xs={12}>
              <TextField
                label="Username"
                required
                id="user-name"
                fullWidth
                margin="normal"
                variant="outlined"
                inputRef={userRef}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                id="add-animal"
                variant="contained"
                className="secondary"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Submit Animal
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default AddAnimal;
