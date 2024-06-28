'use client'
import { Button } from '@radix-ui/themes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'


const EventSlug = () => {

  const router = useRouter()
  const id = router.query.slug


  return (
    <main className='w-[100%] flex flex-col justify-start items-center space-y-4'>

      <section className='mt-12 w-[90%] md:w-[85%] lg:w-[75%] xl:w-[60%]  flex-col sm:flex-row border border-border rounded-3xl flex bg-accent '>
        <div className='shrink    overflow-hidden flex justify-start'>
          <Image className='w-full sm:w-[300px] lg:w-[400px] rounded-t-3xl sm:rounded-tr-none sm:rounded-s-3xl ' 
          src='/assets/sample.png' 
          alt='event' 
          width={300} 
          height={5}   
          />
        </div>
        <div className='flex-1 p-8  space-y-4'>
          <p className='text-5xl md:text-6xl  font-bold'>Dev Hunt</p>
          <p className='text-base sm:text-lg font-medium'>Wed, Aug 28 9:00 AM</p>
          <p className='text-base font-medium'>Venue : Sambhram</p>
          <p className='text-sm sm:text-base font-medium'>Organisers : satwik, nandan</p>

          <div className='flex gap-8 items-center mt-4'>
            <p className='text-lg font-bold'>RS 99/- </p>
            <Button asChild className="border border-border bg-white hover:bg-white/5  font-bold py-2 px-3 rounded">
              <Link href="/" className="text-black no-underline  text-sm font-light flex gap-3">
                Register
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className=' p-8 flex flex-col w-[90%] md:w-[85%] lg:w-[75%] xl:w-[60%] mx-auto border border-border  rounded-3xl  bg-accent'>
        <div className='w-2/3 space-y-4'>
          <h1 className='font-semi-bold text-3xl'>Description</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo enim molestias natus odio? Magnam, qui voluptas exercitationem numquam nobis cumque consequatur delectus recusandae possimus? Excepturi repellat, velit numquam debitis cum architecto necessitatibus exercitationem explicabo eaque omnis. Ea iure deleniti distinctio ullam, quas voluptas autem incidunt suscipit obcaecati vero quasi! Modi impedit vitae mollitia id, praesentium animi fugiat quaerat voluptate. Iusto, nisi assumenda! Repudiandae iste ipsum, dolore sit recusandae.</p>
        </div>
      </section>
    </main>
  )
}

export default EventSlug