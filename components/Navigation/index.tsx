import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
export default function Navigate() {
    const active = useState(0)
    const router = useRouter()
    useEffect(() => {
        if(router.pathname) {

        }
    },[router])
    const styles="p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
    const activeStyle = 'border-b-2 border-solid'
    return (
    <div className='top-0 z-40 flex-none w-full mx-auto bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800 mb-8'>
        <div className='container mx-auto flex justify-between '>
            <div className="my-auto">Logo</div>
            <div className='max-w-[224px] w-full flex justify-between'>
                <Link className={`${styles} ${router.pathname=='/' ? activeStyle:''}`} href="/">Checkin</Link>
                <Link className={`${styles} ${router.pathname=='/history' ? activeStyle:''}`} href="/history">History</Link>
                <Link className={`${styles} ${router.pathname=='/setting' ? activeStyle:''}`} href="/setting">Setting</Link>
            </div>
        </div>
    </div>)
}