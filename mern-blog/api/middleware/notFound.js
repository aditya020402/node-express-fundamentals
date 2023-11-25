const notFound = (req,res) => {
    res.status(404).send("The following route does not exists . Please enter the correct route. ");
}