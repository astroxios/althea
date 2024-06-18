import widgetModel from "../models/widgetModel";
import widgetTypeModel from "../models/widgetTypeModel";

export const getWidgetById = async (id: number) => {
    return await widgetModel.findUnique({
        where: {
            id,
        },
        include: {
            type: true,
            user: true
        },
    });
};

export const getWidgetsByIds = async (ids: number[]) => {
    return widgetModel.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
};

export const getWidgetsByUserId = async (userId: number) => {
    return await widgetModel.findMany({
        where: { userId },
        include: { type: true },
    });
};

export const createWidget = async (userId: number, widget_type: string) => {
    const widgetType = await widgetTypeModel.findUnique({
        where: { name: widget_type }
    });

    if (!widgetType) {
        throw new Error(`Widget type "${widget_type}" not found`);
    }

    const widget = await widgetModel.create({
        data: {
            user: { connect: { id: userId }},
            type: { connect: { id: widgetType.id }}
        },
        include: {
            type: true, // Include the related WidgetType
            user: true, // Include the related User
        },
    });

    return {
        ...widget,
        typeName: widget.type.name, // Include the name of the WidgetType
        createdAt: widget.createdAt // Include the creation timestamp
    };
};

export const updateWidget = async (id: number, isActive: boolean) => {
    return await widgetModel.update({
        where: { id },
        data: { is_active: isActive },
        include: {
            type: true,
        }
    });
};

export const deleteWidget = async (id: number) => {
    return await widgetModel.delete({
        where: { id },
    });
};
