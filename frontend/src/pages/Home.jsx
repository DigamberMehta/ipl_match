
 
import MatchSchedule from '@/components/MatchSchedule'
import  data from "./data.json"
import React from 'react'
 

const Home = () => {
  return (
    <div>
         <MatchSchedule matches={data} />

    </div>
  )
}

export default Home
