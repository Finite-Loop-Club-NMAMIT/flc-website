import {useEffect} from 'react';
export default function Background(){
    useEffect(() => {
        const script = document.createElement('script');
    
        script.src = "/script.js";
        script.async = true;
    
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        }
      }, []);
    return(
        <>
            <canvas className='bg-transparent'></canvas>
        </>
    )
}