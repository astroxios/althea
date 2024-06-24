import { Request, Response } from 'express';
import * as widgetService from '../services/widgetService';
import { serializeObject, serializeObjects } from '../utils/objectSerializer';
import { getErrorResponse } from '../utils/errorHandler';
import { generateETag } from '../middleware/cacheMiddleware';
import redisClient from '../redisClient';

export const getWidget = async (req: Request, res: Response) => {
    try {
        const widgetId = req.params.id;

        // Check if the provided id is a number
        if (isNaN(Number(widgetId))) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. The provided ID is not a valid widget ID.'
                }
            });
        }

        const widget = await widgetService.getWidgetById(Number(widgetId));
        if (!widget) {
            return res.status(404).json({
                error: {
                    message: 'Widget not found'
                }
            });
        }

        // FIXME: Must limit access to widgets of other users

        const response = serializeObject('widget', widget, []);
        res.status(200).json(response);

    } catch (error) {
        const errorResponse = getErrorResponse(500);
        res.status(500).json(errorResponse);
    }
};


export const getWidgets = async (req: Request, res: Response) => {
    try {
        const idsParam = req.query.ids as string;
        if (!idsParam) {
            return res.status(400).json({
                error:  {
                    message: "Invalid request. Parameter 'ids' are required."
                }
            });
        }

        const widgetIds = idsParam.split(',').map(id => parseInt(id.trim(), 10));

        if (widgetIds.some(isNaN)) {
            return res.status(400).json({
                error: {
                    message: "Invalid request. Invalid 'ids' parameter. Must be a comma-separated list of numbers."
                }
            });
        }

        const widgets = await widgetService.getWidgetsByIds(widgetIds);
        if (widgets.length === 0) {
            return res.status(404).json({
                error: {
                    message: 'No widgets found'
                }
            });
        }

        const response = serializeObjects('widget', widgets, []);

        res.status(200).json(response)
    } catch (error) {
        const errorResponse = getErrorResponse(500);
        res.status(500).json(errorResponse);
    }
};

export const createWidget = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const userId = user.id;
        const { data } = req.body

        const { widget_type } = data.attributes;
        const requiredAttributes = ['widget_type'];

        if (!requiredAttributes.every(attr => data.attributes.hasOwnProperty(attr))) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. Attributes such as widget_type must be provided.'
                }
            });
        }

        const widget = await widgetService.createWidget(userId, widget_type);

        const excludeProperties = ['updated'];
        const response = serializeObject('widget', widget, excludeProperties);

        res.status(201).json(response);
    } catch(error: any) {
        const statusCode = error.message === 'Widget type not found' ? 404 : 500;

        let errorResponse;
        if (statusCode === 404) {
            errorResponse = {
                status: statusCode,
                message: error.message,
            };
        } else {
            errorResponse = getErrorResponse(statusCode);
        }

        res.status(statusCode).json(errorResponse);
    }
};

export const updateWidget = async (req: Request, res: Response) => {
    try {
        const widgetId = req.params.id as string;
        const data = req.body.data;

        if (!data || data.type !== 'widget' || !data.attributes) {
            return res.status(400).json({
                error: {
                    message: "Invalid request. Please ensure the JSON request body contains a data object with a type set to 'widget', and includes attributes."
                }
            });
        }

        const widget = await widgetService.getWidgetById(Number(widgetId));
        if (!widget) {
            return res.status(404).json({
                error: {
                    message: 'Widget not found'
                }
            });
        }

        // NOTE: Update attributes as `widget` obje ct scales
        // Specify attributes allowed to be changed
        const attributes = data.attributes;
        const allowedAttributes = ['is_active', 'widget_type', 'updated'];

        // Filter and validate the attributes
        const updatedAttributes: Record<string, any> = {};
        for (const key of allowedAttributes) {
            if (attributes[key] !== undefined) {
                updatedAttributes[key] = attributes[key];
            }
        }

        if (Object.keys(updatedAttributes).length === 0) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. No valid attributes provided for update.'
                }
            });
        }

        // Clear the cache for the widget before updating
        await redisClient.del(`widget:${widgetId}`);

        const updatedWidget = await widgetService.updateWidget(Number(widgetId), updatedAttributes);
        const response = serializeObject('widget', updatedWidget, []);
        const etag = generateETag(response);

        // Cache the updated widget data (set for 1 hour)
        const cachedResponse = {
            response: { response },
            etag
        };
        redisClient.setex(`widget:${widgetId}`, 3600, JSON.stringify(cachedResponse));
        res.setHeader('ETag', etag);

        res.status(200).json(response);
    } catch (error: any) {
        const errorResponse = getErrorResponse(500);
        res.status(500).json(errorResponse);
    }
};

export const deleteWidget = async (req: Request, res: Response) => {
    try {
        const widgetId  = req.params.id as string;

        // Check if the provided id is a number
        if (isNaN(Number(widgetId))) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. The provided ID is not a valid widget ID.'
                }
            });
        }

        const widget = await widgetService.getWidgetById(Number(widgetId));
        if (!widget) {
            return res.status(404).json({
                error: {
                    message: 'Widget not found'
                }
            })
        }

        await widgetService.deleteWidget(Number(widgetId));
        res.status(204).send();
    } catch(error) {
        const errorResponse = getErrorResponse(500);
        res.status(500).json(errorResponse);
    }
};
