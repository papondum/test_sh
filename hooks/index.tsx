import { useState, useEffect } from 'react'
interface LocationData {
    lat: number;
    lng:number;
}
function useLocationHook() {
    const [location, setLocation] = useState<LocationData|null>(null);
        useEffect(() => {
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(position => {
                setLocation({lat: position.coords.latitude, lng: position.coords.longitude}) 
              })
            }
    },[])
    return location;
 }
 export default useLocationHook;