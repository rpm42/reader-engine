import AppService from './AppService'
import { createProviderWithInit } from './utils/provider-factory'

const tuple = createProviderWithInit<AppService>((app: AppService) => {
  return () => {
    app.init()
  }
})

export const AppProvider = tuple[0]
export const useAppContext = tuple[1]

export default AppProvider
