declare global {
  interface Window {
    process?: Record<string, any>;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

import {createStore, compose, applyMiddleware, combineReducers, Reducer, StoreEnhancer} from 'redux';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import {lazyReducerEnhancer} from '@unicef-polymer/etools-utils/dist/pwa.utils';

import app, {AppState} from './reducers/app.js';
import {ActiveLanguageState} from './reducers/active-language.js';
import {agreements, AgreementsState} from './reducers/agreements.js';
import {AppAction} from './actions/app.js';
import {AgreementsAction} from './actions/agreements.js';
import {LanguageAction} from './actions/active-language';
import {UserAction} from './actions/user.js';
import {UserState} from './reducers/user.js';
import {CommonDataAction} from './actions/common-data';
import {CommonDataState} from './reducers/common-data';

// Overall state extends static states and partials lazy states.
export interface RootState {
  app?: AppState;
  user?: UserState;
  agreements?: AgreementsState;
  commonData?: CommonDataState;
  interventions?: any;
  activeLanguage?: ActiveLanguageState;
}

// could be more than one action AppAction | OtherAppAction ...
// TODO: remove any and find a way to fix generated ts-lint errors
export type RootAction = AppAction | UserAction | CommonDataAction | AgreementsAction | LanguageAction | any;

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const devCompose: <Ext0, Ext1, StateExt0, StateExt1>(
  f1: StoreEnhancer<Ext0, StateExt0>,
  f2: StoreEnhancer<Ext1, StateExt1>
) => StoreEnhancer<Ext0 & Ext1, StateExt0 & StateExt1> = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created) and redux-thunk (so
// that you can dispatch async actions). See the "Redux and state management"
// section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management
export const store = createStore(
  (state) => state as Reducer<RootState, RootAction>,
  devCompose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk as ThunkMiddleware<RootState, RootAction>))
);

// Initially loaded reducers.
store.addReducers({
  app,
  agreements
});

/**
 * IMPORTANT!
 * For any other reducers use lazy loading like this (in the element that needs the reducer)
 *    import counter from '../reducers/x-reducer.js';
 *    store.addReducers({
 *       xReducer
 *   });
 */

export type ReduxDispatch = typeof store.dispatch;
