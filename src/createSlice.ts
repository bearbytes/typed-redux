import { BaseSlice, CreateSliceOptions, CreateSliceResult } from './types'

export function createSlice<T extends BaseSlice>(
  options: CreateSliceOptions<T>
): CreateSliceResult<T> {
  return {
    initialState: options.initialState,
    reducer: options.reducer,
  }
}
