import { useEffect, useRef, useState } from 'react'

import './App.css'
import axios from 'axios'
import Spinner from './Spinner'

function App() {

  const audio = new Audio()

  const [songs, setSongs] = useState([])
  const [reproduciendo, setReproduciendo] = useState(null)
  const [currentTime, setCurrentTime] = useState(null)
  const [duration, setDuration] = useState(null)
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(audio)
  useEffect(() => {
    axios.get("https://envivo.top:9100/api/info")
      .then(info => setSongs(info.data.reverse()))
  }, [])


  const handleClick = (index) => {
    setReproduciendo(index)

    if (reproduciendo === index) {
      if (audioRef.current.paused) {
        audioRef.current.src = songs[index].url_audio
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.src = songs[index].url_audio
      audioRef.current.play();
    }
  }
  let i = 0
  useEffect(() => {

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
      const calculatedProgress = (currentTime / duration) * 100;
      setProgress(calculatedProgress);
    }
    if (!audioRef.current.paused) {

      if (duration < currentTime + 1) {

        if (reproduciendo < songs.length - 1) {

          if (songs.length > 0) {
            audioRef.current.src = songs[reproduciendo + 1].url_audio
            audioRef.current.play()
            setReproduciendo(reproduciendo + 1)
          } else {
            audioRef.current.src = songs[0].url_audio
            audioRef.current.play()
          }

        } else {
          audioRef.current.src = songs[0].url_audio
          audioRef.current.play()
          setReproduciendo(0)
        }

      }

    }


    audioRef.current.ontimeupdate = handleTimeUpdate;
  }, [currentTime])
  


  return (
    <>
      <div className='w-[340px]'>

        <div className='text-2xl font-extrabold flex justify-center py-5'>LAS TOP 10 Perú</div>
       
        {songs.map((song, index) => (
          <div key={index}>
            <div className={`flex py-1 items-center justify-around hover:bg-violet-900 ${reproduciendo === index ? "bg-violet-900" : ""}`}
              onClick={() => handleClick(index)}
            >
              <div className={`w-16 text-2xl font-extrabold text-center`}>{reproduciendo === index ? <Spinner /> : song.position}</div>
              <div className='w-32 '>
                <img className='rounded-full' src={song.url_image} alt={song.titulo} />
              </div>

              <div className='w-60 text-xs font-bold px-3'>{song.titulo}</div>
            </div>
            {reproduciendo === index && progress!==NaN ? <div>
              <progress className='absolute w-[340px] h-1 bg-red-600' value={progress} max={100} /></div> : ""
            }
          </div>
        ))}
      </div>
    </>
  )
}

export default App
