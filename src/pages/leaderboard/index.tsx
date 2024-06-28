'use client'
import React from 'react'
import RankBars from '~/components/leaderboard/rank-bars'
import Row from '~/components/leaderboard/row'


const index = () => {
  return (
    <main className='h-[150vh] w-[100%]  space-y-6'>
      <div className='pt-12 sm:pt-0 sm:h-[38vh] border border-border w-[100%] rounded-b-[70px] bg-[#282828] overflow-hidden flex flex-col sm:flex-row gap-20 sm:gap-0'>


        {/* left half of banner */}
        <div className='w-full sm:w-1/2 sm:h-full  border-orange-50 flex justify-center items-center '>

          <div className='space-y-1 flex flex-col items-center sm:block'>
            <h1 className='font-bold text-4xl md:text-5xl lg:text-7xl'>Leaderboard</h1>
            <p className='font-semibold text-lg'>participate in events to earn XP!</p>
          </div>

        </div>

        {/* right half of banner */}
        <div className='flex-1 flex items-end justify-center gap-16 sm:h-full'>

          <RankBars className='h-[75px] sm:h-[110px] md:h-[140px]' size={140} rank={2} />
          <RankBars className='h-[130px]  sm:h-[165px] md:h-[200px]' size={200} rank={1} />
          <RankBars className='h-[50px] sm:h-[85px] md:h-[100px]' size={100} rank={3} />

        </div>

      </div>


      {/* grid section of page */}
      <main className='w-[95%] lg:w-4/5 h-[30rem]  border-border mx-auto space-y-2 '>

        {/*below div Grid banner */}
        <div className='w-full flex border-2 border-border rounded-lg bg-accent'>
          <p className='flex-1  py-4 text-center text-xs sm:text-lg md:text-xl font-semibold'>Name</p>
          <p className='flex-1  py-4 text-center text-xs sm:text-lg md:text-xl font-semibold'>USN</p>
          <p className='flex-1  py-4 text-center text-xs sm:text-lg md:text-xl font-semibold text-wrap'>Events Attended</p>
          <p className='flex-1  py-4 text-center text-xs sm:text-lg md:text-xl font-semibold'>XP</p>
        </div>


        <Row usn='NNM22CS139' name='rakshithx09' eventsAttended={50} xp={200} />
        <Row usn='NNM22CS139' name='rakshithx09' eventsAttended={50} xp={200} />
        <Row usn='NNM22CS139' name='rakshithx09' eventsAttended={50} xp={200} />
        <Row usn='NNM22CS139' name='rakshithx09' eventsAttended={50} xp={200} />
        <Row usn='NNM22CS139' name='rakshithx09' eventsAttended={50} xp={200} />
      </main>
    </main>
  )
}

export default index