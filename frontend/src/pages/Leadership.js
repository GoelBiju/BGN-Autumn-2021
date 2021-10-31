import { CircularProgress } from "@material-ui/core";
import React from "react";
import { Table } from "@material-ui/core";
import "./Leadership.css";

import { Paper } from "@material-ui/core";
import { TableBody } from "@material-ui/core";
import { TableCell } from "@material-ui/core";
import { TableContainer } from "@material-ui/core";
import { TableHead } from "@material-ui/core";
import { TableRow } from "@material-ui/core";
import CustomAppBar from "./CustomAppBar";

function createData(Country, Name, Points, Contributions) {
  return { Country, Name, Points, Contributions };
}
const rows = [
  createData("USA", "Jimmy", 520, 50),
  createData("UK", "Billy", 440, 45),
  createData("India", "John", 400, 42),
  createData("Peru", "Jack", 398, 41),
];

function Leadership() {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!loaded) {
      // Send a POST fetch request with the data
      // "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/animals",
      // http://localhost:5001/bgn-hack21-7005/us-central1/app/api/animals
      fetch(
        "https://us-central1-bgn-hack21-7005.cloudfunctions.net/app/api/users",
        {
          method: "GET",
        }
      )
        .then((users) => {
          console.log("users: ", users);
          setLoaded(true);
        })
        .catch(() => {
          alert("An error occurred");
          setLoaded(true);
        });
    }
  }, [loaded]);

  return (
    <>
      <CustomAppBar />
      <div
        className="decoration-div"
        style={{ textAlign: "center", marginBottom: "-250px" }}
      >
        <div className="inner-decoration">
          <p style={{ fontSize: "x-large" }}>You are 3rd in the world</p>
          <br />
          {!loaded && <CircularProgress style={{ color: "#1976d2" }} />}
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
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
