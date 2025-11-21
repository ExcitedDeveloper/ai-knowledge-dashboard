import { Router, Request, Response } from 'express';
import { handleSearch } from '../controllers/searchController.js';
import { SearchQuery } from '../types/search.js';

const router = Router();

router.get(
  '/',
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Record<string, never>,
      SearchQuery
    >,
    res: Response
  ) => {
    await handleSearch(req, res);
  }
);

export default router;
