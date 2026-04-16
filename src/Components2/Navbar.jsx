import { Container } from "lucide-react"
const Navbar = () => {
  return (
    <div className="flex justify-center md:justify-between items-center p-5">

      <a href="#" className="flex items-center font-bold text-3xl md:text-xl">
        <Container className="mr-2"/>
        DOUA<span className="text-bold text-error">DEV</span>
      </a>

      <ul className=" hidden md:flex space-x-4">
        <li>
          <a href="#" className="btn btn-sm btn-ghost "
          >Acceuill
          </a>
          </li>


        <li>
          <a href="#" className="btn btn-sm btn-ghost "
          >A propos
          </a>
          </li>


        <li>
          <a href="#" className="btn btn-sm btn-ghost "
          >Mes experiences
          </a>
          </li>


        <li>
          <a href="#" className="btn btn-sm btn-ghost "
          >Mes projets
          </a>
          </li>

      </ul>
    </div>
  )
}

export default Navbar