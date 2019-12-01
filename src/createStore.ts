import { createContext, useContext } from 'react'
import { createStoreInstance } from './createStoreInstance'
import {
  BaseStore,
  CreateStoreOptions,
  CreateStoreResult,
  Dictionary,
  StoreDispatcher,
  StoreInstance,
  StoreSelector,
  StoreStateEx,
} from './types'

export function createStore<T extends BaseStore>(
  options: CreateStoreOptions<T>
): CreateStoreResult<T> {
  // TODO fix typing
  const initialState = { ...options.initialState } as StoreStateEx<T>
  Object.entries(options.slices as Dictionary).forEach(([name, slice]) => {
    Object.assign(initialState, { [name]: slice.initialState })
  })
  const defaultStoreInstance = createStoreInstance(
    initialState,
    options.reducer
  )
  const context = createContext<StoreInstance<T>>(defaultStoreInstance)

  function useStore<R>(selector: StoreSelector<T, R>): R {
    // TODO: change tracking
    const { getState } = useContext(context)
    return selector(getState())
  }

  function useDispatch(): StoreDispatcher<T> {
    const { dispatch } = useContext(context)
    return dispatch
  }

  return {
    useStore,
    useDispatch,
    getState: defaultStoreInstance.getState,
    dispatch: defaultStoreInstance.dispatch,
  }
}
