import Authentication from './authentication/authentication';
import Workspaces from './workspaces/workspace';
import Channels from './channels/channel';

const Routes = (app) => {
    app.use('/api/v1/auth', Authentication);
    app.use('/api/v1/workspaces', Workspaces);
    app.use('/api/v1/channels', Channels);
};

export default Routes;
