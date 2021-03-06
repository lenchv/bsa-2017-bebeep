import React from 'react';
import { localize } from 'react-localize-redux';

import ContainerWrapper from 'app/layouts/ContainerWrapper';
import DriverProfileContainer from '../components/Driver/DriverProfileContainer';

import LangService from 'app/services/LangService';
import * as lang from '../lang/PublicProfile.locale.json';

class DriverPublicProfile extends React.Component {

    componentWillMount() {
        LangService.addTranslation(lang);
    }

    render() {
        const { translate, params } = this.props;

        return (
            <ContainerWrapper>
                <DriverProfileContainer id={ params.id }/>
            </ContainerWrapper>
        );
    }
}

export default localize(DriverPublicProfile, 'locale');
