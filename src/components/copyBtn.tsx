import { CheckCheck, Copy } from 'lucide-react';
import React, { useState } from 'react'

const CopyBtn = ({value} : {value? : string} ) => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = () => {
        if (!value) {
            return
        }
        setIsCopied(true)
        navigator.clipboard.writeText(value)
        setTimeout(()=> {
            setIsCopied(false)
        },1000)
    }

    const Icon = isCopied ? CheckCheck : Copy

  return (
    <button 
    onClick={onCopy}
    disabled={!value || isCopied}

    >
        <Icon className='h-4 w-4' />
    </button>
  )


}

export default CopyBtn