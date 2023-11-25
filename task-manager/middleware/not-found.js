const notFound = (req,res) => {
    res.status(404).send("message does not exists");
}

export default notFound;