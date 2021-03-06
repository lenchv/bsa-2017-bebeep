import * as actions from './actionTypes';

const initialState = {
    current_driver_profile: {},
    current_passenger_profile: {},
    is_fetched: null
};

export default function (state = initialState, action) {
    switch(action.type) {
        case actions.PUBLIC_DRIVER_PROFILE_SET_STATE:
            return {
                ...state,
                current_driver_profile: action.profile
            };
        case actions.PUBLIC_PASSENGER_PROFILE_SET_STATE:
            return {
                ...state,
                current_passenger_profile: action.profile
            };
        case actions.PUBLIC_PROFILE_SET_REQUEST_STATUS:
            return {
                ...state,
                is_fetched: action.status
            };
        default:
            return state;
    }
}
