module.exports = (api) => {
    api.cache.forever();
    return {
        plugins: ['syntax-dynamic-import'],
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: false,
                    bugfixes: true,
                    corejs: {
                        version: 3,
                    },
                    useBuiltIns: 'usage',
                    debug: process.env.NODE_ENV === 'development',
                },
            ],
        ],
    };
};
