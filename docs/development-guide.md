# Development guide
This project uses Docker, Docker Compose, React, and Flask. Some familiarity with these technologies is assumed throughout this guide.

## Quickstart

**NOTE:** The only requirement is to have [Docker](https://www.docker.com/) and [Docker-compose](https://docs.docker.com/compose/) installed on your system!

1. Clone the repository:
`git clone https://github.com/OverStruck/deep-dream-maker.git`

2. Build development images: `docker-compose -f docker-compose.dev.yml build`

3. Run the services/containers:
`docker-compose -f docker-compose.dev.yml up` 

Alternatively you can also build the images *and* run them at the same time:
`docker-compose -f docker-compose.dev.yml up --build`

After the containers are running and fully initialized, you can go to `http://localhost:9993/` in your favorite web browser and start playing with the app.

### A few notes

Because we are using docker compose, to start editing source code, you can simply head over to your local repository folder and start editing anything you want. The react development server and the flask development server will auto-reload everytime changes are save to a file.

When using the development docker compose file `docker-compose.dev.yml`, [volumes](https://docs.docker.com/compose/compose-file/compose-file-v3/#volume-configuration-reference) will be setup automatically. If you haven't worked with volumes, before, please read on that to learn more about what they are. Volumes are what allow you to edit code locally and have the development servers in the containers reload automatically.

# Understanding the code base

This project is essentially a web application, which means there is a front-end and a back-end. The front-end is written in React and uses [Material UI](https://material-ui.com/).
The back-end is written in python and uses Flask.

The respository contains to main folders: [webapp](/webapp) and [server](/server). Naturally, the front-end is hosted in the webapp folder and the back-end is in the server folder. Each of those folders contains *two* docker files: `Dockerfile` and `DockerFile.prod`. For development you'll want to use the first docker file `Dockerfile`. 

`.prod` in `DockerFile.prod` stands for *production* and should be use when you want to build the production version of the software.

# Understanding the front-end (webapp)

The webapp was created using React's [Create React App](https://github.com/facebook/create-react-app). The source code you'll be interested in working on is inside the [src](/webapp/src) folder. 

Folder structure:
-  [components](/webapp/src/components)
    - Each react component is here
-  [routes](/webapp/src/routes)
    - Each "page" is here (i.e Home and About)
-  [utils](/webapp/src/utils)
    - Just contains utility code

# Understanding the back-end (server)

The server was created using Flask in Python. The source code you'll be interested in working on is inside the [app](/server/src/app) folder. 

Folder structure:
-  [api](/server/src/app/api)
    - Each api end-point is here. For example a request to `/getProgress` is handled by `getProgress.py`)
-  [deepdream](/server/src/app/deepdream)
    - The actual code that process images is here
-  [utils](/server/src/app/utils)
    - Just contains utility code. The most interesting function here is `processFile` which actually sends the image to the deepdream function in the folder above.

The production version of the server uses gunicorn instead of the built-in development server in Flask. If you want to change the settings for gunicorn, please use the `config.py` file inside of the [gunicorn](/server/src/gunicorn) folder.

The file `wsgi.py` is the entry point for gunicorn. There shouldn't really be a reason to edit this, but feel free if you feel it'll improve something. 

# Improving this guide
Feel free to offer suggestions to improve this guide is there's something else you'd like clarification on. 
