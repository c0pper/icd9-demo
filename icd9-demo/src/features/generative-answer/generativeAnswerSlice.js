import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const generativeAnswerSlice = createSlice({
  name: 'generativeAnswer',
  initialState,
  reducers: {
    setGenerativeAnswer: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setGenerativeAnswer } = generativeAnswerSlice.actions

export default generativeAnswerSlice.reducer