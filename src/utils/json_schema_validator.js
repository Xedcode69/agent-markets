const isPlainObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const typeMatches = (value, type) => {
    if (type === 'array') {
        return Array.isArray(value);
    }

    if (type === 'object') {
        return isPlainObject(value);
    }

    if (type === 'integer') {
        return Number.isInteger(value);
    }

    if (type === 'number') {
        return typeof value === 'number' && Number.isFinite(value);
    }

    if (type === 'string') {
        return typeof value === 'string';
    }

    if (type === 'boolean') {
        return typeof value === 'boolean';
    }

    return true;
}

const formatValue = (value) => {
    if (typeof value === 'string') {
        return `"${value}"`;
    }

    return String(value);
}

const validateFormat = (value, format, path, errors) => {
    if (typeof value !== 'string' || !format) {
        return;
    }

    if (format === 'uri') {
        try {
            new URL(value);
        } catch {
            errors.push(`${path} must be a valid URL`);
        }
    }

    if (format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push(`${path} must be a valid email address`);
    }

    if (format === 'date' && Number.isNaN(Date.parse(value))) {
        errors.push(`${path} must be a valid date`);
    }
}

const validateValue = (value, schema, path, errors) => {
    if (!isPlainObject(schema)) {
        return;
    }

    if (schema.enum && Array.isArray(schema.enum) && !schema.enum.includes(value)) {
        errors.push(`${path} must be one of ${schema.enum.map(formatValue).join(', ')}`);
        return;
    }

    const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type].filter(Boolean);
    if (expectedTypes.length > 0 && !expectedTypes.some((type) => typeMatches(value, type))) {
        errors.push(`${path} must be ${expectedTypes.join(' or ')}`);
        return;
    }

    validateFormat(value, schema.format, path, errors);

    if (typeof value === 'string') {
        if (Number.isInteger(schema.minLength) && value.length < schema.minLength) {
            errors.push(`${path} must be at least ${schema.minLength} characters`);
        }
        if (Number.isInteger(schema.maxLength) && value.length > schema.maxLength) {
            errors.push(`${path} must be at most ${schema.maxLength} characters`);
        }
    }

    if (typeof value === 'number') {
        if (typeof schema.minimum === 'number' && value < schema.minimum) {
            errors.push(`${path} must be at least ${schema.minimum}`);
        }
        if (typeof schema.maximum === 'number' && value > schema.maximum) {
            errors.push(`${path} must be at most ${schema.maximum}`);
        }
    }

    if (Array.isArray(value)) {
        if (Number.isInteger(schema.minItems) && value.length < schema.minItems) {
            errors.push(`${path} must include at least ${schema.minItems} item(s)`);
        }
        if (Number.isInteger(schema.maxItems) && value.length > schema.maxItems) {
            errors.push(`${path} must include at most ${schema.maxItems} item(s)`);
        }
        value.forEach((item, index) => {
            validateValue(item, schema.items, `${path}[${index}]`, errors);
        });
    }

    if (isPlainObject(value)) {
        const properties = isPlainObject(schema.properties) ? schema.properties : {};
        const required = Array.isArray(schema.required) ? schema.required : [];

        required.forEach((key) => {
            if (value[key] === undefined || value[key] === null || value[key] === '') {
                errors.push(`${path}.${key} is required`);
            }
        });

        Object.entries(properties).forEach(([key, propertySchema]) => {
            if (value[key] !== undefined && value[key] !== null && value[key] !== '') {
                validateValue(value[key], propertySchema, `${path}.${key}`, errors);
            }
        });

        if (schema.additionalProperties === false) {
            Object.keys(value).forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(properties, key)) {
                    errors.push(`${path}.${key} is not allowed`);
                }
            });
        }
    }
}

export const validateJsonSchema = (value, schema) => {
    if (!schema) {
        return [];
    }

    const errors = [];
    validateValue(value, schema, 'input', errors);
    return errors;
}
