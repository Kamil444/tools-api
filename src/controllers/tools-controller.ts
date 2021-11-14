import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { v4 } from 'uuid';
import { Tool } from '../models/tool';
import logger from '../logger';

interface SearchQuery { name?:RegExp, typeOfTool?: string }

interface IToolsController {
    create(req: Request, res: Response): void
}

export class ToolsController implements IToolsController {

    public async create(req: Request, res: Response) {
        try {
            const { name, typeOfTool, quantity, junkQuantity } = req.body;
            const tool = new Tool({
                _id: v4(),
                name,
                typeOfTool,
                quantity,
                junkQuantity
            });        
            const newtool = await tool.save();
            res.send({
                message: 'Saved',
                data: tool.toJSON()
            });
        } catch (error) {
            logger.error('Error from Create', error);
            res.status(400).send({
                message: 'Ok'
            });
        }
    }

    public async getAllTools(req: Request, res: Response) {
        try {
            const tools = await Tool.find({});       
            res.send({
                message: 'Ok',
                data: tools
            });
        } catch (error) {
            logger.error('error get all:', error);
            res.status(400).send({
                message: 'Error occured'
            });
        }
        
    }

    public async getToolById(req: Request, res: Response) {
        const { toolId } = req.params;
        logger.silly(`Tool to get: ${toolId}`);
        try {
            const tool = await Tool.findById({ _id: isValidObjectId(toolId) });
            if (!tool) {
                res.status(404).send({
                    message: 'Tool not found'
                });
            }
        
            res.status(200).send({
                message: 'Ok',
                data: tool.toJSON()
            });
        } catch (error) {
            logger.error('Error from ToolId', error);
            res.status(400).send({
                message: 'Ok'
            });
        }
        
    }

    public async remove(req: Request, res: Response) {
        try {
            const { toolId } = req.params;
            const tool = await Tool.findById(toolId);       
            if (!tool) {
                res.status(404).send({
                    message: 'Tool not found'
                });
            }
            await tool.delete();
            res.status(200).send({
                message: 'Ok'
            });
            
        } catch (error) {
            logger.error('Error form remove', error);
            res.status(400).send({
                message: 'Ok'
            });
            
        }
        
    }

    public async search(req: Request, res: Response) {
        try {
            const { limit } = req.query;
            let queryLimit;
            if (limit && !Number.isNaN(Number(limit))) {
                queryLimit = Number(limit);
            }
            const query = this.buildSearchQuery(req.query);
            const tools = await Tool.find(query).limit(queryLimit || 10);
            logger.warn('TOOLS SEARCHED', tools);       
            res.send({
                message: 'Ok',
                data: tools
            });
            
        } catch (error) {
            logger.error('Error from search: ', error);
            res.status(400).send({
                message: 'Ok'                
            });
            
        }
        
    }

    private buildSearchQuery(params: any): SearchQuery {
        const { name, toolType } = params;
        const query: SearchQuery = {};
        if (name) {
            query.name = new RegExp(`.*${name}.*`, 'i');
        }
        if (toolType) {
            query.typeOfTool = toolType;
        }
        return query;
    }
}
