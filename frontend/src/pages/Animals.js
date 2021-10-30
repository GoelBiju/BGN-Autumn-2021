import { CircularProgress } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import PhotoAlbum from "@material-ui/icons/PhotoAlbum";
import SearchIcon from "@material-ui/icons/Search";
import PropTypes from "prop-types";
import React from "react";
// import Logo from "../assets/logo512.png";
import {
  getAllAnimals,
  searchByImage,
  searchByWord,
} from "../services/searchQuery";
import AnimalCard from "./Card";
import "./Animals.css";
import { useStyles } from "./Styles";

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

function Animals(props) {
  const classes = useStyles();
  const searchRef = React.useRef();

  const [fetched, setFetched] = React.useState(false);
  const [animals, setAnimals] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!fetched) {
      // fetch from the api..
      // set animals when received
      setLoading(true);
      if (searchRef.current.value === "") {
        console.log("fetching all animals");
        getAllAnimals().then((animals) => {
          console.log("Got animals:", animals);
          setAnimals(animals);
          setFetched(true);
          setLoading(false);
        });
      } else {
        // search by word
        console.log("by word");
        searchByWord(searchRef.current.value).then((animals) => {
          setAnimals(animals);
          console.log(animals);
          setFetched(true);
          setLoading(false);
        });
      }
      // set once received
    }
  }, [fetched]);

  return (
    <>
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
      {/* Decoration container like Firebase one */}
      <div className="decoration-div" style={{ marginBottom: "-80px" }}>
        <div className="inner-decoration">
          <p style={{ fontSize: "x-large" }}>
            Animal exploration through visual learning
          </p>
          {/* <p style={{ fontSize: "small" }}>
            Connect with and support small businesses through our immersive
            shopping experience
          </p> */}
          <br />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              inputRef={searchRef}
            />
            <Button
              variant="contained"
              className="primary"
              style={{ position: "absolute" }}
              onClick={() => setFetched(false)}
            >
              Go
            </Button>
          </div>
          <div style={{ height: "10px" }} />
          <input
            accept="image/*"
            id="search-image-file"
            type="file"
            onChange={(event) => {
              setLoading(true);
              searchByImage(event.target.files[0]).then((animals) => {
                setAnimals(animals);
                console.log(animals);
                setLoading(false);
                // setFetched(true);
              });
            }}
            hidden
          />
          <label htmlFor="search-image-file">
            <Button
              variant="contained"
              className="primary"
              style={{
                marginBottom: "13px",
                padding: "6px 16px",
                marginRight: "13px",
              }}
              startIcon={<PhotoAlbum />}
              component="span"
            >
              Search by image
            </Button>
          </label>

          <Button
            className="secondary"
            variant="contained"
            style={{ marginBottom: "13px", padding: "6px 16px" }}
            onClick={() => {
              const link = window.location.origin + "/add";
              console.log(link);
              window.location = link;
            }}
          >
            Add your animal
          </Button>
          <br />
          <br />
          {loading && <CircularProgress style={{ color: "#1976d2" }} />}

          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div style={{ flexGrow: 1, overflow: "hidden", paddingTop: "10px" }}>
        <Grid container spacing={3} className="animals-list">
          {animals.length > 0 &&
            animals.map((animalData, index) => {
              return (
                <Grid item xs key={index}>
                  <AnimalCard
                    animal={animalData.data}
                    p_id={animalData.id}
                  ></AnimalCard>
                </Grid>
              );
            })}
        </Grid>
      </div>
    </>
  );
}

export default Animals;
