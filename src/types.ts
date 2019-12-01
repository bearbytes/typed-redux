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
  useDispatch(): StoreDispatcher<T>

  getState(): StoreStateEx<T>
  dispatch: StoreDispatcher<T>
}

// createSlice
export interface CreateSliceOptions<T extends BaseSlice> {
  initialState: SliceState<T>
  reducer: SliceReducer<T>
}
export interface CreateSliceResult<T extends BaseSlice> {
  initialState: SliceState<T>
}

// createStoreInstance
export interface StoreInstance<T extends BaseStore> {
  getState(): StoreStateEx<T>
  dispatch: StoreDispatcher<T>
}

// Accessor types
type SliceName<T extends BaseSlice> = T['name']
type SliceState<T extends BaseSlice> = T['state']
type SliceEvent<T extends BaseSlice> = Events<T['events']>
type SliceDispatcher<T extends BaseSlice> = Dispatcher<T>
type SliceReducer<T extends BaseSlice> = Reducer<
  SliceState<T>,
  SliceEvent<T>,
  SliceDispatcher<T>
>

type StoreState<T extends BaseStore> = T['state']
export type StoreStateEx<T extends BaseStore> = StoreStateWithSlices<T>
type StoreEvent<T extends BaseStore> = Events<T['events']>
export type StoreDispatcher<T extends BaseStore> = Dispatcher<T>
export type StoreReducer<T extends BaseStore> = Reducer<
  StoreStateEx<T>,
  StoreEvent<T>,
  StoreDispatcher<T>
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
type ArrayToIntersection<T> = UnionToIntersection<T[keyof T]>
type PayloadAction<TPayload> = {} extends TPayload
  ? () => void
  : (payload: TPayload) => void

export type Dictionary<TValue = any> = Record<string, TValue>

export type Reducer<TState, TEvent, TDispatcher> = (
  state: TState,
  event: TEvent,
  dispatch: TDispatcher
) => TState | void

type Dispatcher<T extends { events: Dictionary<Dictionary> }> = {
  [K in keyof T['events']]: PayloadAction<T['events'][K]>
}

type Events<T> = {
  [K in keyof T]: { type: K; payload: T[K] }
}[keyof T]

// Merge Slice events into Store events
export type StoreEventsWithSlices<TStore extends BaseStore> =
  | Events<TStore>
  | StoreSliceEvents<TStore>

export type StoreSliceEvents<TStore extends BaseStore> = ValuesType<
  SliceEventPartials<TStore>
>
export type SliceEventPartials<TStore extends BaseStore> = {
  [K in keyof StoreSlices<TStore>]: Events<StoreSlices<TStore>[K]['events']> & {
    slice: StoreSlices<TStore>[K]['name']
  }
}

// Merge Slice states into Store state
type StoreStateWithSlices<TStore extends BaseStore> = SliceStateIntersection<
  TStore
> &
  StoreState<TStore>
type SliceStateIntersection<TStore extends BaseStore> = ArrayToIntersection<
  SliceStatePartials<TStore>
>
type SliceStatePartials<TStore extends BaseStore> = {
  [K in keyof StoreSlices<TStore>]: SliceStatePartial<StoreSlices<TStore>[K]>
}
type SliceStatePartial<TSlice extends BaseSlice> = {
  [name in TSlice['name']]: TSlice['state']
}

// Pass createSlice() results into createStore()
export type StoreCreateSliceResults<
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
