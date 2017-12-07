import { Iconographer } from '@buttercup/iconographer';
import storage from './storage';

const iconographer = new Iconographer();
iconographer.storageInterface = storage;

export default iconographer;
