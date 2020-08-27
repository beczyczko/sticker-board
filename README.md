## Requirements
* VPS / local server with public IP and ports `80`, `443` accessible from public
* yourdomain.com domain with DNS A record for pointing to your VPS IP
* `docker-compose` installed

## Setup:
1. Copy content of infrastructure/vps directory to VPS
2. Configure environment values in docker-compose.yml and nginx .conf files
3. Configure docker-registry basic-auth according to https://docs.docker.com/registry/deploying/#native-basic-auth
    - Only first step is required: Create a password file with user:password credentials
4. Generate TLS certificates for your HTTP domains with Certbot:
```
> docker-compose run --rm --service-ports certbot certonly -d registry.stickerboard.eu  --standalone
> docker-compose run --rm --service-ports certbot certonly -d rui.stickerboard.eu  --standalone
```
5. In `.docker/config.json` file add section `auths`
```
"auths": {
        "registry.stickerboard.eu": {
                "auth": "<base64 encoded username:password to docker registry>"
        },
        "rui.stickerboard.eu": {
                "auth": "<base64 encoded username:password to docker registry>"
        }
},
```
6. Start servers
```
docker-compose up -d
```