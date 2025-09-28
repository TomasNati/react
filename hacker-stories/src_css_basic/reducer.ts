import type { Stories } from "./api";
import { type PagerOptionValues } from "./PagerOptions";
import { sortByKey } from './utils';

type ACTION_TYPE =
    'FETCH_STORIES_START' |
    'FETCH_STORIES_COMPLETE' |
    'DELETE_STORY_START' |
    'DELETE_STORY_COMPLETE' |
    'EDIT_STORY_START' |
    'EDIT_STORY_PROCESSING' |
    'EDIT_STORY_COMPLETE' |
    'ADD_STORY_START' |
    'ADD_STORY_PROCESSING' |
    'ADD_STORY_COMPLETE' |
    'SET_ERROR' |
    'CLEAR_ERROR' |
    'CLOSE_STORY_FORM' |
    'SORT'

export interface StoriesState {
    stories: Stories[];
    unsortedStories: Stories[];
    asyncMessage: string;
    storyToEdit: Stories | undefined;
    showForm: boolean;
    sortStatus: SortStatus[];
}

export interface FetchStoriesCompletePayload {
    data: Stories[],
    page: number,
    pagerType: PagerOptionValues
}

export interface SortStatus {
    field: keyof Stories;
    ascending?: boolean
}

interface ReducerAction {
    type: ACTION_TYPE;
    payload: Stories[] | Stories | string | undefined | FetchStoriesCompletePayload | number;
}

const sortStories = (stories: Stories[], sortStatuses: SortStatus[]): Stories[] => {
    const sortInfo = sortStatuses.find(({ ascending }) => ascending !== undefined)
    if (sortInfo) {
        return sortByKey<Stories>(stories, sortInfo.field, sortInfo.ascending)
    } else {
        return stories
    }
}

export const storiesReducer = (state: StoriesState, action: ReducerAction): StoriesState => {
    switch (action.type) {
        case 'FETCH_STORIES_START':
        case 'DELETE_STORY_START':
        case 'EDIT_STORY_PROCESSING':
        case 'ADD_STORY_PROCESSING':
            return {
                ...state,
                asyncMessage: action.payload as string,
            }
        case 'FETCH_STORIES_COMPLETE': {
            const { data, page, pagerType } = action.payload as FetchStoriesCompletePayload
            let newStories: Stories[] = []
            switch (pagerType) {
                case "Clásico":
                    newStories = data
                    break;
                case "Get More (automático)":
                case "Get More (manual)": {
                    newStories = page === 0 ? data : [...state.stories, ...data];
                    break;
                }
                default:
                    break;
            }

            return {
                ...state,
                asyncMessage: '',
                stories: sortStories(newStories, state.sortStatus),
                unsortedStories: newStories,
            };
        }
        case 'DELETE_STORY_COMPLETE':
        case 'EDIT_STORY_COMPLETE':
        case 'ADD_STORY_COMPLETE':
            return {
                ...state,
                asyncMessage: '',
                stories: action.payload as Stories[],
                unsortedStories: action.payload as Stories[]
            };
        case 'SET_ERROR':
            return {
                ...state,
                asyncMessage: action.payload as string
            }
        case 'CLEAR_ERROR':
            return {
                ...state,
                asyncMessage: ''
            }
        case 'EDIT_STORY_START':
            if (!action.payload) {
                throw new Error('No Story to edit')
            }
            return {
                ...state,
                storyToEdit: action.payload as Stories,
                showForm: true
            }
        case 'ADD_STORY_START':
            return {
                ...state,
                storyToEdit: undefined,
                showForm: true
            }
        case 'CLOSE_STORY_FORM':
            return {
                ...state,
                storyToEdit: undefined,
                showForm: false
            }
        case 'SORT': {
            const sortField = action.payload as keyof Stories;
            const sortInfo = state.sortStatus.find(({ field }) => field === sortField);

            if (!sortInfo) throw new Error(`Unknown sort field: ${sortField}`);

            sortInfo.ascending = sortInfo.ascending === undefined
                ? true
                : sortInfo.ascending === true ? false : undefined;

            state.sortStatus.forEach((sortInfo) => {
                if (sortInfo.field !== sortField) {
                    sortInfo.ascending = undefined
                }
            })

            state.stories = sortStories(state.unsortedStories, state.sortStatus);

            return {
                ...state
            }
        }
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
