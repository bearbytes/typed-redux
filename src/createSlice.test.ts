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

type SettingsSlice = {
  name: 'settings'
  state: {}
  events: {
    foo: {}
  }
}

type TestStore = {
  slices: [CounterSlice, SettingsSlice]
  state: {}
  events: {}
}

function createTestStore() {
  const counterSlice = createSlice<CounterSlice>({
    initialState: {
      counter: 0,
    },
    reducer: {
      counterIncreased(s, e) {
        s.counter += e.by
      },
    },
  })

  const settingsSlice = createSlice<SettingsSlice>({
    initialState: {},
    reducer: {
      foo() {},
    },
  })

  return createStore<TestStore>({
    slices: {
      counter: counterSlice,
      settings: settingsSlice,
    },
    initialState: {},
    reducer: {},
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
