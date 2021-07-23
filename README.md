# Stickerboard
Stickerboard is a tool that allows you to place colorful sticky notes on a board. With stickerboard you can save your thoughts in a legible form.

## Demo
https://sb.mbtl.life/

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
docker-compose run --rm --service-ports certbot certonly -d registry.mbtl.life  --standalone
```
```
docker-compose run --rm --service-ports certbot certonly -d rui.mbtl.life  --standalone
```
```
docker-compose run --rm --service-ports certbot certonly -d sb.mbtl.life  --standalone
```

5. In `.docker/config.json` file add section `auths`
```
"auths": {
        "registry.mbtl.life": {
                "auth": "<base64 encoded username:password to docker registry>"
        },
        "rui.mbtl.life": {
                "auth": "<base64 encoded username:password to docker registry>"
        }
},
```

6. Setup docker network
```
sh setup.sh
```
7. Start servers
```
docker-compose -f docker-compose.infrastructure.yml up -d
```
```
docker-compose up -d
```
