import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import Modal from '../../components/Modal'
import Navigate from '../../components/Navigation'
import { db } from '../../components/Firebase'
import { ref, get, child } from "firebase/database";
import { getImgUrl } from '../api/storage';
import { setEnvironmentData } from 'worker_threads'
function toDateTime(secs:number) {
    const date = secs/1000
    // const output = new Date(secs * 1000);
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(date);
    return t;
}

interface HistoryData {
        date: number;
        lat:number;
        lng:number;
        url?: string;
        name: string;
}[]
export default function History() {
    const [data, setData] = useState<any|null>(null)

    useEffect(()=> {
    const fetchData = async () => {
        const _data = await getCheckinData();
        setData(_data)
        }
        fetchData()
        .catch(console.error);
    }, [])
    console.log(data);
    
    // const { data } = props
    const [popup, setPopup] = useState(false)
    const [selected, setSelected] = useState<HistoryData>()
    function clickView(item:HistoryData) {
        setSelected(item)
        setPopup(true)
    }
    return (
    <main >
        <Navigate/>
        <section className="container mx-auto p-4">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">History checkin</h1>
            <div className="grid grid-cols-2 gap-4">
                {data&&(data.map((item: HistoryData) => (
                <div onClick={()=>clickView(item)} key={item.date} className="flex flex-col gap-3 justify-center items-center block justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    {item.url&&<img
                        alt={item.name}
                        src={item.url}
                        width={250}
                        height={250}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    />}
                    <span>Date: {toDateTime(item.date).toLocaleString()}</span>
                </div>)))}
            </div>
        </section>
        {popup&&(<Modal onOk={()=>setPopup(false)}>
            <div className="m-4 flex flex-col gap-3 justify-center items-start block max-w-sm p-6border border-gray-200 rounded-lg dark:border-gray-700 ">
                <div>Name: {selected?.name||'Untitled'}</div>
                {selected?.url&&<img
                    alt={selected.name}
                    src={selected.url}
                    width={250}
                    height={250}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                    }}
                />}
                <div>Location: {selected?.lat},{selected?.lng}</div>
                <div>Date: {selected?.date&&(toDateTime(selected?.date).toLocaleString())}</div>
            </div>
        </Modal>)}
    </main>)
}

async function getCheckinData() {
    const dbRef = ref(db);
    const _data = await get(child(dbRef, `checkin/`))
    const dataJson = _data.toJSON()||{}
    const data = Object.values(dataJson)
    data.sort((a, b) => {
        return b.date - a.date;
    });
    const mapUrl = await Promise.all(data.map(async (file) => {
        try{
            const url = await getImgUrl(file.date)
            if(url) {
                file.url = url
            }
            
        } catch (e){
            console.log(e);
        }
      }));
    return data
  }