import { filterProperties, redactSensitiveProperties } from './filterProperties';

/**
 * Serializes an object by excluding specified properties and optionally replacing sensitive properties.
 *
 * @param {string} type - The type of the object being serialized. This could be used for logging or other type-specific behavior.
 * @param {any} obj - The object to be serialized.
 * @param {string[]} [propertiesToExclude=[]] - An array of property names to exclude from the serialized object.
 * @param {string[]} [sensitiveProperties=[]] - An array of property names that are considered sensitive. These properties could be replaced or transformed in the serialized object.
 *
 * @returns {any} - The serialized object.
 *
 * @example
 * const user = { id: 1, name: 'John Doe', password: 'secret' };
 * const serializedUser = serializeObject('user', user, ['password'], ['password']);
 * console.log(serializedUser); // { id: 1, name: 'John Doe' }
 */

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
        case 'widget':
            serializedData = {
                type: 'widget',
                id: serializedObj.id,
                attributes: {
                    is_active: serializedObj.is_active,
                    widget_type: serializedObj.type,
                    created: serializedObj.created,
                    updated: serializedObj.updated,
                    // Add more widget-specific attributes (as needed)
                }
            };
            break;
        default:
            throw new Error('Unsupported type');
    }

    return { data: serializedData };
};

/**
 * Serializes an array of objects by excluding specified properties and optionally replacing sensitive properties.
 *
 * @param {string} type - The type of the objects being serialized. This could be used for logging or other type-specific behavior.
 * @param {any[]} objs - The array of objects to be serialized.
 * @param {string[]} [propertiesToExclude=[]] - An array of property names to exclude from the serialized objects.
 * @param {string[]} [sensitiveProperties=[]] - An array of property names that are considered sensitive. These properties could be replaced or transformed in the serialized objects.
 *
 * @returns {any} - The serialized objects.
 *
 * @example
 * const users = [{ id: 1, name: 'John Doe', password: 'secret' }];
 * const serializedUsers = serializeObjects('user', users, ['password'], ['password']);
 * console.log(serializedUsers); // { data: [{ id: 1, name: 'John Doe' }] }
 */

export const serializeObjects = (
    type: string,
    objs: any[],
    propertiesToExclude: string[] = [],
    sensitiveProperties: string[] = []
) => {
    let serializedObjs = objs.map(obj => {
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
                    id: serializedObj.id,
                    attributes: {
                        username: serializedObj.username,
                        // email excluded as per the requirement
                        created: serializedObj.created,
                        // updated excluded as per the requirement
                        // Add more user-specific attributes (as needed)
                    }
                };
                break;
            case 'widget':
                serializedData = {
                    id: serializedObj.id,
                    attributes: {
                        is_active: serializedObj.is_active,
                        widget_type: serializedObj.type,
                        created: serializedObj.created,
                        updated: serializedObj.updated,
                        // Add more widget-specific attributes (as needed)
                    }
                };
                break;
            default:
                throw new Error('Unsupported type');
        }

        return serializedData;
    });

    return { data: serializedObjs };
};
