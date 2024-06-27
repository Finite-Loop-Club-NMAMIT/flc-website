'use client'

import React from 'react'
import * as Avatar from '@radix-ui/react-avatar';

const RankBars = ({ size, rank }: { size: number, rank: number }) => {

    const bgColor = rank == 1 ? '#f6c388' /* gold */ : rank === 2?  '#8f959f' /* silver */ : '#846262 ' /* bronze */
    return (
        <div className='w-12  relative overflow-visible' style={{ height: `${size}px`, backgroundColor : `${bgColor}` }}>
            <div className='absolute left-1/2 transform -translate-x-1/2 -top-12 '>
                <Avatar.Root className="bg-blackA1 inline-flex h-[70px] w-[70px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                    <Avatar.Image
                        className="h-full w-full rounded-[inherit] object-cover"
                        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                        alt="Colm Tuite"
                    />
                    <Avatar.Fallback
                        className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                        delayMs={600}
                    >
                        CT
                    </Avatar.Fallback>
                </Avatar.Root>
            </div>
        </div>
    )
}

export default RankBars