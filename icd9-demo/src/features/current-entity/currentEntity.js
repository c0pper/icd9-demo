import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const currentEntitySlice = createSlice({
  name: 'currentEntity',
  initialState,
  reducers: {
    setCurrentEntity: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentEntity } = currentEntitySlice.actions

export default currentEntitySlice.reducer