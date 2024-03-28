/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xl: '1440px',
        preLg: '1024px'
      },
      padding: {
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        top: {
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem'
        },
        bottom: {
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem'
        },
        left: {
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem'
        },
        right: {
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem'
        }
      },
      colors: {
        wt: {
          primary: {
            1: '#2566AF',
            2: '#024189',
            3: '#00153C',
            4: '#001131',
            5: '#AAC5ED',
            10: '#E7ECF8',
            20: '#E4E8F0',
            30: '#B0C1E4',
            40: '#6078A9',
            50: '#2566AF',
            55: '#2666B0',
            59: '#0C2250',
            60: '#00153C',
            65: '#011132',
            70: '#0C2250',
            75: '#B4C4DD',
            80: '#D7EDFF',
            85: '#F5FBFF',
            90: '#BAE0FF',
            95: '#FFAD68',
            100: '#FFFBF9',
            105: '#FFD6B4',
            110: '#F3F4F6',
            115: '#1875F0',
            120: '#263E70',
            125: '#EEF1F5',
            130: '#F8FAFC'
          },
          yellow: {
            1: '#FEC327'
          },
          orange: {
            1: '#FA8C16',
            2: '#FFD6B4',
            3: '#FFAD68',
            4: '#FFFBF9',
            5: '#FA8C16'
          },
          red: {
            1: '#FF4D4F'
          },
          green: {
            1: "#02C087"
          }
        },
        'menu-group': '#000A21',
        'linear-blue': '#1B86FF',
        'yellow-600': '#FEC327',
        'black-500': '#011132',
        'black-600': '#00153C',
        'gray-50': '#F9FAFB',
        'gray-100': '#F2F4F7',
        'gray-200': '#EAECF0',
        'gray-300': '#E7ECF8',
        'gray-350': '#6078A9',
        'gray-400': '#98A2B3',
        'gray-450': '#F1F2F4',
        'gray-500': '#667085',
        'gray-600': '#475467',
        'gray-700': '#344054',
        'gray-800': '#1D2939',
        'gray-900': '#101828',
        'success-50': '#ECFDF3',
        'success-500': '#12B76A',
        'success-600': '#039855',
        'success-700': '#027A48',
        'purple-845': '#845ADF',
        'blue-23b': '#23B7E5',
        'blue-20': '#BAE0FF',
        'blue-50': '#E9F3FF',
        'blue-base': '#F3F4F6',
        'blue-80': '#F0F9FF',
        'blue-100': '#D7EDFF',
        'blue-200': '#1875F0',
        'blue-400': '#2666B0',
        'blue-500': '#1B86FF',
        'blue-600': '#0253C0',
        'blue-1000': '#263E70',
        'red-e65': '#E6533C',
        'primary-50': '#EFF8FF',
        'primary-600': '#1570EF',
        'error-50': '#FEF3F2',
        'error-100': '#FEE4E2',
        'error-500': '#F04438',
        'error-600': '#D92D20',
        'warning-50': '#FFFAEB',
        'warning-700': '#B54708',
        'orange-50': '#FFE7BA',
        'orange-80': '#FAD6BB',
        'orange-100': '#FFA940',
        'orange-150': '#FFD6B4',
        'orange-200': '#FA8C16',
        'orange-300': '#FFAD68',
        'orange-400': '#ED853A',
        'orange-500': '#AE4900',
        lighter: '#B4C4DD'
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        body: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ]
      },
      transitionProperty: {
        width: 'width'
      },
      textDecoration: ['active'],
      minWidth: {
        kanban: '28rem'
      },
      boxShadow: {
        loading: "0px 0px 8px -4px rgba(16, 24, 40, 0.03), 0px 0px 24px -4px rgba(16, 24, 40, 0.08)"
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
