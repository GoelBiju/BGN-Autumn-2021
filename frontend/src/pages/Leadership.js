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
  import PropTypes from "prop-types";
  import React from "react";
  import { Link } from "react-router-dom";
  import Logo from "../assets/logo512.png";
  import { Table } from "@material-ui/core";
  import "./AddAnimal.css";
  import "./Leadership.css"
  
  import { Paper } from "@material-ui/core";
  import { TableBody } from "@material-ui/core";
  import { TableCell } from "@material-ui/core";
  import { TableContainer } from "@material-ui/core";
  import { TableHead } from "@material-ui/core";
  import { TablePagination } from "@material-ui/core";
  import { TableRow } from "@material-ui/core";
  

  function createData(Country, Name, Points, Contributions) {
    return { Country, Name, Points, Contributions};
  }
  const rows = [
    createData('USA', 'Jimmy', 520, 50),
    createData('UK', 'Billy', 440, 45),
    createData('India', 'John', 400, 42),
    createData('Peru', 'Jack', 398, 41),

  ];
  
  function LeadershipElevationScroll(props) {


        
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
  
  LeadershipElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };
  
  function Leadership(props) {
    // Files to upload
    const [imageFile, setImageFile] = React.useState(null);
    const [modelFiles, setModelFiles] = React.useState({
      glb: null,
      usdz: null,
    });
  
    const userRef = React.useRef();
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
      console.log(event, type);
      event.persist();
  
      // Add the files to the state
      if (type === "image") {
        setImageFile(event.target.files[0]);
      } else if (type === "models") {
        Array.from(event.target.files).forEach((file) => {
          if (file.name.endsWith(".glb")) {
            console.log("Match");
            setModelFiles((prev) => ({ ...prev, glb: file }));
          } else if (file.name.endsWith(".usdz")) {
            setModelFiles((prev) => ({ ...prev, usdz: file }));
          }
        });
      }
    };
  
    const handleAdd = () => {
      console.log("Add files");
      setLoading(true);
  
      // Create the form data and send it
      const animalData = new FormData();
      animalData.append("username", userRef.current.value);
      
      // Display the key/value pairs
      for (var pair of animalData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
  
      // Append the files
      if (imageFile) {
        animalData.append("imageFile", imageFile);
      }
  
      // if (modelFiles.glb) {
      //   productData.append("glbFile", modelFiles.glb);
      // }
  
      // if (modelFiles.usdz) {
      //   productData.append("usdzFile", modelFiles.usdz);
      // }
  
      // Send a POST fetch request with the data
      // "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/animals",
      // http://localhost:5001/bgn-hack21-7005/us-central1/app/api/animals
      fetch(
        "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/animals",
        {
          method: "POST",
          body: animalData,
        }
      )
        .then(() => {
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
        <LeadershipElevationScroll {...props}>
          <AppBar position="fixed" style={{ background: "#35d219" }}>
            <Toolbar>
              {/* <img
                src={Logo}
                alt="logo"
                style={{ maxHeight: "30px", paddingRight: "15px" }}
              /> */}
              <Typography component="h3">Animal Explore Leaderboard</Typography>
            </Toolbar>
          </AppBar>
        </LeadershipElevationScroll>
        <div
          className="decoration-div"
          style={{ textAlign: "center", marginBottom: "-250px" }}
        >
          <div className="inner-decoration">
            <p style={{ fontSize: "x-large" }}>You are 3rd in the world</p>
            <br />
            {loading && <CircularProgress style={{ color: "#1976d2" }} />}
          </div>
        </div>
        




        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Country</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Number of Points</TableCell>
                <TableCell align="right">Number of Contributions</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {row.Country}
                </TableCell>
                <TableCell align="right">{row.Name}</TableCell>
                <TableCell align="right">{row.Points}</TableCell>
                <TableCell align="right">{row.Contributions}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
      </>
    );
  }
  
  export default Leadership;
  