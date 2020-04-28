import Authentication from './authentication/authentication';
import Workspaces from './workspace/workspace';
import Channel from './channel/channel';
import User from './user/user';

const Routes = (app) => {
    app.use('/api/v1/auth', Authentication);
    app.use('/api/v1/workspace', Workspaces);
    app.use('/api/v1/channel', Channel);
    app.use('/api/v1/user', User);
};

export default Routes;
