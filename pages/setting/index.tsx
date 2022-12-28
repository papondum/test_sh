import React, { useEffect, useState } from 'react'
import Navigate from '../../components/Navigation'
import Map, { MapData } from '../../components/Map'
import Loading from '../../components/Loading'
import Input from '../../components/Input'
import { db } from '../../components/Firebase'
import { ref, get, child } from "firebase/database";
import { saveMarker, saveRadius } from '../api/request'
import useLocationHook from '../../hooks'
import Confirm from '../../components/Confirm'
interface LocationData {
    lat: number;
    lng:number;
}
const Setting= () => {
    //get location
    const [location, setLocation] = useState<LocationData|null>(null);
    useEffect(() => {
        if ('geolocation' in navigator) {                          
          navigator.geolocation.getCurrentPosition(position => {
            setLocation({lat: position.coords.latitude, lng: position.coords.longitude}) 
          }, er => console.log(er)
          )
        }
    },[])

    const [_data, setData] = useState<any|null>({data:null,rad:null})
     useEffect(()=> {
    const fetchData = async () => {
        const response = await getSettingData();
        setData(response)
        }
        fetchData()
        .catch(console.error);
    }, [])
    
    const {data, rad} = _data
    useEffect(()=> {
        setRad(rad)
    }, [rad])

    // const location = useLocationHook()
    const [confirm, setConfirm] = useState(false)
    const [_name, setName] = useState(data?.markPosition?.name)
    const [_lat, setLat] = useState<any | null>(data?.markPosition?.lat)
    const [_lng, setLng] = useState<any | null>(data?.markPosition?.lng)
    const [_rad, setRad] = useState(rad?.rad||0)
    const [mapCoord, setMapCoord] = useState({lat:0, lng:0})
    async function _handleSave() {
        await saveMarker(_lat,_lng, _name)
        setConfirm(true)
    }
    async function _handleRad() {
        await saveRadius(_rad)
        setConfirm(true)
    }
    function _setCord(lat:number, lng:number) {
        setMapCoord({lat, lng})
    }
    useEffect(()=> {
        if(mapCoord.lat!=0){
            setLat(mapCoord.lat)
            setLng(mapCoord.lng)
        }
    },[mapCoord])
    
    return (
    <main className="">
        <Navigate/>
        <div className='container mx-auto p-4'>
        {location&&data&&rad ? <Map setValue={_setCord} data={data} rad={rad} current={location} />:<Loading height={350}/>}
        <section className='flex flex-col p-4 border-b-2 border-gray-600'>
                    <h3 className="text-center text-gray-500 p-4">Set Marker to be checkin</h3>
                    <Input onChange={(e: { target: { value: React.SetStateAction<string> } })=>setName(e.target.value)} value={_name||''} type="text" label="Name" placeholder="Central rama9" required/>
                    <Input onChange={(e: { target: { value: any } })=>setLat(e.target.value)} value={_lat||0} type="number" label="Latitude" placeholder="10.0000" required/>
                    <Input onChange={(e: { target: { value: any } })=>setLng(e.target.value)} value={_lng||0} type="number" label="Longtitude" placeholder="10.0000" required/>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={_handleSave}>save</button>
        </section>
        <section className="p-4 flex flex-col">
            <h3 className="text-center text-gray-500 p-4">Set user checkin radius</h3>
                <Input onChange={(e: { target: { value: React.SetStateAction<string> } })=>setRad(e.target.value)} value={_rad||0} type="number" label="Radius" placeholder="1300" required/>
                <button className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={_handleRad}>update</button>

        </section>
        </div>
        {confirm&&(<Confirm onOk={()=>setConfirm(false)} text={'Item was updated.'}/>)}
    </main>)
}


async function getSettingData() {
    const dbRef = ref(db);
    const _data = await get(child(dbRef, `mark/`))
    const _rad = await get(child(dbRef, `rad/`))
  
    const data = await _data.toJSON()
    const rad = await _rad.toJSON()
    return {
        data,rad
    }
  }
  
  export default Setting