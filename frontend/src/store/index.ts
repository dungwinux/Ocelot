import { combineReducers, Reducer } from 'redux';
// -- States --
import { NotificationState } from './notification/types';
import { UserLoginState } from './userLogin/types';
import { UserFilesState } from './userFiles/types';
import { CodeEditorState } from './codeEditor/types'; 
// -- Reducers --
import notificationReducer from './notification/reducer';
import userLoginReducer from './userLogin/reducer';
import userFilesReducer from './userFiles/reducer';
import codeEditorReducer from './codeEditor/reducer';
// -- Redux Store --
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { enableBatching } from './batchActions';
// -- Saga stuff -- 
import { all } from 'redux-saga/effects';
import { watchUserLoginRequest } from './userLogin/saga';
import { watchLoadUserFilesRequest, watchCreateNewFile, watchDeleteFile } from './userFiles/saga';
// -- logger --
// import { createLogger } from 'redux-logger';

// root state
export interface RootState {
    notification: NotificationState;
    userLogin: UserLoginState;
    userFiles: UserFilesState;
    codeEditor: CodeEditorState;
}

// combine all reducers
const rootReducer: Reducer<RootState> = combineReducers<RootState>({
    notification: notificationReducer,
    userLogin: userLoginReducer,
    userFiles: userFilesReducer,
    codeEditor: codeEditorReducer,
});

function* rootSaga() { // Combine all sagas 
    yield all([
        watchUserLoginRequest(),
        watchLoadUserFilesRequest(),
        watchCreateNewFile(),
        watchDeleteFile(),
    ]);
}

export const configureStore = () => {

    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        enableBatching(rootReducer),
        applyMiddleware(sagaMiddleware, )
    );

    sagaMiddleware.run(rootSaga);
    return store;
};