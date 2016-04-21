/**
 * Factory creating a very simple reducer that listens to two actions: one resetting the state and
 * the other updating. Typical use-case is a reducer that only accepts data sent from a server
 * and nothing else.
 */
class StorageReducerFactory {
  setInitialState(initialState) {
    this.initialState = initialState;
    return this;
  }

  setResetAction(action) {
    this.resetAction = action;
    return this;
  }

  setUpdateAction(action) {
    this.updateAction = action;
    return this;
  }

  setUpdate(update) {
    this.update = update;
    return this;
  }

  create() {
    if (!this.initialState) {
      throw new Error('Please set initial state');
    }
    if (!this.resetAction) {
      throw new Error('Please set action resetting the reducer\'s contenẗ́');
    }
    if (!this.updateAction) {
      throw new Error('Please set action updating the reducer\'s content');
    }
    if (!this.update) {
      throw new Error('Please define the updating function');
    }

    return (state = this.initialState, action) => {
      switch (action.type) {
        case this.resetAction:
          return this.initialState;

        case this.updateAction:
          return this.update(action.payload);
      }
      return state;
    }
  }
}

export default () => new StorageReducerFactory();