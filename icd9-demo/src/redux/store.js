import { configureStore } from '@reduxjs/toolkit'
import inputTextReducer from '@slices/input-text/InputTextSlice'
import platformOutputReducer from '@slices/platform-output/platformOutputSlice'
import processedPlatformOutputReducer from '@slices/processed-platform-output/processedPlatformOutputSlice'
import textHighlightingReducer from '@slices/text-highlighting/textHighlightingSlice'
import currentEntityReducer from '@slices/current-entity/currentEntity'
import generativeAnswerReducer from '@slices/generative-answer/generativeAnswerSlice'

export const store = configureStore({
  reducer: {
    inputText: inputTextReducer,
    platformOutput: platformOutputReducer,
    processedPlatformOutput: processedPlatformOutputReducer,
    textHighlighting: textHighlightingReducer,
    currentEntity: currentEntityReducer,
    generativeAnswer: generativeAnswerReducer,
  },
})
