import { createStore } from './createStore'

type MyStore = {
  state: {
    counter: number
  }
  events: {
    counterIncreased: { by: number }
    counterReset: {}
  }
}

const store = createStore<MyStore>({
  slices: {},
  initialState: {
    counter: 0,
  },
  reducer(state, event) {
    switch (event.type) {
      case 'counterIncreased': {
        state.counter += event.by
        break
      }
      case 'counterReset': {
        state.counter = 0
        break
      }
    }
  },
})

test('bla', () => {
  expect(store.getState().counter).toBe(0)
})
