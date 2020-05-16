#!/bin/bash
cd "$(dirname "$0")"
cd ..
dotnet publish -p:PublishProfile=Properties/PublishProfiles/FolderRelease.pubxml -o out