#!/usr/bin/nodejs

import debugFunc from 'debug';
import app from '../app';
import config from '../environment/config';

const debug = debugFunc('magic-dinner-server');

app.set('port', config.port || 3000);

const server = app.listen(app.get('port'), () => {
    // debug('Express server listening on port ' + server.address().port);
    console.log('Express server listening on port ' + server.address().port);
});
