import ApiError from "../utils/ApiError.js";

const ROLE_HIERARCHY = { viewer: 1, analyst: 2, admin: 3 };

export default (...allowedRoles) => {
  return (req, res, next) => {
  
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, 'Unauthorized. User context is missing.'));
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    
    const requiredLevel = Math.min(...allowedRoles.map(r => ROLE_HIERARCHY[r] || Infinity));

    if (userLevel < requiredLevel) {
      return next(new ApiError(403, 'Forbidden. Insufficient permissions for this action.'));
    }

    next();
  };
};