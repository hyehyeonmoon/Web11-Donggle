import { updateMapService } from '@services/index';

import express, { Request, Response } from 'express';

interface UpdateMapservice {
  populateMapAndSimpleMap: () => void;
}

const router: express.Router = express.Router();

interface MapRequest extends Request {
  body: { [password: string]: string };
}

router.post('/map-data', (req: MapRequest, res: Response) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    void updateMapService.populateMapAndSimpleMap();
    res.status(200).send('HAHA!');
  } else {
    res.status(404).send('DAMN! 404 NOT FOUND... YOU MAD?');
  }
});

export default router;