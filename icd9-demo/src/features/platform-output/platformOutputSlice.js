import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

// const WORKFLOW_URL = "http://127.0.0.1:5000/api/get_platform_output"
const WORKFLOW_URL = "http://127.0.0.1:5000/api/get_runner_output"

const initialState = {
  value: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const getPlatformOutput = createAsyncThunk('platformOutput/getPlatformOutput', async (text) => {

  // body for platform
  // const body = {
  //   "body": {
  //     "text": text,
  //     "options":
  //     {
  //         "custom":
  //         {
  //             "normalizeToConceptId": true
  //         }
  //     }
  //   }
  // }

  // body for cpk runner
  const body = {
    "body": {
      "text": text
    }
  }

  try {
    const response = await axios.post(WORKFLOW_URL, body)
    return response.data
  } catch (err) {
    return err.message
  }
})

export const platformOutputSlice = createSlice({
  name: 'platformOutput',
  initialState,
  reducers: {
    setPlatformOutput: (state, action) => {
      state.value = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlatformOutput.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPlatformOutput.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(getPlatformOutput.rejected, (state, action) => {
        state.status = 'failed';
          // Check if the payload contains the 404 status code string
        if (action.payload && action.payload.includes("404")) {
          // Handle 404 error as needed
          state.error = "Not Found";  // Set a custom error message or handle it as needed
        } else {
          state.error = action.payload || "Unknown error";
        }
      });
  },
})

export const selectPlatformOutput = (state) => state.value
export const getPlatformOutputStatus = (state) => state.status
export const getPlatformOutputError = (state) => state.error

// Action creators are generated for each case reducer function
export const { setPlatformOutput } = platformOutputSlice.actions

export default platformOutputSlice.reducer