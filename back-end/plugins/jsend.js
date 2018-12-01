module.exports = () => {
    return function (req, res, next) {

        res.success = function (data, message = '') {
            res.json({
                'status': 'success',
                'data': data,
                'message': message
            })
        }

        res.failure = function (message = '', data = {}) {
            res.json({
                'status': 'failure',
                'data': data,
                'message': message
            })
        }

        next()
    }
}