import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "@material-ui/core";

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

const CustomAppBar = (props) => (
  <>
    <ElevationScroll {...props}>
      <AppBar position="fixed" style={{ background: "#35d219" }}>
        <Toolbar>
          <Button component={Link} to="/">
            Home
          </Button>
          <Button component={Link} to="/add">
            Add my animal
          </Button>
          <Button component={Link} to="/leadership">
            Leadership Board
          </Button>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  </>
);

export default CustomAppBar;
