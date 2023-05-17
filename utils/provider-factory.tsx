import React, { createContext, useContext, useEffect } from 'react'

export function createProvider<T>(
  defaultValue: T | null = null
): [React.FC<{ value: T, children: React.ReactNode }>, () => T|null] {
  const context = createContext<T|null>(defaultValue)
  const Provider: React.FC<{ value: T, children: React.ReactNode }> = ({ value, children }) => {
    return <context.Provider value={value}>{children}</context.Provider>
  }
  return [Provider, () => useContext<T|null>(context)]
}

export function createProviderWithInit<T>(
  initFn: (value: T) => () => void,
  defaultValue: T | null = null,
): [React.FC<{ value: T, children: React.ReactNode }>, () => T|null] {
  const context = createContext<T|null>(defaultValue)
  const Provider: React.FC<{ value: T, children: React.ReactNode }> = ({ value, children }) => {
    useEffect(initFn(value), [])
    return <context.Provider value={value}>{children}</context.Provider>
  }
  return [Provider, () => useContext<T|null>(context)]
}

export default createProvider