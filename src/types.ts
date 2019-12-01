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
export type CreateStoreOptions<TStore extends BaseStore> = {
  initialState: StoreState<TStore>
  reducer: StoreReducer<TStore>
  slices: StoreCreateSliceResults<TStore>
}
export interface CreateStoreResult<TStore extends BaseStore> {
  useStore<R>(selector: StoreSelector<TStore, R>): R
  useDispatch(): StoreDispatcher<TStore>
  dispatch: StoreDispatcher<TStore>
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

// Function types
export type Dictionary<TValue = any> = Record<string, TValue>
export type Select<TState, TResult> = Func<TState, TResult>

export type Reducer<TState, TEvent, TDispatcher> = Func3<
  TState,
  TEvent,
  TDispatcher,
  TState | void
>

// Helper types
type ArrayToIntersection<T> = UnionToIntersection<T[keyof T]>
type ArrayToUnion<T> = T[keyof T]
type Action<A1> = (arg1: A1) => void
type Func<A1, R> = (arg1: A1) => R
type Func2<A1, A2, R> = (arg1: A1, arg2: A2) => R
type Func3<A1, A2, A3, R> = (arg1: A1, arg2: A2, arg3: A3) => R

// Complex helper types
type Dispatcher<T extends { events: Dictionary<Dictionary> }> = {
  [K in keyof T['events']]: (payload: T['events'][K]) => void
}
type Events<T> = {
  [K in keyof T]: { type: K } & T[K]
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
