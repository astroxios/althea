import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { permission } from 'process';

interface AuthenticatedRequest extends Request {
    user?: { userId: number };
}

const prisma = new PrismaClient();

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number};
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

const authorizeRole = (role: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            include: { role: true },
        });

        if (!user) return res.status(404).send('User not found');

        // NOTE: if 'user' model adapts multiple roles, use user.roles.map()
        // FIXME: change user.role.name to user.roles.map
        // Must also change 'role: string[]' to 'roles: string[]' (if adapting)
        // const userRoles = user.roles.map(role => role.name);
        // if (roles.some(role => userRoles.includes(role))) {
        //     next();
        // } else {
        //     res.status(403).send('Access forbidden');
        // };

        // NOTE: if 'user' model adapts a single role, use user.role.name
        const userRole = user.role.name;

        if (role.includes(userRole)) {
            next();
        } else {
            res.status(403).send('Access forbidden');
        }
    };
};

const authorizePermission = (permissions: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            include: { role: { include: { permissions: true } } },
        });

        if (!user) return res.status(404).send('User not found');

        // NOTE: if 'user' model adapts multiple roles, use user.roles.flatMap()
        // FIXME: change user.role.permissions.map() to user.roles.flatMap()
        // const userPermissions = user.roles.flatMap(role => role.permissions.map(permission => permission.name));

        // NOTE: if 'user' model adapts a single role, use user.role.name
        const userPermissions = user.role.permissions.map(permission => permission.name);

        if (permissions.some(permission => userPermissions.includes(permission))) {
            next();
        } else {
            res.status(403).send('Access forbidden');
        }
    }
}

export { authenticateToken, authorizeRole, authorizePermission, AuthenticatedRequest };
