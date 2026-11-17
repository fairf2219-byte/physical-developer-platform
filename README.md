# PHYSICAL Developer Platform

Developer portal: `/`  
Admin approval center: `/admin.html`

## Deploy on Render
1. In Render, choose **New + → Blueprint**.
2. Connect this GitHub repository.
3. Render reads `render.yaml` and creates the web service.
4. In the service's Environment settings, set a strong `ADMIN_PASSWORD` value and redeploy.
5. Open your service URL; add `/admin.html` for the approval center.

The app uses a local JSON file for storage. On Render's free service, local files can be lost when the service restarts or redeploys. Use a persistent disk or external database before relying on this for real submissions. This is an independent demo platform; it does not publish apps to Meta or any app store.