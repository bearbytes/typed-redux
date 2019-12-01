import * as immer from 'immer'
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
  storeReducer: StoreReducer<T>
): StoreInstance<T> {
  let inReducer = false
  let actionQueue: any[] = []

  const reduxStore = redux.createStore(reduxReducer)

  function dispatchOrQueue(action: any) {
    actionQueue.push(action)
    if (inReducer) return

    inReducer = true
    while (actionQueue.length > 0) {
      reduxStore.dispatch(actionQueue.shift())
    }
    inReducer = false
  }

  function reduxReducer(
    prevState: StoreStateEx<T> | undefined,
    action: redux.Action
  ): StoreStateEx<T> {
    const nextState =
      prevState == undefined
        ? initialState
        : immer.produce(prevState, (draft) => {
            const state = draft as any
            const event = action as any
            return storeReducer(state, event, dispatch) as any
          })

    return nextState
  }

  const dispatch = new Proxy({} as StoreDispatcher<T>, {
    get(target, propertyName) {
      return (payload: Dictionary) => {
        dispatchOrQueue({ type: propertyName, payload })
      }
    },
  })

  function getState() {
    return reduxStore.getState()
  }

  return { getState, dispatch }
}
