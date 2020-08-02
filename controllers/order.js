exports.create = (req, res) => {
    console.log("Create order", req.body);
    // we have to return something, so that execution does not halt at await and code after await works.
    return res.json({});
}