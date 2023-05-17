import * as React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import AppProvider from './AppProvider'
import AppService from './AppService'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

const appService = new AppService()

root.render(
  <StrictMode>
    <AppProvider value={appService}>
      <App />
    </AppProvider>
  </StrictMode>
)
