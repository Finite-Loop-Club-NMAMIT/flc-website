'use client'
import { Button } from '@radix-ui/themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import AvatarCustom from '~/components/avatar'
import CopyBtn from '~/components/copyBtn'
import { api } from '~/utils/api'


const EventSlug = () => {

  const router = useRouter()
  const id = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;

  const path = usePathname()
  const url = `http://localhost:3000/${path}`
  console.log(path)

  if(!id){
    return (<h1>Error fetching id</h1>)
    
  }
  const { data: event } = api.event.getEventById.useQuery(id);


  if(!event){
    return <h1>error fetching event</h1>
  }
  
  return (
    <main className='w-[100%] flex flex-col justify-start items-center space-y-4'>

      <section className='mt-12 w-[90%] md:w-[85%] lg:w-[75%] xl:w-[60%]  flex-col sm:flex-row border border-border rounded-3xl flex bg-accent '>
        <div className='shrink    overflow-hidden flex justify-start'>
          <Image className='w-full sm:w-[300px] lg:w-[400px] rounded-t-3xl sm:rounded-tr-none sm:rounded-s-3xl ' 
          src={event.imgSrc || '/assets/image.png' } 
          alt='event' 
          width={300} 
          height={5}   
          />
        </div>
        <div className='flex-1 p-8  space-y-4'>
          <p className='text-5xl md:text-6xl  font-bold'>{event.name}</p>
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

      <section className=' p-8 flex flex-col gap-4 sm:flex-row w-[90%] md:w-[85%] lg:w-[75%] xl:w-[60%] mx-auto border border-border  rounded-3xl  bg-accent'>
        <div className='space-y-4' style={{flex:2}}>
          <h1 className='font-semi-bold text-3xl'>Description</h1>
          {/* <p>{event.description}</p> */}
          <p className='font-extralight'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo enim molestias natus odio? Magnam, qui voluptas exercitationem numquam nobis cumque consequatur delectus recusandae possimus? Excepturi repellat, velit numquam debitis cum architecto necessitatibus exercitationem explicabo eaque omnis. Ea iure deleniti distinctio ullam, quas voluptas autem incidunt suscipit obcaecati vero quasi! Modi impedit vitae mollitia id, praesentium animi fugiat quaerat voluptate. Iusto, nisi assumenda! Repudiandae iste ipsum, dolore sit recusandae.</p>
        
        </div>
        <div className='b' style={{flex:1}}> 
          <h1 className='font-medium text-xl'>Registered ({120})</h1>
          <div className='px-2 py-2'>
            <AvatarCustom height={40} width={40} />
            <AvatarCustom height={40} width={40} className='relative -left-3' />
            <AvatarCustom height={40} width={40} className='relative -left-6'/>
            <AvatarCustom height={40} width={40} className='relative -left-9'/>
          </div>
          <h1 className='font-medium text-xl mt-6'>Share with a friend</h1>
          <div className='flex gap-2 '>
            <input className='text-xs flex-1' type="text"value={url}  disabled/>
            <CopyBtn value={url} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default EventSlug