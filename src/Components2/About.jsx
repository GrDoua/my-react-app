import { CalendarSync, LetterText, Paintbrush, Section } from "lucide-react"

const aboutsection = [
    {
      id:1,
      title : "developpeure frontend",
      description : "je suis un developpeuere frontend avec une bonne experience ",
      icon : < LetterText className="text-error scale-150"/>
    },
     {
      id:2,
      title : "developpeure backend",
      description : "je suis un developpeuere backend avec une bonne experience ",
      icon : < CalendarSync className="text-error scale-150" />
    },
     {
      id:3,
      title : "passione par l'UX/UI",
      description : "je metrise bien l'ux/ui avec une bonne experience ",
      icon : < Paintbrush className="text-error scale-150"/>
    },

];
const About = () => {
  return (
    <div className="bg-red-100 mb-10 p-10 md:mb-32">
        <h1 className="text-center uppercase font-bold text-3xl">A propos</h1>

        <div className="h-screen flex justify-center mt-10">
         <div className="hidden md:block">
            <img src="https://i.pinimg.com/1200x/69/f7/0f/69f70f04cd1f80998a38f0546c70a124.jpg" alt="" 
            className=" rounded-xl w-96"
             />
         </div>

        <div className="md:ml-20 space-y-10">
            {
                aboutsection.map((Section) =>(
                   <div key={Section.id} className="flex flex-col items-center bg-red-200 p-5
                    rounded-xl shadow-xl md:w-96">
                    <div>
                        {Section.icon}
                    </div>
                    <div className="md:ml-10 text-center">
                        <h2 className="font-bold text-2xl">
                            {Section.title}
                        </h2>
                        <p className="text-sm">
                            {Section.description}
                        </p>
                    </div>

                   </div>

                ))
            }

        </div>

        </div>
        
    </div>
  )
}

export default About