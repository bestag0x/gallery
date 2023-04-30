import { createRoot } from 'react-dom/client'
import './styles.css'
import { App } from './App'

const image = (id) => `/lib${id}.jpg`
const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: image(1), text:'Libro 1', desc:'1', link:''},
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: image(2), text:'Titolo 2', desc:'2' , link:'https://www.amazon.it/Cromonomi-%D7%94%D7%9B%D7%A8%D7%95%D7%9E%D7%95%D7%A0%D7%95%D7%9E%D7%99%D7%9D-Elisheva-Zinellu/dp/B0BGNMQY5L'},
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: image(3), text:'Libro 3', desc:'3', link:'' },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: image(4), text:`Titolo libro 4
  Descrizione:
  `, desc:'4', link:'' },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: image(5), text:'Libro 5' , desc:'5', link:''},
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], url: image(6), text:'Libro 6' , desc:'6', link:''},
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: image(7), text:'Libro 7' , desc:'', link:''},
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738), text:'Libro 8', desc:'' , link:''},
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986), text:'Libro 9', desc:'', link:'' }
]

createRoot(document.getElementById('root')).render(<App images={images} />)
