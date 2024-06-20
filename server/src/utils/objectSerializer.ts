import { filterProperties, redactSensitiveProperties } from './filterProperties';

export const serializeObject = (
    type: string,
    obj: any,
    propertiesToExclude: string[] = [],
    sensitiveProperties: string[] = []
) => {
    let serializedObj = { ...obj };

    if (propertiesToExclude.length > 0) {
        serializedObj = filterProperties(serializedObj, propertiesToExclude);
    }

    if (sensitiveProperties.length > 0) {
        serializedObj = redactSensitiveProperties(serializedObj, sensitiveProperties);
    }

    let serializedData;
    switch (type) {
        case 'user':
            serializedData = {
                type: 'user',
                id: serializedObj.id,
                attributes: {
                    username: serializedObj.username,
                    email: serializedObj.email,
                    created: serializedObj.created,
                    updated: serializedObj.updated,
                    // Add more user-specific attributes (as needed)
                }
            };
            break;
        default:
            throw new Error('Unsupported type');
    }

    return { data: serializedData };
};
