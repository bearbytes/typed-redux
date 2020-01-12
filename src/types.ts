import { DependencyList } from 'react'
import { UnionToIntersection, ValuesType } from 'utility-types'

// Abstract base types
export type BaseSlice = {
  name: string
  state: Dictionary
  messages: Dictionary<Dictionary>
}
export type BaseStore = {
  state: Dictionary
  messages: Dictionary<Dictionary>
  slices?: BaseSlice[]
}

// createStore
export type CreateStoreOptions<T extends BaseStore> = {
  initialState: StoreState<T>
  reducers: StoreReducer<T>
  slices: StoreCreateSliceResults<T>
}
export interface CreateStoreResult<T extends BaseStore> {
  useStore<R>(selector: StoreSelector<T, R>, dependencyList?: DependencyList): R
  useDispatch(): StoreDispatch<T>

  getState(): StoreStateEx<T>
  dispatch: StoreDispatch<T>
}

// createSlice
export interface CreateSliceOptions<T extends BaseSlice> {
  initialState: SliceState<T>
  reducer: SliceReducer<T>
}
export interface CreateSliceResult<T extends BaseSlice> {
  initialState: SliceState<T>
  reducer: SliceReducer<T>
}

// createStoreInstance
export interface StoreInstance<T extends BaseStore> {
  getState(): StoreStateEx<T>
  subscribe(listener: StoreListener<T>): () => void
  dispatch: StoreDispatch<T>
}

// Accessor types
type SliceName<T extends BaseSlice> = T['name']
type SliceState<T extends BaseSlice> = T['state']
type SliceMessage<T extends BaseSlice> = MessagesUnion<T['messages']>
export type SliceDispatch<T extends BaseSlice> = Dispatch<T>
type SliceReducer<T extends BaseSlice> = Reducer<
  SliceState<T>,
  T['messages'],
  SliceDispatch<T>
>

type StoreState<T extends BaseStore> = T['state']
export type StoreStateEx<T extends BaseStore> = StoreStateWithSlices<T>
type StoreMessage<T extends BaseStore> = MessagesUnion<T['messages']>
export type StoreDispatch<T extends BaseStore> = StoreDispatchWithSlices<T>
export type StoreReducer<T extends BaseStore> = Reducer<
  StoreStateEx<T>,
  T['messages'],
  StoreDispatch<T>
>
export type StoreSelector<T extends BaseStore, R> = (
  store: StoreStateEx<T>
) => R
export type StoreListener<T extends BaseStore> = (
  state: StoreStateEx<T>
) => void
type StoreSlices<TStore extends BaseStore> = {
  [K in TupleKeys<TStore['slices']>]: Extract<TStore['slices'][K], BaseSlice>
}

// Helper types
type TupleKeys<T> = Exclude<keyof T, keyof []>
export type ArrayToIntersection<T> = UnionToIntersection<T[keyof T]>
type PayloadAction<TPayload> = {} extends TPayload
  ? () => void
  : (payload: TPayload) => void

export type Dictionary<TValue = any> = Record<string, TValue>

type Dispatch<T extends { messages: Dictionary<Dictionary> }> = {
  [K in keyof T['messages']]: PayloadAction<T['messages'][K]>
}

type MessagesUnion<T> = {
  [K in keyof T]: { type: K; payload: T[K] }
}[keyof T]

// Merge Slice messages into Store messages
type StoreMessagesWithSlices<TStore extends BaseStore> =
  | MessagesUnion<TStore>
  | StoreSliceMessages<TStore>

type StoreSliceMessages<TStore extends BaseStore> = ValuesType<
  SliceMessagePartials<TStore>
>
type SliceMessagePartials<TStore extends BaseStore> = {
  [K in keyof StoreSlices<TStore>]: MessagesUnion<
    StoreSlices<TStore>[K]['messages']
  > & {
    slice: StoreSlices<TStore>[K]['name']
  }
}

// Merge Messages into Reducer
export type Reducer<TState, TMessages, TDispatch> = {
  [K in keyof TMessages]: SingleMessageReducer<TState, TMessages[K], TDispatch>
}
type SingleMessageReducer<TState, TMessage, TDispatch> = (
  state: TState,
  payload: TMessage,
  dispatch: TDispatch
) => TState | void

// Merge Slice states into Store state
type StoreStateWithSlices<TStore extends BaseStore> = ArrayToIntersection<
  StoreSlicesPartialState<TStore>
> &
  StoreState<TStore>

type StoreSlicesPartialState<TStore extends BaseStore> = {
  [K in keyof StoreSlices<TStore>]: SingleSlicePartialState<
    StoreSlices<TStore>[K]
  >
}
type SingleSlicePartialState<TSlice extends BaseSlice> = {
  [name in TSlice['name']]: TSlice['state']
}

// Merge Slice dispatchs into Store dispatch
type StoreDispatchWithSlices<TStore extends BaseStore> = ArrayToIntersection<
  StoreSlicesPartialDispatch<TStore>
> &
  Dispatch<TStore>
type StoreSlicesPartialDispatch<TStore extends BaseStore> = {
  [K in keyof StoreSlices<TStore>]: SingleSlicePartialDispatch<
    StoreSlices<TStore>[K]
  >
}
type SingleSlicePartialDispatch<TSlice extends BaseSlice> = {
  [name in TSlice['name']]: SliceDispatch<TSlice>
}

// Pass createSlice() results into createStore()
type StoreCreateSliceResults<
  TStore extends BaseStore
> = CreateSliceResultIntersection<TStore>
type CreateSliceResultIntersection<
  TStore extends BaseStore
> = ArrayToIntersection<CreateSliceResultPartials<TStore>>
type CreateSliceResultPartials<TStore extends BaseStore> = {
  [K in keyof StoreSlices<TStore>]: CreateSliceResultPartial<
    StoreSlices<TStore>[K]
  >
}
type CreateSliceResultPartial<TSlice extends BaseSlice> = {
  [name in TSlice['name']]: CreateSliceResult<TSlice>
}
