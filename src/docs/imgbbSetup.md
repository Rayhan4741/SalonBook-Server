# ImgBB Image Hosting Setup Guide

1. Create a free account at [ImgBB](https://api.imgbb.com/).
2. Generate an API Key.
3. Add key to `server/.env`:
   ```env
   IMGBB_API_KEY=your_key_here
   ```
4. The backend proxies uploads at `POST /api/uploads/image`.
