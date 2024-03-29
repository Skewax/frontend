

import {
    useEffect
} from "react"
import { Link } from "react-router-dom"
import FadeIn from "react-fade-in"
import { FaGithubSquare } from "react-icons/fa"
import { BiDonateHeart } from "react-icons/bi"

export default function About (props) {
    useEffect(() => {
        props.setCookie('pageState', 'false')
    })

    return (        
        <FadeIn
            delay={100}
        >
        <div className="min-h-screen h-full dark:bg-slate-800 bg-scroll z-10">
            <div className="flex flex-col items-center w-full">
                <img src={props.theme ? "./full-light.svg" : "./full-dark.svg"} alt={"logo"} className=" w-3/4 md:w-1/2 lg:w-1/3 mt-20 flex-grow"/>
                <div className="mt-5">
                    <span className="font-bold text-slate-600 dark:text-slate-100">
                        The modern PBASIC IDE
                    </span>
                </div>
                
                <Link to="/editor" className="w-full flex justify-center">
                    <button className="w-1/2 lg:w-1/6 h-24 m-10 bg-sky-500 dark:bg-sky-600 rounded-3xl text-white font-bold text-xl shadow-2xl transform transition-all hover:scale-110 hover:bg-sky-400 dark:hover:bg-sky-700 dark:shadow-sky-800">
                        Start Coding
                    </button>
                </Link>
                <span className="font-bold text-3xl text-slate-600 mt-32 dark:text-slate-100">About</span>
                <div className="mt-20 flex justify-center w-2/3 lg:flex-row md:flex-col flex-col">
                    <img src={props.theme ? 'about/demo-dark.png' : 'about/demo-light.png'} alt={"demo of app"} className="lg:w-2/3 lg:mr-5 rounded-md shadow-md dark:shadow-slate-900 mb-20 object-contain"/>
                    <span className="lg:w-1/3 sm:w-full text-slate-500 font-bold dark:text-slate-300 lg:mt-5">
                        In July of 2022, Parallax Inc's own Parallax IDE for Chrome was shut down as part of the deprecation of Chrome Apps.
                        This made many computers, especially chromebooks, unable to compile and run PBASIC on Basic Stamp hardware. This is why Skewax exists. <br /><br />
                        Skewax can be used on any browser, and can compile on any computer with Chrome. It supports the BS2 hardware and any compatible PBASIC versions.
                    </span>
                </div>
                <div className="flex justify-center ">
                    <a href="https://github.com/Skewax/skewax" className="transition-all transform hover:scale-105 dark:text-slate-300 dark:shadow-sky-900">
                        <FaGithubSquare 
                            size={50}
                        />
                    </a>
                    <a href="https://www.paypal.com/donate/?hosted_button_id=AW8NCRDEL5RBS" className={` flex items-center rounded-md h-[45px] mt-[2px] ml-5 p-2 font-bold transition-all transform hover:scale-105 bg-slate-800 text-white dark:bg-slate-300 dark:text-slate-800`}>
                        <BiDonateHeart 
                            size={20}
                            className="mr-2"
                        />
                        SUPPORT
                    </a>
                </div>
                <div className="flex justify-center pt-20 lg:pt-10">
                    <img src='./about/ellie-profile.jpeg' alt='Ellie' className="rounded-full shadow-xl h-32 dark:shadow-slate-900 mb-20"/>
                    <span className="w-1/3 sm:w-full text-slate-500 font-bold dark:text-slate-300 ml-10 md:mt-14 mt-14">
                        Created by Eleanor Olson
                    </span>
                </div>
            </div>
        </div>
        </FadeIn>
    )
}