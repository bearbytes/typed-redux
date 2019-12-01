import { createSlice } from './createSlice'
import { createStore } from './createStore'

type CounterSlice = {
  name: 'counter'
  state: {
    counter: number
  }
  events: {
    counterIncreased: { by: number }
  }
}

type TestStore = {
  slices: [CounterSlice]
  state: {}
  events: {}
}

function createTestStore() {
  const counterSlice = createSlice<CounterSlice>({
    initialState: {
      counter: 0,
    },
    reducer(state, event) {
      switch (event.type) {
        case 'counterIncreased': {
          state.counter += event.payload.by
        }
      }
    },
  })

  return createStore<TestStore>({
    slices: {
      counter: counterSlice,
    },
    initialState: {},
    reducer(state, event, dispatch) {},
  })
}

test('create store', () => {
  const store = createTestStore()
  expect(store.getState().counter.counter).toBe(0)
})

test('dispatch action', () => {
  const store = createTestStore()

  store.dispatch.counter.counterIncreased({ by: 2 })
  expect(store.getState().counter.counter).toBe(2)
})
