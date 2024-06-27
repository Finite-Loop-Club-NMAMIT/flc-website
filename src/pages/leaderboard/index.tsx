'use client'
import React from 'react'
import RankBars from '~/components/leaderboard/rank-bars'


const index = () => {
  return (
    <main className='h-[150vh] w-[100%]'>
      <div className='h-[38vh] border border-border w-[100%] rounded-b-[50px] bg-[#282828] overflow-hidden flex'>
        <div className='w-1/2 h-full  border-orange-50 flex flex-col justify-center items-center'>
          <div className='space-y-1'>
            <h1 className='font-bold text-7xl'>Leaderboard</h1>
            <p className='font-semibold text-2xl'>participate in events to earn XP!</p>
          </div>
        </div>
        <div className='flex-1 flex items-end justify-center h-full'>
          <div className='flex gap-20 items-end h-full'>
            
        <RankBars size={140} rank={2}/>
        <RankBars size={200} rank={1}/>
        <RankBars size={100} rank={3}/>
        </div>
        </div>
        
      </div>
    </main>
  )
}

export default index