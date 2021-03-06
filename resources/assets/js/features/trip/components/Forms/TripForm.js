import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PlacesAutocomplete from 'react-places-autocomplete';
import { localize } from 'react-localize-redux';
import moment from 'moment';

import Waypoints from './Waypoints';
import Input from 'app/components/Input';
import { AlertWarning } from 'app/components/Alerts';
import { InputDateTime } from 'app/components/Controls';

import { getVehicles } from 'features/car/actions';
import LangService from 'app/services/LangService';
import * as lang from 'features/trip/lang/TripForm.locale.json';

class TripForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isInBothDirections: false,
            isRecurringTrip: false,
            disableTripCreate: false,
        };
    }

    componentWillMount() {
        LangService.addTranslation(lang);
        this.props.getVehicles();

        this.setState({
            isInBothDirections: false,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { vehiclesAreLoaded, vehicles } = nextProps;

        if (vehiclesAreLoaded && !vehicles.length) {
            this.setState({
                disableTripCreate: true,
            });
        }
    }

    toggleInBothDirections() {
        this.setState({
            isInBothDirections: !this.state.isInBothDirections
        });
    }

    toggleIsRecurringTrip() {
        this.setState({
            isRecurringTrip: !this.state.isRecurringTrip
        });
    }

    isValidDate(current) {
        return current.isAfter(moment().subtract(1, 'day'));
    }

    showInBothDirectionsControl() {
        const { translate, trip } = this.props;

        if (trip && trip.id) {
            return '';
        }

        return (<div className="form-group row">
            <label className="form-control-label text-muted col-sm-4" htmlFor="is_in_both_directions">
                {translate('trip_form.is_round_trip')}
            </label>
            <div className="col-sm-8">
                <div className="form-check">
                    <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" id="is_in_both_directions"
                               checked={this.state.isInBothDirections}
                               name="is_in_both_directions"
                               title={translate('create_trip.tooltips.both_directions')}
                               onChange={this.toggleInBothDirections.bind(this)}
                        />
                    </label>
                </div>
            </div>
        </div>);
    }

    showIsRecurringControl() {
        const { translate, trip } = this.props;

        if (trip && trip.id) {
            return '';
        }

        return (<div className="form-group row">
            <label className="form-control-label text-muted col-sm-4" htmlFor="is_recurring_trip">
                {translate('trip_form.is_recurring_trip')}
            </label>
            <div className="col-sm-8">
                <div className="form-check">
                    <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" id="is_recurring_trip"
                               checked={this.state.isRecurringTrip}
                               name="is_recurring_trip"
                               title={translate('create_trip.tooltips.recurring_trip')}
                               onChange={this.toggleIsRecurringTrip.bind(this)}
                        />
                    </label>
                </div>
            </div>
        </div>);
    }

    showRecurringControls() {
        const { translate, errors } = this.props;

        if (!this.state.isRecurringTrip) {
            return '';
        }

        return (<div>
            <Input type="number" name="recurring_count" id="recurring_count" required={false} error={errors.recurring_count}>
                {translate('trip_form.recurring_count')}
            </Input>
            <Input type="number" name="recurring_period" id="recurring_period" required={false} error={errors.recurring_period}>
                {translate('trip_form.recurring_period_days')}
            </Input>
        </div>);
    }

    showReverseStartAtControl() {
        const { translate, errors } = this.props;
        let reverseStartAt = '';

        if (!this.state.isInBothDirections) {
            return '';
        }

        return (<div className={"form-group row " + (errors.reverse_start_at ? 'has-danger' : '')}>
            <label className="form-control-label text-muted col-sm-4"
                   htmlFor="reverse_start_at"
            >
                {translate('trip_form.reverse_start_at')}
            </label>
            <div className="col-md-8">
                <InputDateTime
                    id="reverse_start_at"
                    isValidDate={this.isValidDate}
                    timeFormat={true}
                    defaultValue={reverseStartAt}
                    inputProps={{name: 'reverse_start_at', id: 'reverse_start_at'}}
                    labelClasses="datetimepicker-label"
                    wrapperClasses="datetimepicker-wrapper"
                    error={errors.reverse_start_at ? errors.reverse_start_at[0] : ''}
                />
            </div>
        </div>);
    }

    renderVehiclesList() {
        const { translate, vehicles, trip } = this.props,
            defaultValue = trip ? trip.vehicle_id : '';

        const { disableTripCreate } = this.state;

        return disableTripCreate
            ? (
                <AlertWarning>
                    {translate('create_trip.no_vehicles.main_msg')}<br/>
                    <Link to="/vehicles/create">
                        {translate('create_trip.no_vehicles.add_link_msg')}
                    </Link>{translate('create_trip.no_vehicles.after_link_msg')}
                </AlertWarning>
            ) : (
                <select name="vehicle_id"
                    id="vehicle_id"
                    className="form-control"
                    defaultValue={defaultValue}
                >
                    {vehicles.map((vehicle) =>
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model}</option>
                    )}
                </select>
            );
    }

    renderCurrenciesList() {
        const { activeCurrency, currencies } = this.props.currency;
        const { trip } = this.props,
            defaultValue = trip ? trip.currency_id : activeCurrency.id;

        return (
            <select name="currency_id"
                id="currency_id"
                className="form-control"
                defaultValue={ defaultValue }
            >
            {currencies.map((currency) =>
                <option key={currency.id} value={currency.id}>
                    {currency.code} ({currency.sign})</option>
            )}
            </select>
        );
    }

    render() {
        const { errors, translate, trip, waypoints, startPoint, endPoint, placesCssClasses,
                onSubmit, onSelectStartPoint, onSelectEndPoint, onWaypointAdd, onWaypointDelete
            } = this.props;

        const { disableTripCreate } = this.state;

        const tripData = trip || {
                is_animals_allowed: false,
                luggage_size: 2,
                vehicle_id: '',
                price: '',
                seats: '',
                start_at: ''
            },
            formHeader = translate(trip ? 'trip_form.edit_trip' : 'trip_form.create_trip'),
            buttonText = translate(trip ? 'trip_form.edit_trip_btn' : 'trip_form.create_trip_btn');

        return (
            <form role="form"
                method="POST"
                action="/api/v1/trips"
                className="card trip-create-from"
                onSubmit={onSubmit}
            >
                <div className="card-header">{formHeader}</div>
                <div className="card-block">
                    <div className={"form-group row " + (errors.vehicle_id ? 'has-danger' : '')}>
                        <label className="form-control-label text-muted col-sm-4"
                            htmlFor="vehicle_id"
                        >
                            {translate('trip_form.select_car')}
                        </label>
                        <div className="col-sm-8">
                            {this.renderVehiclesList()}
                            <div className="form-control-feedback">{errors.vehicle_id}</div>
                        </div>
                    </div>
                    <Input
                        type="number"
                        name="price"
                        id="price"
                        defaultValue={tripData.price}
                        required={false}
                        error={errors.price}
                    >
                        {translate('trip_form.price')}
                    </Input>

                    <div className={"form-group row " + (errors.currency_id ? 'has-danger' : '')}>
                        <label className="form-control-label text-muted col-sm-4"
                               htmlFor="currency_id"
                        >
                            {translate('trip_form.currency')}
                        </label>
                        <div className="col-sm-8">
                            {this.renderCurrenciesList()}

                            <div className="form-control-feedback">{errors.currency_id}</div>
                        </div>
                    </div>

                    <Input
                        type="number"
                        name="seats"
                        id="seats"
                        defaultValue={tripData.seats}
                        required={false}
                        error={errors.seats}
                    >
                        {translate('trip_form.available_seats')}
                    </Input>
                    <div className={"form-group row " + (errors.from ? 'has-danger' : '')}>
                        <label className="form-control-label text-muted col-sm-4">
                            {translate('trip_form.start_point')}
                        </label>
                        <div className="col-sm-8">
                            <PlacesAutocomplete
                                inputProps={startPoint}
                                classNames={placesCssClasses}
                                onSelect={onSelectStartPoint}
                                onEnterKeyDown={onSelectStartPoint}
                            />
                            <div className="form-control-feedback">{errors.from}</div>
                        </div>
                    </div>
                    <div className={"form-group row " + (errors.to ? 'has-danger' : '')}>
                        <label className="form-control-label text-muted col-sm-4">
                            {translate('trip_form.end_point')}
                        </label>
                        <div className="col-sm-8">
                            <PlacesAutocomplete inputProps={endPoint}
                                classNames={placesCssClasses}
                                onSelect={onSelectEndPoint}
                                onEnterKeyDown={onSelectEndPoint}
                            />
                            <div className="form-control-feedback">{errors.to}</div>
                        </div>
                    </div>

                    <Waypoints waypoints={waypoints}
                               placesCssClasses={placesCssClasses}
                               onWaypointAdd={onWaypointAdd}
                               onWaypointDelete={onWaypointDelete}
                    />

                    <div className={"form-group row " + (errors.start_at ? 'has-danger' : '')}>
                        <label className="form-control-label text-muted col-sm-4"
                            htmlFor="start_at"
                        >
                            {translate('trip_form.trip_start_time')}
                        </label>
                        <div className="col-md-8">
                            <InputDateTime
                                id="start_at"
                                isValidDate={this.isValidDate}
                                timeFormat={true}
                                defaultValue={tripData.start_at}
                                inputProps={{name: 'start_at', id: 'start_at'}}
                                labelClasses="datetimepicker-label"
                                wrapperClasses="datetimepicker-wrapper"
                                error={errors.start_at}
                            />
                        </div>
                    </div>

                    <div className={"form-group row " + (errors.luggage_size ? 'has-danger' : '')}>
                        <label className="form-control-label text-muted col-sm-4"
                            htmlFor="luggage_size"
                        >
                            {translate('trip_form.luggage_size')}
                        </label>
                        <div className="col-sm-8">
                            <select
                                name="luggage_size"
                                id="luggage_size"
                                className="form-control"
                                defaultValue={tripData.luggage_size}
                            >
                                <option value="0">{translate('trip_form.luggage_size_0')}</option>
                                <option value="1">{translate('trip_form.luggage_size_1')}</option>
                                <option value="2">{translate('trip_form.luggage_size_2')}</option>
                            </select>
                            <div className="form-control-feedback">{errors.luggage_size}</div>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="form-control-label text-muted col-sm-4"
                            htmlFor="is_animals_allowed"
                        >
                            {translate('trip_form.is_animals_allowed')}
                        </label>
                        <div className="col-sm-8">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="checkbox"
                                        id="is_animals_allowed"
                                        className="form-check-input"
                                        title={translate('create_trip.tooltips.animals_allowed')}
                                        defaultChecked={tripData.is_animals_allowed} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {this.showInBothDirectionsControl()}
                    {this.showReverseStartAtControl()}

                    {this.showIsRecurringControl()}
                    {this.showRecurringControls()}

                    <div className="form-group form-group--last-for-btn">
                        <div className="text-center">
                            <button type="submit"
                                className="btn btn-primary"
                                disabled={disableTripCreate}
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

const TripFormConnected = connect(
    state => ({
        vehicles: state.vehicle.vehicles,
        vehiclesAreLoaded: state.vehicle.vehiclesAreLoaded,
        currency: state.currency
    }),
    (dispatch) => bindActionCreators({getVehicles}, dispatch)
)(TripForm);

export default localize(TripFormConnected, 'locale');
