const ServiceError = require('../core/serviceError');

const handleDBError = (error) => {//todo fix al deze errors
        const {code = '', message} = error;

        if (code === 'P2002') {
            switch (true) {
                case message.includes('iets'):
                    return ServiceError.validationFailed(
                        'text go here'
                    );
                case message.includes('nog iets'):
                    return ServiceError.validationFailed(
                        'text go here'
                    );
                default:
                    return ServiceError.validationFailed('text go here');
            }
        }

        if (code === 'P2003') {
            switch (true) {
                case message.includes('iets'):
                    return ServiceError.validationFailed(
                        'text go here'
                    );
                case
                message.includes('nog iets')
                :
                    return ServiceError.validationFailed(
                        'text go here'
                    );
                default:
                    return ServiceError.validationFailed('text go here');
            }
        }


        return error;
    }
;

module.exports = handleDBError;