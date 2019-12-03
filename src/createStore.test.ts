import { createStore } from './createStore'

type CounterStore = {
  state: {
    counter: number
  }
  messages: {
    counterIncreased: { by: number }
    counterReset: {}
  }
}

function createTestStore() {
  return createStore<CounterStore>({
    slices: {},
    initialState: {
      counter: 0,
    },
    reducers: {
      counterIncreased(s, m, dispatch) {
        s.counter += m.by
        if (s.counter > 10 && s.counter < 100) {
          dispatch.counterIncreased({ by: 1 })
        }
        if (s.counter >= 100) {
          dispatch.counterReset()
        }
      },
      counterReset(s) {
        s.counter = 0
      },
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

  store.dispatch.counterReset()
  expect(store.getState().counter).toBe(0)
})

test('cascading events', () => {
  const store = createTestStore()

  store.dispatch.counterIncreased({ by: 15 })
  expect(store.getState().counter).toBe(0)
})
