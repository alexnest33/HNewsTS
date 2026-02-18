import { configureStore } from "@reduxjs/toolkit";
import { latestNewsSlice } from "../slices/latestNewsSlice";
import { newsDetailsSlice } from "../slices/newsDetailsSlice";

    const store = configureStore({
        reducer: {
         lastNews: latestNewsSlice.reducer,
         details: newsDetailsSlice.reducer,
        }
    })


    export type RootState = ReturnType<typeof store.getState>
    export type AppDispatch = typeof store.dispatch;
    export default store