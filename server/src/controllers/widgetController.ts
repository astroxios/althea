import { Request, Response } from 'express';
import * as widgetService from '../services/widgetService';

export const getWidgets = async (req: Request, res: Response) => {
    try {
        const widgets = await widgetService.getWidgets();
        res.json(widgets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch widgets' });
    }
};

export const createWidget = async (req: Request, res: Response) => {
    const { name, typeId } = req.body;
    try {
        const newWidget = await widgetService.createWidget(name, typeId);
        res.status(201).json(newWidget);
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
