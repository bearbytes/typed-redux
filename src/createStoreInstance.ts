import * as immer from 'immer'
import * as redux from 'redux'
import {
  BaseStore,
  CreateStoreOptions,
  Dictionary,
  SliceDispatch,
  StoreDispatch,
  StoreInstance,
  StoreListener,
  StoreStateEx,
} from './types'

export function createStoreInstance<T extends BaseStore>(
  options: CreateStoreOptions<T>,
  initialState: StoreStateEx<T>
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

    const stateAfterUpdate = reduxStore.getState()
    listeners.forEach((listener) => listener(stateAfterUpdate))
  }

  function reduxReducer(
    prevState: StoreStateEx<T> | undefined,
    action: redux.Action<string>
  ): StoreStateEx<T> {
    if (prevState == undefined) {
      return initialState
    }

    for (const sliceName in options.slices) {
      const slice = options.slices[sliceName] as any

      const prefix = `${sliceName}/`
      if (!action.type.startsWith(prefix)) continue

      const nextState = immer.produce(prevState, (draft) => {
        const state = (draft as any)[sliceName]
        const type = action.type.substring(prefix.length)
        const payload = (action as any).payload
        return slice.reducers[type](state, payload, dispatch) as any
      })

      return nextState
    }

    const nextState = immer.produce(prevState, (draft) => {
      const state = draft as any
      const { type, payload } = action as any
      return options.reducers[type](state, payload, dispatch) as any
    })

    return nextState
  }

  const sliceDispatchs: Dictionary = {}
  for (const sliceName in options.slices) {
    sliceDispatchs[sliceName] = new Proxy({} as SliceDispatch<any>, {
      get(_, propertyName) {
        if (typeof propertyName != 'string') {
          throw Error('invalid member access on dispatch')
        }
        return (payload: Dictionary) => {
          dispatchOrQueue({ type: `${sliceName}/${propertyName}`, payload })
        }
      },
    })
  }

  const dispatch = new Proxy({} as StoreDispatch<T>, {
    get(_, propertyName) {
      if (typeof propertyName != 'string') {
        throw Error('invalid member access on dispatch')
      }
      const slice = sliceDispatchs[propertyName]
      if (slice) return slice

      return (payload: Dictionary) => {
        dispatchOrQueue({ type: propertyName, payload })
      }
    },
  })

  function getState() {
    return reduxStore.getState()
  }

  const listeners = new Set<StoreListener<T>>()
  function subscribe(listener: StoreListener<T>): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, dispatch, subscribe }
}
