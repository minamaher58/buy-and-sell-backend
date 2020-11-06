import { db } from "../database";
import * as admin from "firebase-admin";

export const updateListingRoute = {
    method: 'POST',
    path: '/api/listings/{id}',
    handler: async (req, h) => {
        const { id } = req.params;
        const { name, description, price} = req.payload;
        const token = req.headers.authtoken;
        const user = await admin.auth().verifyIdToken(token);
        const userId = user.user_id;
        
        await db.query(
            `update listings set name=?, description=?, price=? where id=? and user_id=?`,
            [name, description, price, id, userId]
        );

        const { results } = await db.query(
            'select * from listings where id=? and user_id=?',
            [id, userId]
        );

        return results[0];
    }
}