import React, {useState, useCallback, forwardRef, useEffect, useRef, SetStateAction} from 'react';
import { GoogleMapsProvider } from '@ubilabs/google-maps-react-hooks';
import Markers from '../Markers'
import GeocodingService  from '../GeoCoding';
export interface MapData {
  setValue?: (lat:number, lng:number) => void;
  data: {
    markPosition: {
      name: string;
      lat: number;
      lng: number;
      radius: number;
    }
  }
  rad: {
    rad:string;
  };
  current : {
    lat:number;
    lng:number;}
}
function Map({setValue, data, rad, current}:MapData) {

  const [mapContainer, setMapContainer] = useState<HTMLElement | null>(null);
  const [lat, setLat] = useState<number>(current.lat)
  const [lng, setLng] = useState<number>(current.lng)
  const mapRef = useCallback((node:HTMLElement | null) => {
    node && setMapContainer(node);
  }, []);
  const mapOptions = {
    center: {lat, lng},
    zoom: 15,
    disableDefaultUI: true,
  };
  
  return (
    <GoogleMapsProvider
      googleMapsAPIKey={'AIzaSyAqrku_7tQuF9Jot_sX4CfzFbD8Pm3okJU'}
      mapContainer={mapContainer}
      mapOptions={mapOptions}
      >
      <React.StrictMode>
        <div ref={mapRef} className="w-full h-[350px] text-black" />
        <GeocodingService setValue={setValue||((lat,lng)=>(console.log(lat,lng)))} />
        <Markers marks={data} currentPos={{lat,lng}} userRadius={rad}/>
      </React.StrictMode>
    </GoogleMapsProvider>
  );
}


export default Map;