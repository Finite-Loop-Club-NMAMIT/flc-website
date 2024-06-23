import React from 'react'
import { api } from '~/utils/api'

export default function test() {

  const branches = api.branch.getAll.useQuery();

      async function testing(){  
       
        console.log(branches.data);
      }
        
  

  return (
    <div>
      test
      <br />
      <button onClick={testing}>test Button</button>
      <p>{JSON.stringify(branches.status)}</p>
    </div>
  );
}
