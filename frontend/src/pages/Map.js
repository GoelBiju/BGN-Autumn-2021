import React from "react";
import GoogleMaps from "google-map-react";
import "./Map.css";

const Map = ({ location, zoomLevel }) => (
  <div className="map">
    <div className="google-map">
      <GoogleMaps
        bootstrapURLKeys={{ key: "AIzaSyB2n5F3vHcUE8iIwidfNqbKsxzV73PmGy8" }}
        defaultCenter={location}
        defaultZoom={zoomLevel}
      >
        <LocationPin
          lat={location.lat}
          lng={location.lng}
          text={location.address}
        />
      </GoogleMaps>
    </div>
  </div>
);

const LocationPin = ({ text }) => (
  <div className="pin">
    <img
      style={{ height: "30px" }}
      src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.clker.com%2Fcliparts%2Fv%2FG%2Fa%2F3%2Fi%2Fa%2Fmap-marker-hi.png&f=1&nofb=1"
      alt="fookin-pointer"
    />
    <p className="pin-text">{text}</p>
  </div>
);

export default Map;
