import { Request, Response } from 'express';
import * as widgetService from '../services/widgetService';

export const getWidget = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const widget = await widgetService.getWidgetById(Number(id));
        if (!widget) {
            return res.status(404).json({ error: 'Widget not found' });
        }

        const response = {
            id: widget.id,
            widget_type: widget.type,
            is_active: widget.is_active,
            createdAt: widget.createdAt,
            updatedAt: widget.updatedAt,
            includes: {
                user: {
                    id: widget.user.id,
                    username: widget.user.username
                }
            }
        };

        res.status(200).json({
            message: 'Widget retrieval successful',
            data: [response]
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getWidgets = async (req: Request, res: Response) => {
    try {
        const idsParam = req.query.ids as string;
        if (!idsParam) {
            return res.status(400).json({ error: "Parameter 'ids' are required" });
        }

        const widgetIds = idsParam.split(',').map(id => parseInt(id.trim(), 10));
        if (widgetIds.some(isNaN)) {
            return res.status(400).json({ error: "Invalid 'ids' parameter. Must be a comma-separated list of numbers." });
        }

        const widgets = await widgetService.getWidgetsByIds(widgetIds);
        if (widgets.length === 0) {
            return res.status(404).json({ error: 'No widgets found' });
        }

        const response = widgets.map(widget => ({
            id: widget.id,
            widget_type: widget.type,
            is_active: widget.is_active,
            createdAt: widget.createdAt,
            updatedAt: widget.updatedAt,
            includes: {
                user: {
                    id: widget.user.id,
                    username: widget.user.username
                }
            }
        }));

        res.status(200).json({
            message: 'Widgets retrieval successful',
            data: [response]
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createWidget = async (req: Request, res: Response) => {
    const user  = req.user;
    const userId = user.id;
    const { widget_type } = req.body;
    try {
        const widget = await widgetService.createWidget(userId, widget_type);
        res.status(201).json({
            message: 'Widget creation successful',
            data: [
                {
                    id: widget.id,
                    widget_type: widget.type,
                    is_active: widget.is_active,
                    createdAt: widget.createdAt,
                    includes: {
                        user: {
                            id: widget.user.id,
                            username: widget.user.username
                        }
                    }
                }
            ]
        });
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateWidget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
        const widget = await widgetService.getWidgetById(Number(id));
        if (!widget) {
            return res.status(404).json({ error: 'Widget not found'});
        }

        const updated_Widget = await widgetService.updateWidget(Number(id), isActive);

        res.status(200).json({
            message: 'Widget update successful',
            data: [
                {
                    id: updated_Widget.id,
                    widget_type: updated_Widget.type.name,
                    createdAt: updated_Widget.createdAt,
                    updatedAt: updated_Widget.updatedAt
                }
            ]
        });
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteWidget = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await widgetService.deleteWidget(Number(id));
        res.status(204).send();
    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
