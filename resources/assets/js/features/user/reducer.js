import * as actions from './actionTypes';

const initialState = {
    register: {
        success: false,
    },
    login: {
        success: false,
        errors: {},
        httpStatus: 200,
    },
    session: {
        token: '',
        exp: 0,
        permissions: 0,
    },
    booking:null,
    isPassenger:null,
    userHaveBooking:false,
    profile: {
        first_name: '',
        last_name: '',
        avatar: null,
    },
    reviews: {
        given: [],
        received: [],
        rating: [0, 0, 0, 0, 0]
    },
    entities: {
        reviews: {
            byId: {}
        },
        users: {
            byId: {}
        },
    }
};

export default function (state = initialState, action) {
    switch(action.type) {
        case actions.SET_SESSION_TOKEN:
            return {
                ...state,
                session: {
                    ...state.session,
                    token: action.data,
                },
            };
        case actions.UNSET_SESSION_TOKEN:
            return {
                ...state,
                session: {
                    ...state.session,
                    token: '',
                },
            };
        case actions.SET_SESSION_DATA:
            return {
                ...state,
                session: action.data.session,
                profile: {
                    first_name: action.data.user.first_name,
                    last_name: action.data.user.last_name,
                    avatar: action.data.user.avatar,
                },
            };
        case actions.UNSET_SESSION_DATA:
            return {
                ...state,
                session: {
                    token: '',
                    exp: 0,
                    permissions: 0,
                },
                profile: {
                    first_name: '',
                    last_name: '',
                    avatar: null,
                },
            };

        case actions.USER_REGISTER_SUCCESS:
            return {
                ...state,
                register: {
                    success: true,
                },
            };
        case actions.LOGIN_SUCCESS:
            return {
                ...state,
                login: {
                    ...state.login,
                    success: true,
                    httpStatus: 200,
                },
            };
        case actions.LOGIN_VERIFY_FAILED:
            return {
                ...state,
                login: {
                    ...state.login,
                    success: false,
                    errors: action.data,
                },
            };
        case actions.LOGIN_FAILED_NO_ACTIVATION:
        case actions.LOGIN_FAILED_NO_USER:
        case actions.LOGIN_FAILED_BAD_CREDENTIALS:
        case actions.LOGIN_FAILED:
            return {
                ...state,
                login: {
                    success: false,
                    errors: action.response.data,
                    httpStatus: action.response.status,
                },
            };

        case actions.LOGOUT_SUCCESS:
            return {
                ...state,
                login: {
                    success: false,
                    errors: {},
                    httpStatus: 200,
                },
            };

        case actions.LOGOUT_FAILED:
            return {
                ...state,
                login: {
                    ...state.login,
                    errors: action.response.data,
                    httpStatus: action.response.status,
                }
            };

        case actions.USER_PROFILE_SET_STATE:
        case actions.USER_PROFILE_UPDATE_STATE:
            return {
                ...state,
                profile: action.data,
                session: {
                    ...state.session,
                    permissions: action.data.permissions,
                },
            };

        case actions.USER_AVATAR_UPDATE_STATE:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    avatar: action.data,
                }
            };

        case actions.USER_REVIEWS_SET_GIVEN:
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    given: action.reviews.givenReviews
                },
                entities: {
                    ...state.entities,
                    users: {
                        byId: Object.assign(state.entities.users.byId, action.reviews.users),
                    },
                    reviews: {
                        byId: Object.assign(state.entities.reviews.byId, action.reviews.reviews),
                    }
                }
            };

        case actions.USER_REVIEWS_SET_RECEIVED:
            return {
                ...state,
                reviews: {
                    ...state.reviews,
                    received: action.reviews.receivedReviews,
                    rating: action.rating
                },
                entities: {
                    ...state.entities,
                    users: {
                        byId: Object.assign(state.entities.users.byId, action.reviews.users),
                    },
                    reviews: {
                        byId: Object.assign(state.entities.reviews.byId, action.reviews.reviews),
                    }
                }
            };

        case actions.USER_BOOKING_SET_STATE:
            return {
                ...state,
                booking: action.data
            };

        case actions.USER_ROLE_SET_STATE:
            return {
                ...state,
                isPassenger: action.data
            };

        case actions.USER_HAVE_BOOKING_SET_STATE:
            return {
                ...state,
                userHaveBooking: action.data
            };

        default:
            return state;
    }
};
