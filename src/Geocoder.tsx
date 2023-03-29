import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useControl } from "react-map-gl";

interface IGeocode {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}

export const Geocoder = ({ setLatitude, setLongitude }: IGeocode) => {
  console.log(
    {
      env: import.meta.env.VITE_API_KEY,
    },
    []
  );
  const ctrl = new MapboxGeocoder({
    accessToken: import.meta.env.VITE_API_KEY,
    marker: false,
    collapsed: false,
  });

  useControl(() => ctrl);

  ctrl.on("result", (e: any) => {
    const coords = e.result.geometry.coordinates;
    setLongitude(coords[0]);
    setLatitude(coords[1]);
  });

  return null;
};
