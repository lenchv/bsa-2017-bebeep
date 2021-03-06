import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory, Link} from 'react-router';
import { getTranslate } from 'react-localize-redux';

import TextInput from './TextInput';
import PasswordForgotModal from '../_Modals/PasswordForgotModal';

import { doLogin } from 'features/user/actions';
import { subscriptionReset } from 'features/search/actions';

import AuthService from 'app/services/AuthService';
import { sendSubscribeRequest } from 'features/search/services/SearchService';


class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = { credentials: { email: '', password: '' }, forgotModalIsOpen: false };
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
        this.pickErrorMessage = this.pickErrorMessage.bind(this);
    }

    componentDidMount() {
        const { subscription } = this.props;

        if(subscription) {
            this.setState({ credentials: { email: subscription.email, password: '' } });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.success) {
            browserHistory.push('/dashboard');

            if(nextProps.subscription) {
                let subscribeData = {
                    email: nextProps.subscription.email,
                    end_point: nextProps.subscription.end_point,
                    filters: nextProps.subscription.filters,
                    start_at: nextProps.subscription.start_at,
                    start_point: nextProps.subscription.start_point,
                    user_id: AuthService.getUserId()
                };

                sendSubscribeRequest(subscribeData).
                    then(response => {
                        if (response.status === 200) {
                            this.props.subscriptionReset();
                        }
                    });
            }
        }
    }

    pickErrorMessage(code) {
        const {translate} = this.props;
        switch(code) {
            case 401:
                return (<div>{translate('login_form.err_your_email_is_not_activated_yet')}</div>)
            case 404:
                return (<div>{translate('login_form.err_user_wasnt_registered_yet')}</div>)
            case 422:
                return (<div>{translate('login_form.err_email_password_not_corresponding')}</div>)
            default:
                return (<div>{translate('login_form.err_some_problems_appeared')}</div>)
        }
    }

    onChange(event) {
        const field = event.target.name;
        const credentials = this.state.credentials;
        credentials[field] = event.target.value;

        return this.setState({ credentials: credentials });
    }

    onSave(event) {
        event.preventDefault();
        this.props.doLogin(this.state.credentials);
    }

    render() {
        const { errors, translate } = this.props;
        return (
            <div>
                <form role="form" className="card login-form" action="/api/user/authorization" method="POST">
                    <div className={ "card-header " + (this.props.httpCode !== 200 ? 'alert-danger' : '')}>
                        {(this.props.httpCode !== 200 ? this.pickErrorMessage(this.props.httpCode) : translate("login_form.enter_your_credentials") )}
                    </div>
                    <div className="card-block">
                        <TextInput
                            name="email"
                            label={translate('login_form.email')}
                            value={ this.state.credentials.email }
                            error={ errors.email }
                            onChange={ this.onChange }/>

                        <TextInput
                            name="password"
                            label={translate('login_form.password')}
                            type="password"
                            value={ this.state.credentials.password }
                            error={ errors.password }
                            onChange={ this.onChange }/>
                    </div>

                    <div className="card-footer">
                        <div className="row">
                            <div className="text-right col-5 offset-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={ this.onSave }>
                                    {translate('login_form.login')}
                                </button>
                            </div>
                            <div className="col-5 d-flex align-items-center">
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({forgotModalIsOpen: true});
                                }}>{translate('login_form.forgot_password')}</a>
                            </div>
                        </div>
                    </div>
                </form>
                <p className="text-center mt-3 mb-0 hidden-md-up">
                    {translate('login_form.new_customer')} &nbsp;
                    <Link to="/registration">{translate('login_form.register')}</Link>
                </p>
                <PasswordForgotModal isOpen={this.state.forgotModalIsOpen} onClosed={() => this.state.forgotModalIsOpen = false }/>
            </div>
        );
    }

}

export default connect(
    state => ({
        user: state.user,
        subscription: state.search.subscription,
        errors: state.user.login.errors,
        httpCode: state.user.login.httpStatus,
        success: state.user.login.success,
        translate: getTranslate(state.locale)
    }),
    (dispatch) =>
        bindActionCreators({
            doLogin,
            subscriptionReset
        }, dispatch)
)(Form);
