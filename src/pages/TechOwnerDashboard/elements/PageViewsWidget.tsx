import iconWidget from 'assets/media/png/timer-start.png'
import { useAdmin } from 'hooks'

import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { Spinner } from 'ui-atoms'

function PageViewsWidget() {
  const defaultOptions = {
    chart: {
      id: 'apexchart-pageviews',
      toolbar: {
        show: false
      }
    },
    grid: {
      show: true,
      strokeDashArray: 4
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top'
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        opacityFrom: 1,
        opacityTo: 0.2,
        stops: [0, 70, 100],
        shade: '#0253C0',
        gradientToColors: ['#0253C0']
      }
    },
    dataLabels: {
      enabled: false,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#6078A9']
      }
    },
    xaxis: {
      labels: {
        style: {
          cssClass: 'text-xs font-semibold fill-wt-primary-40'
        }
      },
      categories: ['-26 min', '-21 min', '-16 min', '-11 min', '-6 min', '-1 min']
    },
    yaxis: {
      labels: {
        style: {
          cssClass: 'text-xs fill-wt-primary-40'
        }
      }
    }
  }
  const defaultSeries = [
    {
      name: 'series-1',
      data: [0, 0, 0, 0, 0, 0]
    }
  ]
  const adminAPI = useAdmin()
  const [options, setOptions] = useState(defaultOptions)
  const [series, setSeries] = useState(defaultSeries)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getPageViews()
    return () => {
      //
    }
  }, [])

  const getPageViews = () => {
    setIsLoading(true)
    adminAPI.pageViews({
      callback: {
        onSuccess: (res) => {
          setOptions({
            ...defaultOptions,
            xaxis: {
              ...defaultOptions.xaxis,
              categories: res?.items?.map((x: any) => x.time)
            }
          })
          setSeries([
            {
              name: 'Pageviews',
              data: res?.items?.map((x: any) => x.views)
            }
          ])
          setIsLoading(false)
        },
        onFailure: () => {
          setIsLoading(false)
        }
      }
    })
  }

  return (
    <>
      <div className='h-full w-full rounded-lg bg-gray-50'>
        {isLoading ? (
          <div className='flex items-center justify-center w-full h-full'>
            <Spinner />
          </div>
        ) : (
          <>
            <div className='flex items-center p-4'>
              <img src={iconWidget} className='w-7 h-7 mr-3' />
              <label className='text-lg font-bold text-wt-primary-40'>Pageviews</label>
              <div className='border border-wt-primary-75 focus:ring-blue-500 focus:border-blue-500 px-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-[200px] flex items-center rounded-lg ml-auto'>
                <span className='text-wt-primary-75 text-xs font-normal dark:text-white'>Sort by:</span>
                <select
                  className='pr-8 text-wt-primary-40 text-xs font-bold dark:text-white flex-1 border-none focus:ring-0 focus:border-0'
                  defaultValue={''}
                  onChange={() => {}}
                >
                  <option value={''}>Per minute</option>
                </select>
              </div>
            </div>
            <div className='flex flex-col p-4'>
              <div className='w-full h-full bg-gray-100 p-4 rounded-lg'>
                <div className='block w-full h-min-[300px]'>
                  <Chart options={options} series={series} type='bar' width={'100%'} height={320} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default PageViewsWidget
