const ENVIRONMENTS = {
    Testing: 'testing',
    Prod: 'prod'
}

const PLATFORMS = {
    Xiax: 'xaix',
    MAC: 'darwin',
    FreeBSD: 'freebsd',
    Linux: 'linux',
    OpenBSD: 'openbsd',
    Sunos: 'sunos',
    Windows: 'win32',
    Andriod: 'xandroid',
}

const GIT_URL = 'https://github.com/melkorCBA/create-scss-webpack'

const COMMANDS = {
    DELETE_FOLDER: 'deletef'
}

// Current environment
const Environment = ENVIRONMENTS.Prod;

module.exports = { ENVIRONMENTS, PLATFORMS, COMMANDS, Environment, GIT_URL };

