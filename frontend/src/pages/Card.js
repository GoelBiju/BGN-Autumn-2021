import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    minWidth: 220,
    padding: "5px 5px 10px 5px",
    boxShadow: "4px 3px 8px 1px #969696",
    webkitBoxShadow: "4px 3px 8px 1px #969696",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function AnimalCard(props) {
  const classes = useStyles();
  const animal = props.animal;
  // const names = ["Jaafar Rammal", "Jennifer Smith"];
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {animal.name}
        </Typography>
        <Typography>Exact Name:</Typography>
        <div style={{ height: "200px", width: "100%", padding: "10px 0px" }}>
          <img
            src={animal.imageUrl}
            style={{ maxHeight: "150px", width: "100%", objectFit: "contain" }}
            alt=""
          ></img>
        </div>
        <Typography>
          <i>Uploaded by</i>: {animal.username}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          component={RouterLink}
          to={`/animals/${props.p_id}`}
          variant="contained"
          className="primary"
        >
          Learn
        </Button>
      </CardActions>
    </Card>
  );
}

export default AnimalCard;
