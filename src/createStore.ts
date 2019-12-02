import {
  createContext,
  DependencyList,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createStoreInstance } from './createStoreInstance'
import {
  BaseStore,
  CreateStoreOptions,
  CreateStoreResult,
  Dictionary,
  StoreDispatch,
  StoreInstance,
  StoreSelector,
  StoreStateEx,
} from './types'

export function createStore<T extends BaseStore>(
  options: CreateStoreOptions<T>
): CreateStoreResult<T> {
  const initialState = { ...options.initialState } as StoreStateEx<T>
  Object.entries(options.slices as Dictionary).forEach(([name, slice]) => {
    Object.assign(initialState, { [name]: slice.initialState })
  })
  const defaultStoreInstance = createStoreInstance(options, initialState)
  const context = createContext<StoreInstance<T>>(defaultStoreInstance)

  function useStore<R>(
    selector: StoreSelector<T, R>,
    dependencyList: DependencyList
  ): R {
    const { subscribe, getState } = useContext(context)
    const [state, setState] = useState(() => selector(getState()))
    useEffect(
      () => subscribe((state) => setState(selector(state))),
      dependencyList
    )
    return state
  }

  function useDispatch(): StoreDispatch<T> {
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
