import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiSpec from '../openapi.json';

import { ToolsController } from './controllers/tools-controller';

const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }'
};
const toolsController = new ToolsController();
const router = Router();

// Tool routes
router.post('/tools/add', toolsController.create);
router.get('/tools/all', toolsController.getAllTools);
router.get('/tools/search', toolsController.search.bind(toolsController));
router.get('/tools/:toolId', toolsController.getToolById);
router.delete('/tools/:toolId', toolsController.remove);

// Dev routes
if (process.env.NODE_ENV === 'development') {
    router.use('/dev/api-docs', swaggerUi.serve);
    router.get('/dev/api-docs', swaggerUi.setup(apiSpec, swaggerUiOptions));
}

export default router;
