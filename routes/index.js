import Authentication from './authentication/authentication';
import Workspaces from './workspaces/workspace';

const Routes = (app) => {
    app.use('/api/v1/auth', Authentication);
    app.use('/api/v1/workspaces', Workspaces);
};

export default Routes;
