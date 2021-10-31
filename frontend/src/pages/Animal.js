import "@google/model-viewer";
import { Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
// import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import PropTypes from "prop-types";
import React from "react";
import { getAnimal } from "../services/searchQuery";
import "./ARView.css";
import Map from "./Map";

// const ARView = (props) => {
//   return (
//     <div className="imgbox">
//       <model-viewer
//         className="center-fit"
//         style={{ width: "80vw", height: "60vh", maxWidth: "500px" }}
//         src={props.glb}
//         alt="Astronaut - replace this with the releveant info"
//         auto-rotate
//         camera-controls
//         ar
//         ar-scale="auto"
//         ar-modes="webxr scene-viewer quick-look"
//         ios-src={props.usdz}
//         // TODO: Use the image of the product as the poster when the model is loading
//       >
//         <Button
//           className="secondary"
//           slot="ar-button"
//           style={{ position: "absolute", bottom: 0, left: 0 }}
//         >
//           View in AR
//         </Button>
//       </model-viewer>
//     </div>
//   );
// };

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

const location = {
  address: "KwaZulu-Natal Beach",
  lat: -29.621299164688523,
  lng: 31.151602089572492,
};

function Animal(props) {
  const id = props.match.params.animalId;
  const [fetched, setFetched] = React.useState(false);
  const [animal, setAnimal] = React.useState({});

  React.useEffect(() => {
    if (!fetched) {
      // fetch from the api..
      // set products when received
      console.log("fetching product", id);
      getAnimal(id).then((data) => {
        setAnimal(data);
        console.log(animal);
        setFetched(true);
      });
    }
  }, [fetched, id, animal]);

  return (
    <div>
      {/* App bar */}
      <ElevationScroll {...props}>
        <AppBar position="fixed" style={{ background: "#35d219" }}>
          <Toolbar>
            {/* <img
              src={Logo}
              alt="logo"
              style={{ maxHeight: "30px", paddingRight: "15px" }}
            /> */}
            <Typography component="h3">Animal Explore</Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      {/* Main view view */}
      {fetched && (
        <div style={{ marginTop: "50px", padding: "80px 20px" }}>
          {/* <p>Got animal ID: {props.match.params.animalId}</p> */}
          <Grid container spacing={3}>
            {/* Product details */}
            <Grid item md>
              <Card className="details-wrapper">
                <CardContent>
                  <h1>{animal.name}</h1>
                  <br />
                  <div
                    style={{
                      height: "200px",
                      width: "100%",
                      padding: "10px 0px",
                    }}
                  >
                    <img
                      src={animal.imageUrl}
                      style={{
                        maxHeight: "150px",
                        width: "100%",
                        objectFit: "contain",
                      }}
                      alt="robot"
                    ></img>
                  </div>
                  <p>{animal.description}</p>
                  <br />
                  <p>
                    <b>Tagged animals: </b>
                    {animal.taggedAnimals.toString()}
                  </p>
                  <br />
                  {animal.facts && (
                    <div>
                      <p>
                        <b>Fun facts</b>
                      </p>
                      {animal.facts.map((f, i) => (
                        <p>
                          {i}: {f}
                        </p>
                      ))}
                    </div>
                  )}
                  <p>
                    <b>Score:</b> {animal.score}
                  </p>
                  <br />
                  <p>Uploaded by {animal.username}</p>
                  <br />
                  {/* <Button
                    className="primary"
                    onClick={() => alert("Added to cart!")}
                  >
                    Add to cart
                  </Button> */}
                </CardContent>
              </Card>
            </Grid>
            {/* AR view wrapper */}
            {/* <Grid item md>
              <Card className="ar-wrapper">
                <CardContent>
                  <h3>3D Viewer</h3>
                  <ARView
                    glb={product.models.glb_link}
                    usdz={product.models.usdz_link}
                  />
                </CardContent>
              </Card>
            </Grid> */}
            {/* Map details */}
            <Grid item md>
              <Card className="details-wrapper ">
                <CardContent>
                  <h3>Habitat and Location Info</h3>
                  <br />
                  <div style={{ width: "100%", textAlign: "center" }}>
                    [ANIMAL HEATMAP]
                  </div>
                  <br />
                  <br />
                  <h3>Upload Location</h3>
                  <br />
                  <p>Location: {location.address}</p>
                  <br />
                  <p>Latitude/longitude: {`${location.lat}/${location.lng}`}</p>
                  <br />
                  <Map location={location} zoomLevel={20} />
                  {/* <Button
                    className="primary"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
                      )
                    }
                  >
                    Open in Google Maps
                  </Button> */}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

export default Animal;
