import {useEffect, useState} from 'react';
import {
  useGeocodingService,
  useGoogleMap
} from '@ubilabs/google-maps-react-hooks';
import { ref, set } from "firebase/database";

interface Geocoding {
  setValue: (lat:number, lng:number)=>void;
  markPosition?: {
    rad: number;
  }
}

const GeocodingService = (props: Geocoding) => {
  const {setValue, markPosition} = props
  
  const map = useGoogleMap();
  const [pos, setPosition] = useState({lat: 0, lng:0})
  
  // Get the geocoder from the useGeocoder hook
  const geocoder = useGeocodingService();

  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setPosition({lat:position.coords.latitude, lng:position.coords.longitude})
    })
  },[])
  
  // Add marker and info window to the map
  
  useEffect(() => {
    if (!map) {
      return () => {};
    }

    // Add a marker
    const newMarker = new google.maps.Marker({
        map,
        position: pos
    });

    setMarker(newMarker);

    const newCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: pos,
        radius: markPosition?.rad||0 * 100,
    })
    setCircle(newCircle)

    // Add an infowindow
    const newInfoWindow = new google.maps.InfoWindow({
    content:
        `Your current position`,
    position: pos
    });        


    setInfoWindow(newInfoWindow);
    newInfoWindow.open(map, newMarker);
    
    // Remove infowindow and marker from the map
    return () => {
      newInfoWindow?.close();
      newMarker?.setMap(null);
    };
  }, [map, pos]);

  // Run geocoder on click on the map
  useEffect(() => {
    if (!map || !marker || !infoWindow || !geocoder) {
      return () => {};
    }

    // Click on the map and open an infowindow with the reversed geocoded address.
    const clickListener = map.addListener(
      'click',
      (mapsMouseEvent: google.maps.MapMouseEvent) => {
        // Use the geocoder to reverse geocode the position from the map
        // and add the address as content of the infowindow
        geocoder?.geocode(
          {location: mapsMouseEvent.latLng},
          (
            results: google.maps.GeocoderResult[] | null,
            status: google.maps.GeocoderStatus
          ) => {
            if (status !== 'OK' || !results) {
              console.error(
                `Geocoding was not successful for the following reason: ${status}`
              );
              return;
            }
            const position = results[0].geometry.location;
            const posLat = results[0].geometry.location.lat();
            const posLng = results[0].geometry.location.lng();
            
            const formattedAddress = results[0].formatted_address;

            if (!position || !formattedAddress) {
              return;
            }
            // setPosition({lat: posLat,lng: posLng})
            setValue&&setValue(posLat,posLng)
            marker.setPosition(position);
            circle?.setCenter(position)
            const test = `<div>${formattedAddress} lat:${posLat} lng:${posLng}`
            infoWindow.setPosition(position);
            infoWindow.setContent(test);
            infoWindow.open(map, marker);

            // map.setCenter(results[0].geometry.location);
          }
        );
      }
    );

    // Clean up click listener
    return () => {
      google?.maps?.event.removeListener(clickListener);
    };
  }, [map, infoWindow, marker, geocoder]);

  return null;
};

export default GeocodingService;