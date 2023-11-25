const notFound = (req,res) => {
    res.status(404).send("the given route does not exist,please enter correct one");
}
export default notFound;