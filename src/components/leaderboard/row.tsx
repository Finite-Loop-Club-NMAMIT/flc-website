import React from 'react'

interface rowProps {
    name: string;
    usn: string;
    eventsAttended: number;
    xp: number

}


const Row = ({ name, usn, eventsAttended, xp }: rowProps) => {
    return (
        <div className='w-full flex border-2 border-border rounded-lg'>

            <div className='flex-1  border-orange-700 py-4'>
                <p className='text-center text-xs sm:text-md md:text-lg font-semibol'>{name}</p>
            </div>

            <div className='flex-1  border-orange-700 py-4'>
                <p className='text-center text-xs sm:text-md md:text-lg font-semibol'>{usn}</p>
            </div>

            <div className='flex-1  border-orange-700 py-4'>
                <p className='text-center text-xs sm:text-md md:text-lg font-semibol'>{eventsAttended}</p>
            </div>

            <div className='flex-1  border-orange-700 py-4'>
                <p className='text-center text-xs sm:text-md md:text-lg font-semibol'>{xp}xp</p>
            </div>
        </div>
    )
}

export default Row