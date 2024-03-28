import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import registerServiceWorker from './registerServiceWorker'
import { AppProvider } from './providers/AppProvider.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'

import 'react-toastify/dist/ReactToastify.css'
import 'react-sliding-pane/dist/react-sliding-pane.css'

import './index.css'
import './assets/css/form.css'
import './assets/css/button.css'
import './assets/css/react-select.css'
import './assets/css/table.css'
import './assets/css/pagination.css'
import { GlobalContextProvider, SignalProvider, SocketIOFinAwareProvider, SocketIOProvider } from 'providers/index.ts'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppProvider>
    <AuthProvider>
      <SocketIOProvider>
        <SocketIOFinAwareProvider>
          <SignalProvider>
            <GlobalContextProvider>
              <App />
            </GlobalContextProvider>
          </SignalProvider>
        </SocketIOFinAwareProvider>
      </SocketIOProvider>
    </AuthProvider>
  </AppProvider>
)
registerServiceWorker()
