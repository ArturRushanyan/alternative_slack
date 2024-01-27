exports.errorHandler = (res, code, err) => {
    return res.status(code).json({ error: err })
};
