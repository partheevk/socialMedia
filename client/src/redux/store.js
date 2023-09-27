import {configureStore} from '@reduxjs/toolkit'
import appConfigReducer from './slices/appConfigureSlice'
import postReducer from './slices/postsSlice'
import FeedReducer from './slices/feedSlice'

export default configureStore({
    reducer:{
        appConfigReducer,
        postReducer,
        FeedReducer
    }
})

