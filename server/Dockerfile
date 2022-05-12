# FROM bvlc/caffe:cpu
FROM bvlc/caffe:cpu

WORKDIR /app
COPY requirements.txt requirements.txt
# newer pip version needed to install jsonschema
RUN pip install --upgrade pip setuptools
# install dependencies
RUN pip install -r requirements.txt
#COPY . .
WORKDIR src

ENV FLASK_APP=app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1

CMD ["flask", "run"]
