import React from 'react';
import { Link, withRouter } from 'react-router';
import { localize } from 'react-localize-redux';

import ContainerWrapper from 'app/layouts/ContainerWrapper';
import PageHeader from 'app/components/PageHeader';
import BookingsContainer from '../components/BookingsContainer';

import { FILTER_PAST, FILTER_UPCOMING } from 'app/services/BookingService';

import LangService from 'app/services/LangService';
import * as lang from '../lang/BookingsList.locale.json';

class BookingsList extends React.Component {

    componentWillMount() {
        LangService.addTranslation(lang);
    }

    render() {
        const { translate, location } = this.props,
            filter = location.pathname === '/bookings/past' ? FILTER_PAST : FILTER_UPCOMING;

        return (
            <ContainerWrapper>
                <PageHeader header={translate('bookings_list.my_bookings_header')} />

                <ul className="nav nav-pills mb-4">
                    <li className="nav-item">
                        <Link to="/bookings" className={"nav-link" + (filter === FILTER_UPCOMING ? " active" : "")}>
                            {translate('bookings_list.upcoming')}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/bookings/past" className={"nav-link" + (filter === FILTER_PAST ? " active" : "")}>
                            {translate('bookings_list.past')}
                        </Link>
                    </li>
                </ul>

                <BookingsContainer filter={filter} />
            </ContainerWrapper>
        );
    }
}

export default localize(withRouter(BookingsList), 'locale');
