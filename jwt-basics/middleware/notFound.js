const notFound = (req,res) => {
    return res.status(404).send("Routes does not exists");
}

export default notFound;