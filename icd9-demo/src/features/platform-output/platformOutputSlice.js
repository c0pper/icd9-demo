import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";

const WORKFLOW_URL = "http://127.0.0.1:5000/api/get_platform_output"


const initialState = {
  value: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const getPlatformOutput = createAsyncThunk('platformOutput/getPlatformOutput', async (text) => {

  const body = {
    "body": {
      "text": text,
      "options":
      {
          "custom":
          {
              "normalizeToConceptId": true
          }
      }
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
        state.error = action.error.message;
      });
  },
})

export const selectPlatformOutput = (state) => state.value
export const getPlatformOutputStatus = (state) => state.status
export const getPlatformOutputError = (state) => state.error

// Action creators are generated for each case reducer function
export const { setPlatformOutput } = platformOutputSlice.actions

export default platformOutputSlice.reducer