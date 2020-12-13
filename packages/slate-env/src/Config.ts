import * as SlateConfig from '@yourwishes/slate-config';

//Constants
export const config = new SlateConfig(require('../slate-env.schema')) as {
  get:(key:string)=>string
};
