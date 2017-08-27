import { securedRequest } from '../../../app/services/RequestService';

export const VehicleService = {
    getBrandOptions() {
        return securedRequest.get(`/api/v1/car-brand`)
            .then((response) => {
                return response.data;
            }).then((json) => {
                return { options: json };
            });
    },

    getModelOptions(id) {
        return securedRequest.get(`/api/v1/car-brand/${id}/models`)
            .then((response) => {
                return response.data;
            }).then((json) => {
                return { options: json };
            });
    },

    getColorOptions() {
        return securedRequest.get(`/api/v1/car-color`)
            .then((response) => {
                return response.data;
            }).then((json) => {
                return { options: json };
            });
    },

    getBodyOptions() {
        return securedRequest.get(`/api/v1/car-body`)
            .then((response) => {
                return response.data;
            }).then((json) => {
                return { options: json };
            });
    }
};