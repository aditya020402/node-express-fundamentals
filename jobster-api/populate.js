import data from "./mock-data.js";
import Job from "./models/Job.js";

const populate = async() => {
    try{
        await Job.deleteMany();
        await Job.create(data);
        console.log("success");
        process.exit(0);
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
} 

export default populate;
