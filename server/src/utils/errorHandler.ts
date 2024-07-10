interface ErrorDetail {
    code: string;
    message: string;
    details: string[];
}

const errorResponses: { [key: string]: ErrorDetail } = {
    '400': {
        code: '400',
        message: 'Bad Request',
        details: [
            'The server could not understand the request due to invalid syntax.',
            'Please check the request and try again.',
        ],
    },
    '401': {
        code: '401',
        message: 'Unauthorized',
        details: [
            'The request requires user authentication.',
            'Please provide valid authentication credentials and try again.',
        ],
    },
    '403': {
        code: '403',
        message: 'Forbidden',
        details: [
            'You do not have permission to access this resource.',
            'Contact support if you believe this is an error.',
        ],
    },
    '404': {
        code: '404',
        message: 'Resource not found',
        details: [
            'The requested resource was not found on this server.',
            'Please check the request or contact support for assistance.',
        ],
    },
    '405': {
        code: '405',
        message: 'Method Not Allowed',
        details: [
            'The method specified in the request is not allowed for the resource.',
            'Please check the request method and try again.',
        ],
    },
    '406': {
        code: '406',
        message: 'Not Acceptable',
        details: [
            'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.',
            'Please check the Accept headers and try again.',
        ],
    },
    '409': {
        code: '409',
        message: 'Conflict',
        details: [
            'The request could not be completed due to a conflict with the current state of the resource.',
            'Please check the request and try again.',
        ],
    },
    '410': {
        code: '410',
        message: 'Gone',
        details: [
            'The requested resource is no longer available at the server and no forwarding address is known.',
            'Please contact support for assistance.',
        ],
    },
    '415': {
        code: '415',
        message: 'Unsupported Media Type',
        details: [
            'The server is refusing to service the request because the payload is in a format not supported by this method.',
            'Please check the media type and try again.',
        ],
    },
    '429': {
        code: '429',
        message: 'Too Many Requests',
        details: [
            'You have sent too many requests in a given amount of time.',
            'Please try again later or contact support if this continues.',
        ],
    },
    '500': {
        code: '500',
        message: 'Internal Server Error',
        details: [
            'The server encountered an unexpected condition which prevented it from fulfilling the request.',
            'Please try again later or contact support.',
        ],
    },
    '501': {
        code: '501',
        message: 'Not Implemented',
        details: [
            'The server does not support the functionality required to fulfill the request.',
            'Please contact support for further assistance.',
        ],
    },
    '502': {
        code: '502',
        message: 'Bad Gateway',
        details: [
            'The server received an invalid response from the upstream server.',
            'Please try again later or contact support.',
        ],
    },
    '503': {
        code: '503',
        message: 'Service Unavailable',
        details: [
            'The server is currently unable to handle the request due to temporary overload or maintenance.',
            'Please try again later or contact support.',
        ],
    },
    '504': {
        code: '504',
        message: 'Gateway Timeout',
        details: [
            'The server did not receive a timely response from the upstream server or some other auxiliary server.',
            'Please try again later or contact support.',
        ],
    },
};

export const getErrorResponse = (code: number): ErrorDetail => {
    return errorResponses[code] || {
        code: '500',
        message: 'Internal Server Error',
        details: [
            'An unexpected error occurred.',
            'Please try again later or contact support.',
        ],
    };
};
