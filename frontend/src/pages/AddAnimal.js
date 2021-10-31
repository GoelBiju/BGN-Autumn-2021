import {
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import AddIcon from "@material-ui/icons/Add";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import BarChartIcon from '@material-ui/icons/BarChart';
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo512.png";
import "./AddAnimal.css";


// https://us-central1-bgn-hack21-7005.cloudfunctions.net/
// http://localhost:5001/bgn-hack21-7005/us-central1/
const API_BASE="https://us-central1-bgn-hack21-7005.cloudfunctions.net/"

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

function AddAnimal(props) {
  // Files to upload
  const [animalName, setAnimalName] = React.useState("")
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);
  const [modelFiles, setModelFiles] = React.useState({
    glb: null,
    usdz: null,
  });

  const userRef = React.useRef();
  const nameRef = React.useRef();
  const locationRef = React.useRef();
  // const descriptionRef = React.useRef();
  // const priceRef = React.useRef();
  // const quantityRef = React.useRef();
  // const tagsRef = React.useRef();

  const [loading, setLoading] = React.useState(false);

  // React.useEffect(() => {
  //   console.log("Current files: ", imageFile, modelFiles);
  // }, [imageFile, modelFiles]);

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
      setAnimalName(file)
    }
  };

  const handlePredict = () => {
    console.log("Add files");
    setLoading(true);

    // Create the form data and send it
    const productData = new FormData();
    // Append the files
    if (imageFile) {
      productData.append("imageFile", imageFile);
    }
    // TODO: Ensure POST request works...
    // Send a POST fetch request with the data
    fetch(
      `${API_BASE}/app/api/predict`,
      {
        method: "POST",
        body: productData,
      }
    )
      .then((res) => {
        console.log(res);
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
    animalData.append("animalName", nameRef.current.value); //TODO: Check this value in DB. 
    // productData.append("description", descriptionRef.current.value);
    // productData.append("price", priceRef.current.value);
    // productData.append("quantity", quantityRef.current.value);
    // productData.append("tags", tagsRef.current.value);

    // Display the key/value pairs
    for (var pair of animalData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    // Append the files
    if (imageFile) {
      animalData.append("imageFile", imageFile);
    }

    // TODO: Ensure POST request works...
    // Send a POST fetch request with the data
    fetch(
      `${API_BASE}/app/api/animals`,
      {
        method: "POST",
        body: animalData,
      }
    )
      .then((res) => {
        console.log(res);
        setLoading(false);
        alert("Added animal");

        const link = window.location.origin + "/";
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
      <ElevationScroll {...props}>
        <AppBar position="fixed" style={{ background: "#35d219" }}>
          <Toolbar>
            <img
              src={Logo}
              alt="logo"
              style={{ maxHeight: "30px", paddingRight: "15px" }}
            />
            <Typography component="h3">Animal Explore</Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div
        className="decoration-div"
        style={{ textAlign: "center", marginBottom: "-250px" }}
      >
        <div className="inner-decoration">
          <p style={{ fontSize: "x-large" }}>Upload your animal!</p>
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
            <Typography>Enter your username:</Typography>
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

            <Typography>Upload an image of your product:</Typography>
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
                      Upload Image
                    </Button>
                  </label>
                </>
              )}
              {selectedFile && (
                <>
                <img style={{ "maxWidth": "100%", "marginLeft": "auto", "marginRight": "auto"}} src={selectedFile} />
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

            <Grid item xs={12}>
              <TextField
                label="Animal Name"
                required
                id="animal-name"
                fullWidth
                margin="normal"
                variant="outlined"
                inputRef={nameRef}
                value={animalName}
                onChange={(event) => setAnimalName(event.target.value)}
              />
            </Grid>

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

            <Grid item xs={12}>
              <Button
                id="add-product"
                variant="contained"
                className="secondary"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default AddAnimal;
