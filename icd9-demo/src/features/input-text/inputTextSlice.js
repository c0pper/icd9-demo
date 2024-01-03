import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const inputTextSlice = createSlice({
  name: 'inputText',
  initialState,
  reducers: {
    setInputText: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setInputText } = inputTextSlice.actions

export default inputTextSlice.reducer