import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

// const processUrl = "http://127.0.0.1:5000/api/process_platform_output"
const processUrl = "http://127.0.0.1:5000/api/process_runner_output"


const initialState = {
  value: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};


export const processPlatformOutput = createAsyncThunk('processedPlatformOutput/getProcessedPlatformOutput', async (platformOutput) => {
  //platform body
  // const request = {
  //   "platform_out": platformOutput
  // }

  //runner body
  const request = {
    "runner_out": platformOutput
  }
  try {
    const response = await axios.post(
      processUrl, 
      request, 
      {headers: {"Content-Type": "application/json"}}
    )
    return response.data
  } catch (error) {
    console.log(error)
  }
})

export const processedPlatformOutputSlice = createSlice({
  name: 'processedPlatformOutput',
  initialState,
  reducers: {
    setProcessedPlatformOutput: (state, action) => {
      state.value = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processPlatformOutput.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(processPlatformOutput.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(processPlatformOutput.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
})

export const selectProcessedPlatformOutput = (state) => state.value
export const getProcessedPlatformOutputStatus = (state) => state.status
export const getProcessedPlatformOutputError = (state) => state.error

// Action creators are generated for each case reducer function
export const { setProcessedPlatformOutput } = processedPlatformOutputSlice.actions

export default processedPlatformOutputSlice.reducer