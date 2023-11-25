// file to check if the resouce belongs to user or not or he can view and change this resouce if he is the admin else he cannot do anything and an error would be thrown that he is not authorized to access this resource and make changes 
import UnauthorizedError from "../errors/unauthorized.js";

const checkPermissions = (requestUser,resourceUserId) => {
    if(requestUser.role === 'admin') return;
    if(requestUser.userId === resourceUserId.toString()) return;
    throw new UnauthorizedError('Not authorized to access this route');
    return;
}

export default checkPermissions;