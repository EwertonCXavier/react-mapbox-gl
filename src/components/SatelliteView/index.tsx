import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import ReactMapGL, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { Geocoder } from "../Geocoder";
import { MapContainer } from "./styled";

export const SatelliteView = () => {
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
    <MapContainer>
      <ReactMapGL
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_API_KEY}
        initialViewState={{
          longitude,
          latitude,
          zoom: 8,
        }}
        // In order to get other version for the map, access the following link: https://docs.mapbox.com/api/maps/styles/
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
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
    </MapContainer>
  );
};
