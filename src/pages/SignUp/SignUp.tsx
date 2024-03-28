import './style.css'
import logo from 'assets/media/image/sign-up-logo.png'

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks'
import { valiator } from 'utils'
import RegexHelper from 'constant/RegexHelper'
import UIHelperClass from 'constant/UIHelper'
import { Button, IconSvg } from 'ui-atoms'
import { WtShieldSecurity, WtSignUpCpu, WtSpeedOMeter, WtTranslate } from 'ui-atoms/Icons'
import { Step1, Step2 } from './elements'
import { ToastControl } from 'utils/toast'

function SignUp() {
  const step2Ref = useRef<any>(null)
  const navigate = useNavigate()
  const auth = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [firstRender, setFirstRender] = useState(false)
  const [registerParams, setRegisterParams] = useState<Auth.RegisterParams>({
    registerType: '',
    activationCode: '',
    memberships: [],
    email: '',
    password: '',
    agency: '',
    fieldOffice: '',
    squad: '',
    fullName: '',
    phone: ''
  })

  useEffect(() => {
    // did mount or update mount
    setMode()
    if (firstRender == false) {
      renderClass()
    }

    return () => {
      // unmount
    }
  }, [])

  const renderClass = () => {
    setFirstRender(true)
  }

  const setMode = () => {
    const root = document.getElementsByTagName('html')[0]
    const mode = localStorage.getItem('mode')
    if (mode === 'dark') {
      root.setAttribute('class', 'dark')
      setIsDarkMode(true)
    } else if (mode === 'light') {
      root.setAttribute('class', '')
      setIsDarkMode(false)
    }
  }

  const goToCreateAccountSuccessfullyPage = () => {
    navigate({
      pathname: '/create-account-successfully',
      search: '?email=' + registerParams.email
    })
  }

  const requestRegister = (params: Auth.RegisterParams) => {
    step2Ref?.current?.setIsSubmitting(true)
    auth.register({
      params: params,
      callback: {
        onSuccess: (res: any) => {
          goToCreateAccountSuccessfullyPage()
        },
        onFailure: (err) => {
          ToastControl.showErrorMessage(err)
          step2Ref?.current?.setIsSubmitting(false)
        },
        onFinish: () => {
          step2Ref?.current?.setIsSubmitting(false)
        }
      }
    })
  }

  const onNextStep = (e: Auth.RegisterParams) => {
    console.log(e)
    setRegisterParams(e)
    setCurrentStep(2)
    step2Ref?.current?.resetForm()
  }

  const onBackStep = () => {
    setCurrentStep(1)
  }

  const onCreateAccount = (e: Auth.RegisterParams) => {
    console.log(e)
    const tmp: Auth.RegisterParams = {
      ...registerParams,
      email: e.email,
      password: e.password,
      phone: e.phone
    }
    setRegisterParams(tmp)
    requestRegister(tmp)
  }

  return (
    <>
      <main className='bg-white dark:bg-gray-900'>
        <div className='w-full min-h-screen'>
          <div className='w-full min-h-screen grid sm:grid-cols-2'>
            <div className='min-h-screen bg-[url("/assets/media/png/sign-up-bg.png")] bg-no-repeat bg-cover bg-bottom w-full flex justify-center'>
              <div className='intro-div flex items-center justify-center py-10 md:py-3 '>
                <div className='w-[80%] py-24'>
                  <img src={logo} className='xl:mb-10 lg:mb-6 mb-4 xl:h-24 lg:h-16 h-12' />
                  <p className='text-white lg:text-2xl text-base font-normal leading-[150%] my-20'>
                    Support your agency's missions with custom integrated Machine Learning and Artificial Intelligence.
                  </p>
                  <div className='flex flex-col xl:space-y-6 lg:space-y-4 space-y-3 mt-6'>
                    <div className='flex items-center space-x-6'>
                      <WtSignUpCpu className='w-10 h-10' />
                      <p className='mb-0 text-white xl:text-lg lg:text-base text-lg font-bold'>
                        Artificial Intelligence
                      </p>
                    </div>
                    <div className='flex items-center space-x-6'>
                      <WtSpeedOMeter className='w-10 h-10' />
                      <p className='mb-0 text-white xl:text-lg lg:text-base text-lg font-bold'>Effortless Power</p>
                    </div>
                    <div className='flex items-center space-x-6'>
                      <WtShieldSecurity className='w-10 h-10' />
                      <p className='mb-0 text-white xl:text-lg lg:text-base text-lg font-bold'>Proactive Security</p>
                    </div>
                    <div className='flex items-center space-x-6'>
                      <WtTranslate className='w-10 h-10' />
                      <p className='mb-0 text-white xl:text-lg lg:text-base text-lg font-bold'>Large Language Model</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full min-h-screen'>
              <div className={currentStep === 1 ? '' : 'hidden'}>
                <Step1 onNext={onNextStep} />
              </div>
              <div className={currentStep === 2 ? '' : 'hidden'}>
                <Step2 ref={step2Ref} onBack={onBackStep} onCreateAccount={onCreateAccount} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignUp
