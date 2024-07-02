import Image from 'next/image'
import React from 'react'

const Logo = () => {
    return (
        <div className=' h-4 w-4 md:h-8 md:w-8 relative'>
            <Image src='/favicon.ico' fill /* width={10} height={10} sizes="(max-width: 768px) 10px , 40px" */ alt='logo'></Image>
        </div>
    )
}

export default Logo