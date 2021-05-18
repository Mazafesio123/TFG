import jwt from "jsonwebtoken";

export function isLogged(token) {
	try {
		jwt.verify(token, process.env.SECRET);
		return true;
	} catch (error) {
		return false;
	}
}