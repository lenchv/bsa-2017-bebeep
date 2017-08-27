import React from 'react';
import { localize } from 'react-localize-redux';
import PropTypes from 'prop-types';
import BookingService from 'app/services/BookingService';
import Modal from 'app/components/Modal';
import SelectItem from './SelectItem';
import DateTimeHelper from 'app/helpers/DateTimeHelper';
import '../../styles/booking_modal.scss';

class BookingModal extends React.Component {

    constructor() {
        super();
        this.state = {
            isOpenModal: false,
            start: 0,
            end: 0,
            seats: 1,
            possibleSeats: 1,
            errors: {}
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeStartPoint = this.onChangeStartPoint.bind(this);
        this.onChangeEndPoint = this.onChangeEndPoint.bind(this);
        this.onChangeSeats = this.onChangeSeats.bind(this);
    }

    componentWillMount() {
        const { start, end, seats } = this.state;
        this.validate(start, end, seats);
    }

    componentWillReceiveProps(newProps) {
        if (this.state.isOpenModal !== newProps.isOpen) {
            this.setState({isOpenModal: newProps.isOpen});
        }
    }

    closeModal() {
        const onClosed = this.props.onClosed || (() => {});
        this.setState({isOpenModal: false});
        onClosed();
    }

    getRouteById(id) {
        return _.findIndex(this.props.waypoints, {id});
    }

    validate(iStart, iEnd, seats) {
        const errors = BookingService.validateBooking(iStart, iEnd, seats, this.getPossibleSeats(iStart, iEnd));
        this.setState({errors});
    }

    getPossibleSeats(start, end) {
        const {waypoints, maxSeats} = this.props,
            interval = waypoints.slice(start, end + 1),
            seats = maxSeats - _.reduce(interval, (acc, p) => acc + p.busy_seats, 0),
            possibleSeats  = seats < 0 ? 0 : seats;
        this.setState({possibleSeats});
        return possibleSeats;
    }

    onSubmit(e) {
        e.preventDefault();
        const {onSuccess, waypoints, tripId} = this.props,
            { start, end, seats, errors } = this.state;

        if (_.isEmpty(errors)) {
            BookingService.createBooking(tripId, {
                    routes: [
                        waypoints[start].id,
                        waypoints[end].id
                    ],
                    seats
                }).then((data) => {
                    onSuccess();
                    this.closeModal();
                })
                .catch((error) => this.setState({errors: error.response.data}));
        }
    }

    onChangeStartPoint(e) {
        const start = this.getRouteById(+e.target.value);
        this.validate(start, this.state.end, this.state.seats);
        this.setState({start});
    }

    onChangeEndPoint(e) {
        const end = this.getRouteById(+e.target.value);
        this.validate(this.state.start, end, this.state.seats);
        this.setState({end});
    }

    onChangeSeats(e) {
        const seats = +e.target.value;
        this.validate(this.state.start, this.state.end, seats);
        this.setState({seats});
    }

    render() {
        const {isOpenModal, errors, possibleSeats} = this.state,
            {translate, waypoints, price, start_at, maxSeats} = this.props,
            date = DateTimeHelper.dateFormat(start_at);

        return (
            <Modal isOpen={isOpenModal} onClosed={() => { this.closeModal() }}>
                <form onSubmit={this.onSubmit} className="booking-modal">
                    <div className="modal-header">{translate('detail_trip.booking.header')}</div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="text-muted booking-modal__text">
                                    {translate('detail_trip.booking.start_trip')}
                                </div>
                                <b>{
                                    date.date === 'today'
                                        ? translate('today', {time: date.time})
                                        : date.date === 'tomorrow'
                                            ? translate('tomorrow', {time: date.time})
                                            : `${date.date} - ${date.time}`
                                }</b>
                            </div>
                            <div className="col-sm-6">
                                <div className="text-muted booking-modal__text">
                                    {translate('detail_trip.booking.price_of_trip')}
                                </div>
                                <b>$</b>{price}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className={"form-group" + (!!errors.start ? ' has-danger' : '')}>
                                    <label className="form-control-label booking-modal__text">
                                        {translate('detail_trip.booking.start_point')}
                                    </label>
                                    <select
                                        name="start_point"
                                        className={"form-control" + (!!errors.start ? ' has-danger' : '')}
                                        onChange={this.onChangeStartPoint}
                                    >
                                        {waypoints.map(p => (
                                            <SelectItem
                                                key={'from_' + p.id}
                                                value={p.id}
                                                disabled={p.busy_seats >= maxSeats}
                                            >{p.from.short_address}</SelectItem>
                                        ))}
                                    </select>
                                    <small className="form-control-feedback">{errors.start}</small>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className={"form-group" + (!!errors.end ? ' has-danger' : '')}>
                                    <label className="form-control-label booking-modal__text">
                                        {translate('detail_trip.booking.end_point')}
                                    </label>
                                    <select
                                        name="end_point"
                                        className={"form-control" + (!!errors.end ? ' has-danger' : '')}
                                        onChange={this.onChangeEndPoint}
                                    >
                                        {waypoints.map(((p) => (
                                            <SelectItem
                                                key={'to_' + p.id}
                                                value={p.id}
                                                disabled={p.busy_seats >= maxSeats}
                                            >{p.to.short_address}</SelectItem>
                                        )))}
                                    </select>
                                    <small className="form-control-feedback">{errors.end}</small>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className={"form-group" + (!!errors.seats ? ' has-danger' : '')}>
                                    <label className="form-control-label booking-modal__text">
                                        {translate('detail_trip.booking.seats')}
                                    </label>
                                    <input
                                        type="number"
                                        className={"form-control" + (!!errors.seats ? ' has-danger' : '')}
                                        name="seats"
                                        defaultValue="1"
                                        min="1"
                                        max={maxSeats}
                                        onChange={this.onChangeSeats}
                                    />
                                    <small className="form-text text-muted">{translate('detail_trip.booking.free_seats', {seats: possibleSeats})}</small>
                                    <small className="form-control-feedback">{errors.seats}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer text-right">
                        <div className="btn btn-danger" role="button" onClick={() => this.closeModal()}>
                            {translate('detail_trip.booking.cancel')}
                        </div>
                        <button role="button" className="btn btn-success">{translate('detail_trip.booking.apply')}</button>
                    </div>
                </form>
            </Modal>
        );
    }
}

BookingModal.PropTypes = {
    waypoints: PropTypes.array.required,
    price: PropTypes.number.required,
    start_at: PropTypes.number.required,
    maxSeats: PropTypes.number.required,
    tripId: PropTypes.number.required,
    isOpen: PropTypes.bool.required,
    onClosed: PropTypes.func,
    onSuccess: PropTypes.func.required
};

export default localize(BookingModal, 'locale');