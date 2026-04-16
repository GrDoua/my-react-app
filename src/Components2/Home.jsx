import { Mail } from "lucide-react"

const Home = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-center items-center md:my-55 my-10">
        <div className="flex flex-col">
            <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left mt-4 md:mt-0"
            >Bonjour , <br />
            je suis <span className="text-error">DouaDev</span>
            </h1>
            <p className="mt-4 text-center md:text-left">
                je suis une devloppeure fullstack <br />avec 5ans d'experience utilisent react <br />
                et node js.
                contactez moi si vous avez des besoins a mon services...
            </p>
            <a href="" className="btn btn-error mt-3 md:w-fit">
                <Mail className="w-5 h-5" /> Contactez Moi
            </a>

        </div>

        <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz0wI1RI_cODw_1sXRW9_rjIipbX61QPp2ng&s" alt="" 
            className=" md:ml-60 border-8 border-error shadow-xl"
            style={{
                borderRadius : "30% 70% 70% 30% /67% 62% 38% 33%"
            }}
            />

        </div>
    </div>
  )
}

export default Home