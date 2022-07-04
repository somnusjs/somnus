class State {

  private static _singleton: State;
  public static get singleton(): State {
    return State._singleton || new State();
  }

  private isPatched: boolean;

  constructor() {
    // tslint:disable-next-line no-console
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    if (State._singleton) {
      // tslint:disable-next-line no-console
      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
      throw new Error('No more than 1 instance of this class is allowed');
    }
  }

  set patch(_) {
    this.isPatched = true;
  }

  get patched(): boolean {
    return this.isPatched;
  }

}

export const setIsNginxUnitPatchedTrue = () => State.singleton.patch = true;

export const getIsNginxUnitPatched = (): boolean => State.singleton.patched;

export default State;