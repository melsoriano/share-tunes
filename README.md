# Share Tunes

Project for Angel Hack 2019


## Installation
  - Run `npm install` in both client and server directory
  - Run `docker-compose up -d` from the root of the project
  - Go to `localhost:3000`

### Docker
  - Get Container listing: `docker ps -a`
  - Stop a Container: `docker stop ${containerId}`
  - Remove a Container: `docker rm #{containerId}`
  - Remove an Docker Image: `docker rmi #{imageId}`
  - Launch Containers: `docker-compose up -d`
  - Stop Containers and remove volume: `docker-compose down -v`
  - SSH into container: `docker exec -it ${containerId} sh`