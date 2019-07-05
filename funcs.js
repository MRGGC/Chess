const url = require('url');

module.exports = {
    getUrl: path => {
        return url.format({
            protocol: "http:",
            hostname: "localhost",
            port: 8888,
            pathname: path,
            slashes: true
        });
    },

    createMenu: (Menu, key, app) => {
        const template = [
            {
                submenu: [
                    {
                        label: "Quit",
                        accelerator: key + "+Q",
                        click() { app.quit(); }
                    }
                ]
            }
        ]

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
};
