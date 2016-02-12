FROM ubuntu

MAINTAINER pernhultmattias@gmail.com

RUN apt-get update
#prepare for Java download
RUN apt-get install -y python-software-properties
RUN apt-get install -y software-properties-common

#grab oracle java (auto accept licence)
RUN add-apt-repository -y ppa:webupd8team/java
RUN apt-get update
RUN echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections
RUN apt-get install -y oracle-java7-installer
RUN apt-get install -y junit4

ADD java_runner.sh java_runner.sh
RUN chmod +x java_runner.sh

CMD ./java_runner.sh
