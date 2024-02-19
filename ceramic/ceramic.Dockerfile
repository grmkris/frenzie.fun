FROM ceramicnetwork/js-ceramic:latest

# Path: ceramic.config.json
# https://developers.ceramic.network/docs/protocol/js-ceramic/guides/ceramic-nodes/running-cloud#example-with-docker-containers:~:text=docker%20pull%20ceramicnetwork/js%2Dceramic%3Alatest%0A%0A%23%20Use%20this%20snippet,s3_secret_access_key%20%5C%0A%20%20%2D%2Dname%20js%2Dceramic%20%5C%0A%20%20ceramicnetwork/js%2Dceramic%3Alatest

COPY ceramic.config.json /root/.ceramic/daemon.config.json
