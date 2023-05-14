import { Box } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import ReactMapGL, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { Geocoder } from "./Geocoder";

export const App = () => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (latitude === 0 && longitude === 0) {
      fetch("https://ipapi.co/json")
        .then((response) => {
          return response.json();
        })
        .then((data: any) => {
          mapRef.current?.flyTo({
            center: [data.longitude, data.latitude],
          });

          setLatitude(data.latitude);
          setLongitude(data.longitude);
        });
    }
  }, [latitude, longitude]);

  return (
    <Box
      sx={{
        height: 400,
        position: "relative",
      }}
    >
      <ReactMapGL
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_API_KEY}
        initialViewState={{
          longitude,
          latitude,
          zoom: 8,
        }}
        // Option for simple map view
        // mapStyle="mapbox://styles/mapbox/streets-v11"

        // Options for satellite view
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        projection={"globe"}
      >
        <Marker
          latitude={latitude}
          longitude={longitude}
          draggable
          onDragEnd={(e) => {
            setLatitude(e.lngLat.lat);
            setLongitude(e.lngLat.lng);
          }}
        />
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="top-left"
          trackUserLocation
          onGeolocate={(e) => {
            setLatitude(e.coords.latitude);
            setLongitude(e.coords.longitude);
          }}
        />
        <Geocoder setLatitude={setLatitude} setLongitude={setLongitude} />
      </ReactMapGL>
    </Box>
  );
};
