import { Film } from '../types/Film';
import { User } from '../types/User';
import { Series } from '../types/Series';

export interface SearchResults {
    users: User[];
    films: Film[];
    series: Series[];
};