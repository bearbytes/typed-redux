import { createStore } from './createStore'

type MyStore = {
  state: {
    counter: number
    numIncreases: number
  }
  events: {
    counterIncreased: { by: number }
    counterReset: {}
  }
}

function createTestStore() {
  return createStore<MyStore>({
    slices: {},
    initialState: {
      counter: 0,
      numIncreases: 0,
    },
    reducer(state, event, dispatch) {
      switch (event.type) {
        case 'counterIncreased': {
          state.numIncreases++
          state.counter += event.payload.by
          if (state.counter > 10 && state.counter < 100) {
            dispatch.counterIncreased({ by: 1 })
          }
          if (state.counter >= 100) {
            dispatch.counterReset({})
          }
          break
        }
        case 'counterReset': {
          state.counter = 0
          break
        }
      }
    },
  })
}

test('create store', () => {
  const store = createTestStore()
  expect(store.getState().counter).toBe(0)
})

test('dispatch events', () => {
  const store = createTestStore()

  store.dispatch.counterIncreased({ by: 2 })
  expect(store.getState().counter).toBe(2)

  store.dispatch.counterReset({})
  expect(store.getState().counter).toBe(0)
})

test('cascading events', () => {
  const store = createTestStore()

  store.dispatch.counterIncreased({ by: 15 })
  expect(store.getState().counter).toBe(0)
})
