docker tag sticker-board/api:prod stickerboard.azurecr.io/sb.api:prod
docker push stickerboard.azurecr.io/sb.api:prod


docker tag stickerboard.azurecr.io/sb.api:<branch_name> stickerboard.azurecr.io/sb.api:prod