import widgetModel from "../models/widgetModel";

export const getWidgets = async () => {
    return await widgetModel.findMany({
        include: { type: true },
    });
};

export const createWidget = async (name: string, typeId: number) => {
    return await widgetModel.create({
        data: {
            name,
            type: { connect: { id: typeId }},
        },
    });
};

export const updateWidget = async (id: number, isActive: boolean) => {
    return await widgetModel.update({
        where: { id },
        data: { is_active: isActive },
    });
};

export const deleteWidget = async (id: number) => {
    return await widgetModel.delete({
        where: { id },
    });
};
