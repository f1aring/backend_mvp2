import sequelize from "sequelize";
import {User} from "../PDF/pdf.model";

export const getUser = async () => {
    try {
        const user = await User.findAll();
        return user
    } catch (error) {
        throw new Error("Error getting all values from database: " + error);
    }
}
export const setUser = async (name: string, account_number: string) => {
    try {
        await User.create({
            name, 
            account_number,
        });
        
    } catch (error) {
        throw new Error("Error getting all values from database: " + error);
    }
}
