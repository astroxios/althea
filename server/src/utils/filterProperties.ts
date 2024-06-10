
export const filterProperties = (obj: any, propertiesToExclude: string[]): any => {
    const filteredObj = { ...obj };
    propertiesToExclude.forEach((property) => {
        delete filteredObj[property];
    });
    return filteredObj;
};

export const redactSensitiveProperties = (obj: any, sensitiveProperties: string[]): any => {
    const redactedObj = { ...obj };
    sensitiveProperties.forEach((property) => {
        if (redactedObj.hasOwnProperty(property)) {
            redactedObj[property] = 'REDACTED';
        }
    });
    return redactedObj;
};
