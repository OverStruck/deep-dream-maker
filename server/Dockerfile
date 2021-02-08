# FROM bvlc/caffe:cpu
FROM bvlc/caffe:cpu

WORKDIR /app
# RUN apt-get update && apt-get install -y
#RUN apk add --no-cache gcc musl-dev linux-header
COPY requirements.txt requirements.txt
# install dependencies
RUN pip install -r requirements.txt
COPY . .

ENV FLASK_APP=src/server.py
ENV FLASK_RUN_HOST=0.0.0.0
CMD ["flask", "run"]
