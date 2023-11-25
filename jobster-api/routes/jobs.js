import express from "express";
import testUser from "../middleware/testUser.js";
const router = express.Router();

import {createJob,deleteJob,getAllJobs,updateJob,getJob,showStats} from "../controllers/jobs.js";

router.route("/").post(testUser,createJob).get(getAllJobs);
router.route("/stats").get(showStats);
router.route("/:id").get(getJob).delete(testUser,deleteJob).patch(testUser,updateJob);

export default router;


