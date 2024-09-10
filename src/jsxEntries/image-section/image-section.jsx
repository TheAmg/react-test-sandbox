import { useState, useEffect } from 'react'

import './image-section.css'

export const ImageSection = () => {
  const generateNew = () => {
    // setLink('https://picsum.photos/1000/600')
  }

  const [link,setLink] = useState('https://picsum.photos/1000/600')

  return (
    <section>
      <span></span>
      <h1>New Random image</h1>
      <img src={link} alt='E'/>
      <br></br>
      <button onClick={generateNew}>Generate new</button>
    </section>
  )
}

export default ImageSection
