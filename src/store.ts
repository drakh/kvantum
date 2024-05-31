import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

const store = configureStore<Record<string, never>>({
  reducer: combineReducers({}),
  // middleware: [
  //   (store:any) => (next:any) => (action: PayloadAction) => {
  //     next(action);
  //     // if (action.type !== setPlaying.type && action.type !== setStep.type) {
  //     //   const newState = store.getState();
  //     //   localStorage.setItem('state', JSON.stringify(newState));
  //     // }
  //   },
  // ],
});

export { store };
