import { useEffect, useRef, useState } from 'react'

import './App.css'
import axios from 'axios'
import Spinner from './Spinner'

function App() {

  const audio = new Audio()

  const [songs, setSongs] = useState([])
  const [reproduciendo, setReproduciendo] = useState(null)
  const audioRef = useRef(audio)
  useEffect(() => {
    axios.get("http://backmusic.ddns.net:20000/api/info")
      .then(info => setSongs(info.data.reverse()))
  }, [])

  console.log(songs)
  const handleClick = (index) => {
    setReproduciendo(index)

    if (reproduciendo === index) {
      if (audioRef.current.paused) {
        audioRef.current.src = songs[index].url_audio
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }else{
      audioRef.current.src = songs[index].url_audio
      audioRef.current.play();
    }

  }


  return (
    <>
      <div className='w-[450px]'>
        <div className='text-2xl font-extrabold flex justify-center py-10'>LAS TOP 10 Perú</div>
        {songs.map((song, index) => (
          <div key={index} className={`flex items-center justify-around hover:bg-violet-900 ${reproduciendo===index ? "bg-violet-900" : ""}`}
            onClick={() => handleClick(index)}            
          >
            <div className={`w-12 text-2xl font-extrabold text-center`}>{reproduciendo===index ? <Spinner /> : song.position}</div>
            <div className='w-32'>
              <img src={song.url_image} alt={song.titulo} />
            </div>

            <div className='w-60'>{song.titulo}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
