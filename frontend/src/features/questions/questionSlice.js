// File: features/question/questionSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addQuestion as apiAddQuestion,
  getRecentQuestions,
} from "@/services/apiQuestions";

// Thunk for adding a question
export const addQuestion = createAsyncThunk(
  "question/addQuestion",
  async ({ object, content, type }, { rejectWithValue }) => {
    try {
      // Call the API function to add a question
      const data = await apiAddQuestion({ object, content, type });
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  },
);
export const getTotalPages = createAsyncThunk(
  "question/getTotalPages",
  async (_, { rejectWithValue }) => {
    try {
      // Call the API function to add a question
      const { totalPages } = await getRecentQuestions(1);
      return totalPages;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  questions: [],
  status: "idle",
  error: null,
  totalPages: null,
  currentPage: null,
  tabs: [
    { name: "Mes Questions", link: "my" },
    { name: "Questions les plus récentes", link: "recents" },
    { name: "Ajouter une question", link: "ajouter" },
  ],
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    // You can add additional synchronous reducers here if needed
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload; // Update totalPages only when fetched
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optionally, push the newly added question into the questions array
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { setCurrentPage, setTotalPages } = questionSlice.actions;
export default questionSlice.reducer;
