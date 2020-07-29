const proxy = require("http-proxy-middleware")

module.exports = function(app) {
    app.use(
        proxy("/users/login", {
            target: "https://pacific-headland-14360.herokuapp.com",
            secure: false,
            changeOrigin: true
        })
    );
}