import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {getProfileAvatar} from 'app/services/PhotoService'

class UserItem extends React.Component {

    getUserData(id) {
        const {users} = this.props;

        return Object.assign({}, users.byId[id]);
    }

    render() {
        const {translate, userId} = this.props,
            userData = this.getUserData(userId);

        return (
            <div className="user-item row">
                <div className="user-item__status-badge user-item__status-badge--online"></div>
                <div className="col-2 text-center">
                    <img
                        src={getProfileAvatar(userData.avatar)}
                        alt={userData.first_name}
                        className="user-item__avatar user-item__avatar--online"
                    />
                </div>
                <div className="col-8">
                    <div className="user-item__name">{userData.first_name} {userData.last_name}</div>
                </div>
                <div className="col-2 text-right">
                    <i className="fa fa-envelope user-item__envelope" />
                </div>
            </div>
        );
    }
}

UserItem.PropTypes = {
    userId: PropTypes.number.isRequired
};

export default connect(
    state => ({
        users: state.chat.entities.users,
        translate: getTranslate(state.locale)
    }),
    dispatch => bindActionCreators({}, dispatch)
)(UserItem);