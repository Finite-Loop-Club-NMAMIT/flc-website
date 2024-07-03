'use client'

import React from 'react'
import AvatarCustom from '../avatar';

const RankBars = ({ className, rank }: { className:string, size: number, rank: number }) => {

    const bgColor = rank == 1 ? '#f6c388' /* gold */ : rank === 2?  '#8f959f' /* silver */ : '#846262 ' /* bronze */
    return (
        <div className={`w-12  relative overflow-visible ${className}`} style={{/*  height: `${size}px`, */ backgroundColor : `${bgColor}` }}>
            <div className='absolute left-1/2 transform -translate-x-1/2 -top-12 '>
                <AvatarCustom height={75} width={75} />
            </div>
        </div>
    )
}

export default RankBars