# Development guide
This project uses Docker, Docker Compose, React, and Flask

## Quickstart

**NOTE:** The only requirement is to have [Docker](https://www.docker.com/) and [Docker-compose](https://docs.docker.com/compose/) installed on your system!

1. Clone the repository:
`git clone https://github.com/OverStruck/deep-dream-maker.git`

2. Build development images: `docker-compose -f docker-compose.dev.yml build`

3. Run the services/containers:
`docker-compose -f docker-compose.dev.yml up` 

or 

`docker-compose -f docker-compose.dev.yml up -d` if you don't want to see the terminal output.

Alternatively you can also *just* build the images and run them at the same time:
`docker-compose -f docker-compose.dev.yml up --build`

After the containers are running and fully initialized, you can go to `http://localhost:7777/` in your favorite web browser and start playing with the app.
