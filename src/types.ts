import { UnionToIntersection, ValuesType } from 'utility-types'

// Abstract base types
export type BaseSlice = {
  name: string
  state: Dictionary
  events: Dictionary<Dictionary>
}
export type BaseStore = {
  state: Dictionary
  events: Dictionary<Dictionary>
  slices?: BaseSlice[]
}

// createStore
export type CreateStoreOptions<T extends BaseStore> = {
  initialState: StoreState<T>
  reducer: StoreReducer<T>
  slices: StoreCreateSliceResults<T>
}
export interface CreateStoreResult<T extends BaseStore> {
  useStore<R>(selector: StoreSelector<T, R>): R
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
  dispatch: StoreDispatch<T>
}

// Accessor types
type SliceName<T extends BaseSlice> = T['name']
type SliceState<T extends BaseSlice> = T['state']
type SliceEvent<T extends BaseSlice> = EventsUnion<T['events']>
export type SliceDispatch<T extends BaseSlice> = Dispatch<T>
type SliceReducer<T extends BaseSlice> = Reducer<
  SliceState<T>,
  T['events'],
  SliceDispatch<T>
>

type StoreState<T extends BaseStore> = T['state']
export type StoreStateEx<T extends BaseStore> = StoreStateWithSlices<T>
type StoreEvent<T extends BaseStore> = EventsUnion<T['events']>
export type StoreDispatch<T extends BaseStore> = StoreDispatchWithSlices<T>
export type StoreReducer<T extends BaseStore> = Reducer<
  StoreStateEx<T>,
  T['events'],
  StoreDispatch<T>
>
export type StoreSelector<T extends BaseStore, R> = (
  store: StoreStateEx<T>
) => R
type StoreSlices<TStore extends BaseStore> = {
  [K in keyof TStore['slices']]: TStore['slices'][K] extends BaseSlice
    ? TStore['slices'][K]
    : never
}

// Helper types
export type ArrayToIntersection<T> = UnionToIntersection<T[keyof T]>
type PayloadAction<TPayload> = {} extends TPayload
  ? () => void
  : (payload: TPayload) => void

export type Dictionary<TValue = any> = Record<string, TValue>

type Dispatch<T extends { events: Dictionary<Dictionary> }> = {
  [K in keyof T['events']]: PayloadAction<T['events'][K]>
}

type EventsUnion<T> = {
  [K in keyof T]: { type: K; payload: T[K] }
}[keyof T]

// Merge Slice events into Store events
type StoreEventsWithSlices<TStore extends BaseStore> =
  | EventsUnion<TStore>
  | StoreSliceEvents<TStore>

type StoreSliceEvents<TStore extends BaseStore> = ValuesType<
  SliceEventPartials<TStore>
>
type SliceEventPartials<TStore extends BaseStore> = {
  [K in keyof StoreSlices<TStore>]: EventsUnion<
    StoreSlices<TStore>[K]['events']
  > & {
    slice: StoreSlices<TStore>[K]['name']
  }
}

// Merge Events into Reducer
export type Reducer<TState, TEvents, TDispatch> = {
  [K in keyof TEvents]: SingleEventReducer<TState, TEvents[K], TDispatch>
}
type SingleEventReducer<TState, TEvent, TDispatch> = (
  state: TState,
  payload: TEvent,
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
