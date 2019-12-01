// import { createSlice } from './createSlice'
// import { createStore } from './createStore'

// // Slice
// type SettingsSlice = {
//   name: 'settings'
//   state: {
//     fontSize: number
//     colorScheme: string
//   }
//   events: {
//     colorSchemeToggled: {}
//     fontSizeChanged: { fontSize: number }
//   }
// }

// const settingsSlice = createSlice<SettingsSlice>({
//   initialState: {
//     colorScheme: 'abc',
//     fontSize: 14,
//   },
//   reducer(state, event, dispatch) {},
// })

// // TodoSlice
// type TodoSlice = {
//   name: 'todos'
//   state: {
//     todos: { id: number; text: string }[]
//   }
//   events: {
//     todoAdded: {}
//     todoDone: { id: number }
//   }
// }

// const todoSlice = createSlice<TodoSlice>({
//   initialState: {
//     todos: [],
//   },
//   reducer(state, event, dispatch) {},
// })

// // Store
// type Store = {
//   slices: [SettingsSlice]
//   state: {
//     foo: string
//   }
//   events: {
//     appStarted: {}
//     messageLogged: { message: string }
//   }
// }

// const store = createStore<Store>({
//   slices: {
//     settings: settingsSlice,
//   },
//   initialState: {
//     foo: 'bar',
//   },
//   reducer(state, event, dispatch) {},
// })

// store.dispatch.appStarted({})
// store.dispatch.messageLogged({ message: 'hello' })
