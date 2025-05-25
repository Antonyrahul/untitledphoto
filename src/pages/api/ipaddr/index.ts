import { NextApiRequest, NextApiResponse } from "next";
import geoip from "geoip-country";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {

        console.log( geoip.lookup(req.headers['x-forwarded-for'] as string))
        return res.json(geoip.lookup(req.headers['x-forwarded-for'] as string))
    }

}
export default handler;