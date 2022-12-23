import {FunctionComponent, useState, useEffect} from 'react';
import {useGoogleMap} from '@ubilabs/google-maps-react-hooks';
import { data } from 'autoprefixer';
import { useRouter } from 'next/router'
import { saveCheckin } from '../../pages/api/request';
import { db } from '../Firebase'
import { ref, set, onValue, get, child } from "firebase/database";
import Confirm from '../Confirm'
interface MarkPosition {
  lat: number;
  lng: number;
  rad: number;
}
interface CurrentPos {
  lat: number;
  lng: number;
  
}
/**
 * Component to render all map markers
 */
interface Coord {
  lat: number;
  lng: number;
}

interface MarkData {
  lat: number;
  lng: number;
  name: string;
}

// from stack overflow
function arePointsNear(checkPoint:Coord, centerPoint:Coord, km:number) {
  var ky = 40000 / 360;
  var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
  var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
  var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
  return Math.sqrt(dx * dx + dy * dy) <= km;
}

interface MapMarkersData {
  marks: any;
  currentPos: {
    lat:number;
    lng:number;
  };
  userRadius: {
    rad:string
  };
}

const MapMarkers = (props:MapMarkersData) => {
  const router = useRouter()
  const {marks, currentPos, userRadius} = props
  const [picture, setPicture] = useState();
  const [current, setCurrent] = useState({lat:0, lng:0})
  const [modal, openModal] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [selected, setSelectedValue] = useState({lat:0, lng:0, name:''})
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCurrent({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  },[])
  // Get the global map instance with the useGoogleMap hook
  const map = useGoogleMap();

  const [, setMarkers] = useState<Array<google.maps.Marker>>([]);
  async function submitSelfie() {
    await saveCheckin(selected.lat, selected.lng, selected.name, picture)
    setConfirm(true)
    openModal(false)
  }

  function handleCapture(value:any) {
    setPicture(value.files[0])
  }
  // Add markers to the map
  useEffect(() => {
    if (!map) {
      return () => {};
    }
    const dataMarks:MarkData[] = Object.values(marks||{})
    dataMarks.push({lat: currentPos.lat, lng: currentPos.lng, name: 'Current location'})
 
    const initialBounds = new google.maps.LatLngBounds();
    const plantedMarks: Array<google.maps.Marker> = dataMarks.map(mark => {
      const {lat, lng, name} = mark;
      
      const markerOptions: google.maps.MarkerOptions = {
        map,
        position: {lat, lng},
        title: name,
        clickable: true
      };

      initialBounds.extend({lat, lng});
      const lastOutput = new google.maps.Marker(markerOptions);
      if(name!=='Current location') {
        const markInfoWindow = new google.maps.InfoWindow({
          content:`${name}`,
          position: {lat, lng},
          });
          if(router.asPath!=='/setting') {
            google.maps.event.addListener(lastOutput, 'click', ()=> {
              const isInArea = arePointsNear({lat, lng}, currentPos, parseFloat(userRadius.rad)/1000)
              if(isInArea) {
                setSelectedValue({lat, lng, name})
                openModal(true)
              }
              markInfoWindow.open(map, lastOutput);
            });
          } else {
              markInfoWindow.open(map, lastOutput);
          }
      } else {
        if(router.asPath!=='/setting') {
          const newCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: {lat, lng},
            radius:  parseFloat(userRadius.rad),
          })
        }
        const currentInfoWindow = new google.maps.InfoWindow({
          content:
              `Your current position`,
          position: {lat, lng},
          });
          currentInfoWindow.open(map, lastOutput);
      }
      return lastOutput
    });

    map.setCenter(initialBounds.getCenter());

    setMarkers(plantedMarks);

    // Clean up markers
    return () => {
      plantedMarks.forEach(marker => marker.setMap(null));
    };
  }, [map]);

  return (<>
    {modal&&(
      <div className="flex justify-center items-center h-full w-full absolute bg-black bg-opacity-60 top-0">
        <div className="relative max-w-2xl rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Checkin
                    </h3>
                    <button onClick={()=>openModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Location : <span>{selected.name}</span>
                    </p>
                    <input
                      accept="image/*"
                      className='block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100'
                      id="icon-button-file"
                      type="file"
                      capture="environment"
                      onChange={(e) => handleCapture(e.target)}
                    />
                </div>
                
                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button onClick={submitSelfie} data-modal-toggle="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <button onClick={()=>openModal(false)} data-modal-toggle="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                </div>
        </div>
      </div>)}
    {confirm&&(<Confirm onOk={()=>setConfirm(false)} text={'Item was updated.'}/>)}
  </>);
};

export default MapMarkers;