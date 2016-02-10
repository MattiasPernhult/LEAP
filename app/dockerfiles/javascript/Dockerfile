FROM ubuntu
MAINTAINER pernhultmattias@gmail.com

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm

ADD run.sh run.sh
RUN chmod +x run.sh

CMD ./run.sh
