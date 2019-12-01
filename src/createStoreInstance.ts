import * as redux from 'redux'
import {
  BaseStore,
  Dictionary,
  StoreDispatcher,
  StoreInstance,
  StoreReducer,
  StoreStateEx,
} from './types'

export function createStoreInstance<T extends BaseStore>(
  initialState: StoreStateEx<T>,
  reducer: StoreReducer<T>
): StoreInstance<T> {
  function reduxReducer(
    state: StoreStateEx<T> | undefined,
    action: redux.Action
  ): StoreStateEx<T> {
    // TODO
    return state ?? initialState
  }

  const reduxStore = redux.createStore(reduxReducer)

  function getState() {
    return reduxStore.getState()
  }

  const dispatch = new Proxy({} as StoreDispatcher<T>, {
    get(target, propertyName) {
      return (payload: Dictionary) => {
        const reduxAction = { type: propertyName, payload }
        reduxStore.dispatch(reduxAction)
      }
    },
  })

  return { getState, dispatch }
}
