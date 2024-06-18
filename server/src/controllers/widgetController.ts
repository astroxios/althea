import { Request, Response } from 'express';
import * as widgetService from '../services/widgetService';

export const getWidgets = async (req: Request, res: Response) => {
    // NOTE: getWidgets requires userId from auth_token or other source
    const userId = req.user.id
    try {
        const widgets = await widgetService.getWidgetsByUserId(userId);

        if (!widgets) {
            return res.status(404).json({ error: 'Widgets not found'})
        }

        const formattedResponse = widgets.map(widget => ({
            id: widget.id,
            widget_type: widget.type.name,
            createdAt: widget.createdAt,
        }));

        res.status(200).json({
            message: 'Widgets retrieval successful',
            data: [formattedResponse]
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
                    widget_type: widget.typeName,
                    createdAt: widget.createdAt
                }
            ]
        });
    } catch(error) {
        res.status(500).json({ error: 'Failed to create widget' });
    }
};

export const updateWidget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;
    try {
        const updatedWidget = await widgetService.updateWidget(Number(id), isActive);
        res.json(updatedWidget);
    } catch(error) {
        res.status(500).json({ error: 'Failed to update widget' });
    }
};

export const deleteWidget = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await widgetService.deleteWidget(Number(id));
        res.status(204).send();
    } catch(error) {
        res.status(500).json({ error: 'Failed to delete widget' });
    }
};
