import Authentication from './authentication/authentication';

const Routes = (app) => {
    app.use('/api/v1/auth', Authentication);
};

export default Routes;
