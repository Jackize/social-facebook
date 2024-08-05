// utils/localStorage.js

export const loadState = () => {
    try {
      const serializedState = localStorage.getItem('user');
      if (serializedState === null) {
        return undefined;
      }
      return { user: JSON.parse(serializedState) };
    } catch (err) {
      console.error('Could not load state', err);
      return undefined;
    }
  };
  
  export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (err) {
      console.error('Could not save state', err);
    }
  };
  