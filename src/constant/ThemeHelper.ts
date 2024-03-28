import { FlowbiteDatepickerTheme } from 'flowbite-react'

class ThemeHelper {
  static MODAL_THEME = {
    content: {
      base: 'relative h-full w-full p-4 md:h-auto',
      inner: 'relative rounded-xl bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh]'
    },
    footer: {
      base: 'flex items-center justify-end space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600',
      popup: 'border-t'
    }
  }
  static TOGGLE_SWITCH = {
    root: {
      base: 'group relative flex items-center rounded-lg focus:outline-none',
      active: {
        on: 'cursor-pointer',
        off: 'cursor-not-allowed opacity-50'
      },
      label: 'ml-3 text-base font-bold text-wt-primary-40 dark:text-gray-300'
    },
    toggle: {
      base: 'toggle-bg rounded-full border group-focus:ring-4 group-focus:ring-cyan-500/25',
      checked: {
        on: 'after:translate-x-full after:border-white',
        off: 'border-gray-200 bg-gray-200 dark:border-gray-600 dark:bg-gray-700',
        color: {
          blue: ' bg-blue-500 border-blue-500',
          dark: 'bg-dark-700 border-dark-900',
          failure: 'bg-red-700 border-red-900',
          gray: 'bg-gray-500 border-gray-600',
          green: 'bg-green-600 border-green-700',
          light: 'bg-light-700 border-light-900',
          red: 'bg-red-700 border-red-900',
          purple: 'bg-purple-700 border-purple-900',
          success: 'bg-green-500 border-green-500',
          yellow: 'bg-yellow-400 border-yellow-400',
          warning: 'bg-yellow-600 border-yellow-600',
          cyan: 'bg-cyan-500 border-cyan-500',
          lime: 'bg-lime-400 border-lime-400',
          indigo: 'bg-indigo-400 border-indigo-400',
          teal: 'bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4',
          info: 'bg-cyan-600 border-cyan-600',
          pink: 'bg-pink-600 border-pink-600'
        }
      },
      sizes: {
        sm: 'w-9 h-5 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4',
        md: 'w-11 h-6 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5',
        lg: 'w-14 h-7 after:absolute after:top-0.5 after:left-[4px] after:h-6 after:w-6'
      }
    }
  }
  static DATEPICKER: any = {
    root: {
      base: 'relative',
      input: {
        field: {
          base: 'datepicker-control',
          icon: {
            base: 'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'
          },
          rightIcon: {
            base: ''
          },
          input: {
            base: 'datepicker-input'
          }
        }
      }
    },
    popup: {
      root: {
        base: 'absolute top-0 z-50 block pt-2'
      },
      footer: {
        button: {
          base: 'w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-blue-300',
          today: 'bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700',
          clear:
            'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        }
      }
    },
    views: {
      days: {
        items: {
          item: { selected: 'bg-blue-700 text-white hover:bg-blue-600' }
        }
      },
      months: {
        items: {
          item: { selected: 'bg-blue-700 text-white hover:bg-blue-600' }
        }
      },
      years: {
        items: {
          item: { selected: 'bg-blue-700 text-white hover:bg-blue-600' }
        }
      },
      decades: {
        items: {
          item: { selected: 'bg-blue-700 text-white hover:bg-blue-600' }
        }
      }
    }
  }
}

export default ThemeHelper
