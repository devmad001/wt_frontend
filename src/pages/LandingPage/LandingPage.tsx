import { GuestLayout } from 'ui-organisms'
import logo2Line from 'assets/media/svg/logo2Line.svg'
import logoTransparent from 'assets/media/svg/logo-transparent.svg'
import applo from 'assets/media/image/applo.png'
import line from 'assets/media/image/line.png'
import brain from 'assets/media/image/brain.png'
import browser from 'assets/media/image/browser.png'
import scheduledTransfer from 'assets/media/image/scheduled-transfer.png'
import { IconSvg } from 'ui-atoms'
import { useEffect } from 'react'
import robotImage from 'assets/media/image/robot-img.png'
import { Link } from 'react-router-dom'
import './style.css'

function LandingPage() {
  useEffect(() => {
    const navbar = document.getElementById('navbar')
    window.onscroll = function () {
      if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
        navbar?.classList.add('scrolled')
      } else {
        navbar?.classList.remove('scrolled')
      }
    }
  })
  return (
    <>
      <main className='bg-white dark:bg-gray-900'>
        <div className='min-h-screen bg-white selection:bg-primary/10 selection:text-primary dark:bg-gray-900'>
          <div>
            <section className='introduce-section bg-blue-1000'>
              <nav className='dark:bg-gray-900 w-full fixed z-20 top-0 left-0' id='navbar'>
                <div className='flex flex-wrap items-center justify-between px-6 py-6 max-w-[90%] mx-auto'>
                  <Link to='#' className='flex items-center space-x-3 rtl:space-x-reverse'>
                    <span className='logo-img mr-3'>
                      <IconSvg icon='navbarLogoImg' />
                    </span>

                    <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
                      <span className='logo-word'>
                        <IconSvg icon='navbarLogoWord' />
                      </span>
                      {/* <img src={logoWord} className='logo-word' alt='Logo' /> */}
                    </span>
                  </Link>
                  <div className='flex lg:order-2'>
                    <button
                      type='button'
                      className='btn-contact-sale text-center hidden lg:flex items-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200 w-full px-5 py-2.5 bg-black/40 text-white rounded-lg hover:bg-black/60 text-xs lg:text-sm xl:text-base font-semibold xl:font-bold'
                    >
                      <span className='mr-2'>
                        <IconSvg icon='callIcon' />
                      </span>
                      Contact Sale
                    </button>
                    <button
                      data-collapse-toggle='navbar-sticky'
                      type='button'
                      className='navbar-sticky inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:ring-gray-200 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
                      aria-controls='navbar-sticky'
                      aria-expanded='false'
                    >
                      <span className='sr-only'>Open main menu</span>
                      <IconSvg icon='toggleMenu' />
                    </button>
                  </div>
                  <div
                    className='items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1'
                    id='navbar-sticky'
                  >
                    <ul className='flex flex-col font-medium p-4 lg:p-0 mt-4 border border-gray-100 rounded-lg lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 dark:bg-gray-800 lg:dark:bg-gray-900 dark:border-gray-700 navbar-menu bg-black-500 lg:bg-transparent'>
                      <li>
                        <button
                          id='dropdownNavbarLink'
                          data-dropdown-toggle='dropdownNavbar'
                          className='menu-item flex items-center justify-between w-full py-2 pl-3 pr-4 text-lighter text-xs lg:text-sm xl:text-base font-bold uppercase rounded hover:bg-gray-100 lg:hover:bg-transparent lg:border-0 hover:text-blue-700 lg:p-0 lg:w-auto dark:text-white lg:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 lg:dark:hover:bg-transparent'
                        >
                          Solution{' '}
                          <span className='ml-1.5'>
                            <IconSvg icon='chevronDown' />
                          </span>
                        </button>
                        <div
                          id='dropdownNavbar'
                          className='z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600'
                        >
                          <ul
                            className='py-2 text-sm text-gray-700 dark:text-gray-400'
                            aria-labelledby='dropdownLargeButton'
                          >
                            <li>
                              <a
                                href='#'
                                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                              >
                                Dashboard
                              </a>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='menu-item block py-2 pl-3 pr-4 text-lighter text-xs lg:text-sm xl:text-base font-bold uppercase rounded hover:bg-gray-100 hover:text-blue-700 lg:hover:bg-transparent lg:border-0 lg:p-0 dark:text-white lg:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent'
                        >
                          Pricing
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='menu-item block py-2 pl-3 pr-4 text-lighter text-xs lg:text-sm xl:text-base font-bold uppercase rounded hover:bg-gray-100 hover:text-blue-700 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-white lg:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent'
                        >
                          Who We Are
                        </a>
                      </li>
                      <li>
                        <a
                          href='#'
                          className='menu-item block py-2 pl-3 pr-4 mr-5 text-lighter text-xs lg:text-sm xl:text-base font-bold uppercase rounded hover:bg-gray-100 hover:text-blue-700 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 dark:text-white lg:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent'
                        >
                          Contact us
                        </a>
                      </li>
                      <li>
                        <button
                          type='button'
                          className='btn-contact-sale text-center my-2 ml-3 mr-4 lg:hidden flex items-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200 w-fit px-5 py-2.5 bg-black/40 text-white rounded-lg hover:bg-black/60 text-xs lg:text-sm xl:text-base font-semibold xl:font-bold'
                        >
                          <span className='mr-2'>
                            <IconSvg icon='callIcon' />
                          </span>
                          Contact Sale
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <section>
                <div className='grid grid-cols-1 lg:grid-cols-2 pt-40 max-w-[80%] mx-auto px-8'>
                  <div className='flex items-center'>
                    <div className='pb-[126px]'>
                      <h1 className='text-white text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight font-bold uppercase mb-2 lg:mb-3 xl:mb-5 font-["Open_Sans_Condensed"]'>
                        A simple powerful solution for all your data challenges
                      </h1>
                      <h3 className='text-white text-lg lg:text-xl xl:text-2xl font-normal mb-8'>
                        Support your agency's missions with custom integrated Machine Learning and Artificial
                        Intelligence.
                      </h3>
                      <h3 className='text-lighter text-sm lg:text-base xl:text-lg font-semibold'>
                        Use us with confidence as an authorized <strong>FedRAMP</strong> software
                      </h3>
                      <div className='flex flex-wrap mt-8'>
                        <Link
                          to='/sign-in'
                          className='w-fit h-fit flex items-center font-bold text-base text-white bg-gradient-to-r from-blue-800 to-blue-500 hover:to-blue-600 hover:from-blue-900 p-3.5 rounded-lg  mb-6 mr-4'
                        >
                          <span className='mr-2'>
                            <IconSvg icon='userIcon' />
                          </span>
                          Login
                          <span className='ml-2'>
                            <IconSvg icon='arrowUpRight' />
                          </span>
                        </Link>
                        <Link
                          to='/sign-up'
                          className='w-fit h-fit flex items-center font-bold text-base text-white py-3.5 px-6 rounded-lg mb-6 lg:mb-0 lg:mr-10 bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-500 hover:to-orange-400'
                        >
                          <span className='mr-2'>
                            <IconSvg icon='playCircle' />
                          </span>
                          Get Demo
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className='hidden preLg:flex preLg:items-end ml-auto'>
                    <img src={robotImage} />
                  </div>
                </div>
              </section>
            </section>
            <section className='bg-blue-50'>
              <div className='flex flex-col justify-center items-center max-w-[80%] mx-auto px-8'>
                <img src={browser} className='-mt-24 xl:-mt-36 w-full demo-img' />
                <p className='text-gray-350 font-semibold text-sm lg:text-base xl:text-lg m-10 mx-10 2xl:mx-16 text-center'>
                  Organizations of all types and sizes use Watchtower's Solutions for investigations, analysis, and
                  e-discovery. Watchtower has incorporated the last in technology and machine learning to build a custom
                  solution for you.
                </p>
              </div>
            </section>
            <section className='bg-blue-50  relative'>
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-9 pt-20 pb-10 bg-blue-50 px-8 max-w-[80%] mx-auto'>
                <div className='flex flex-col items-center z-[1]'>
                  <div className='pt-10 px-8 flex flex-col rounded-xl min-h-[450px] h-full w-full bg-gradient-blue'>
                    <h3 className='text-white text-xl xl:text-2xl 2xl:text-3xl font-semibold mb-5'>
                      Work Faster & Smarter, every step of the way.
                    </h3>
                    <p className='text-white text-sm lg:text-base xl:text-lg font-normal mb-16'>
                      Create an on-brand home for your product and countle hours on design time. Use this table to
                      compare your product.
                    </p>
                    <div className='bg-white flex items-center justify-center flex-1 rounded-t-xl'>
                      <img src={logo2Line} className='px-9' />
                    </div>
                  </div>
                </div>
                <div className='pt-12 px-8 rounded-xl min-h-[450px] h-full w-full bg-gradient-orange z-[1]'>
                  <div className='h-full'>
                    <img src={applo} className='w-full h-full' />
                  </div>
                </div>
                <div className='flex flex-col items-center z-[1]'>
                  <div className='pt-10 pb-7 rounded-xl flex flex-col min-h-[450px] h-full w-full bg-gradient-blue'>
                    <div className='mb-8'>
                      <img src={line} className='w-full' />
                    </div>
                    <div className='flex-1 flex flex-col mt-8 px-8'>
                      <h2 className='text-white font-semibold text-4xl mb-5'>137%</h2>
                      <p className='text-white font-normal text-base mb-0'>
                        Create an on-brand home for your product and countle hours on design time. Use this table to
                        compare your product.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='absolute bg-blue-100 h-1/2 bottom-0 left-0 w-full'></div>
              </div>
            </section>
            <div className='bg-gradient-to-b from-blue-100 to-blue-80'>
              <section>
                <div className='flex flex-col justify-center max-w-[80%] mx-auto items-center pt-24'>
                  <h1 className='text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-tight font-bold text-black-500 text-center mb-4 w-3/4'>
                    Work Faster with Better Insight.
                  </h1>
                  <p className='text-sm lg:text-base xl:text-lg font-semibold text-gray-350 text-center w-3/5'>
                    Quickly find crucial data with our state of the technology, before opening your first document.
                  </p>
                </div>
                <div className='bg-left bg-no-repeat bg-[length:50%_100%] bg-[url("assets/media/image/scheduled-transfer-bg.png")]'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10 pb-20 px-16  max-w-[80%] mx-auto'>
                    <div className='flex flex-col items-center justify-center '>
                      <img src={scheduledTransfer} className='w-4/5' />
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                      <div className='flex flex-col items-center justify-center max-w-[500px]'>
                        <h3 className='text-blue-1000 text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold mb-8 '>
                          Support your agency’s missions in a secure cloud-based solution with integrated Machine
                          Learning and AI.
                        </h3>
                        <p className='text-black-500 text-lg font-normal'>
                          Use us with confidence as an authorized <span className='font-bold'>FedRAMP</span> software.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section>
                <div className='pt-20 px-10 relative max-w-[80%] mx-auto'>
                  <p className='text-black text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl leading-[120%] font-bold font-["Open Sans"] md:pr-10 '>
                    Engineered by Retired FBI Agents and Former US Army Intelligence Officers
                  </p>
                  <div className='flex items-center flex-col lg:flex-row mt-10 pb-44'>
                    <div className='flex flex-col gap-10'>
                      <div className='flex items-start'>
                        <div className='p-2 md:p-4 mr-5 md:mr-10 rounded-xl bg-gradient-blue'>
                          <span className='w-6 h-6 md:w-10 md:h-10 flex items-center'>
                            <IconSvg icon='cpuIcon' />
                          </span>
                        </div>
                        <div>
                          <p className='text-blue-1000 font-bold text-lg lg:text-xl xl:text-2xl'>
                            Artificial Intelligence
                          </p>
                          <p className='text-gray-350 font-semibold text-xs lg:text-sm xl:text-base'>
                            We build AI solutions that help you better manage large datasets, e-discovery and research.
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start'>
                        <div className='p-2 md:p-4 mr-5 md:mr-10 rounded-xl bg-gradient-orange'>
                          <span className='w-6 h-6 md:w-10 md:h-10 flex items-center'>
                            <IconSvg icon='chartIcon' />
                          </span>
                        </div>
                        <div>
                          <p className='text-blue-1000 font-bold text-lg lg:text-xl xl:text-2xl'>Effortless Power</p>
                          <p className='text-gray-350 font-semibold text-xs lg:text-sm xl:text-base'>
                            Powerful doesn’t mean complicated, Watchtower Solutions has the speed, scale, automation and
                            analysis you need for faster, easier results.
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start'>
                        <div className='p-2 md:p-4 mr-5 md:mr-10 rounded-xl bg-gradient-blue'>
                          <span className='w-6 h-6 md:w-10 md:h-10 flex items-center'>
                            <IconSvg icon='tickIcon' />
                          </span>
                        </div>
                        <div>
                          <p className='text-blue-1000 font-bold text-lg lg:text-xl xl:text-2xl'>Proactive Security</p>
                          <p className='text-gray-350 font-semibold text-xs lg:text-sm xl:text-base'>
                            We build our products secure and in-house from the ground up and layer on threat
                            intelligence and 24/7 monitoring. This is nothing new, Watchtower has been in the security
                            business forcombined 40 + years.
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start'>
                        <div className='p-2 md:p-4 mr-5 md:mr-10 rounded-xl bg-gradient-orange'>
                          <span className='w-6 h-6 md:w-10 md:h-10 flex items-center'>
                            <IconSvg icon='cpuIcon' />
                          </span>
                        </div>
                        <div className='mt-1'>
                          <p className='text-blue-1000 font-bold text-2xl'>Large Language Model</p>
                          <p className='text-gray-350 font-semibold text-base'>
                            We have built a LLM, leveraging AI, GPT and proprietary technology to make your job fast and
                            easy.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='w-full flex items-center justify-center'>
                      <img src={brain} className='w-80%' />
                    </div>
                  </div>
                  <div className='absolute bg-[url("assets/media/image/get-started-background.png")] w-4/5 flex flex-wrap items-center justify-between py-7 px-14 rounded-[2.5rem] left-1/2 -translate-x-1/2 -bottom-[6%] xl:-bottom-[8%] bg-cover bg-no-repeat'>
                    <div className='flex items-center justify-center'>
                      <p className='text-white font-semibold text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl lg:font-bold'>
                        Let’s get started
                      </p>
                    </div>
                    <div className='flex items-center justify-center'>
                      <button className='px-6 py-3.5 text-xs lg:text-sm xl:text-base font-bold text-white rounded-xl h-fit my-5 bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-500 hover:to-orange-400 flex items-center'>
                        <span className='mr-2'>
                          <IconSvg icon='callIcon' />
                        </span>
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <footer className='bg-black-600'>
              <div className='flex items-center justify-center max-w-[80%] mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 pt-40 pb-24 w-4/5'>
                  <div className='mt-10 lg:col-span-2 max-w-[350px]'>
                    <img src={logoTransparent} />
                    <p className='mt-8 text-lighter font-semibold text-xs lg:text-sm xl:text-base mr-5 flex-auto lg:flex-none'>
                      In the new era of technology we look a in the future with certainty and pride to for our company
                      and business.
                    </p>
                  </div>
                  <div className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:gap-5 xl:gap-16 min-w-[500px]'>
                    <div className='mt-10'>
                      <ul>
                        <li className='mb-7'>
                          <p className='text-sm lg:text-base xl:text-lg text-gray-350 font-bold'>Pages</p>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Features
                          </Link>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Pricing
                          </Link>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Affiliate Program
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Press Kit
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className='mt-10'>
                      <ul>
                        <li className='mb-7'>
                          <p className='text-sm lg:text-base xl:text-lg text-gray-350 font-bold'>Reference Page</p>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Features
                          </Link>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Pricing
                          </Link>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Affiliate Program
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Press Kit
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className='mt-10'>
                      <ul>
                        <li className='mb-7'>
                          <p className='text-sm lg:text-base xl:text-lg text-gray-350 font-bold'>Reference Page</p>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Features
                          </Link>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Pricing
                          </Link>
                        </li>
                        <li className='mb-7'>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Affiliate Program
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='#'
                            className='text-xs lg:text-sm xl:text-base hover:text-blue-700 text-lighter font-normal'
                          >
                            Press Kit
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </>
  )
}

export default LandingPage
