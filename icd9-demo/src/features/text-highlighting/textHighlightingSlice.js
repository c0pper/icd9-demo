import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const textHighlightingSlice = createSlice({
  name: 'textHighlighting',
  initialState,
  reducers: {
    setTextHighlighting: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTextHighlighting } = textHighlightingSlice.actions

export default textHighlightingSlice.reducer