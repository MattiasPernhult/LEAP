export CLASSPATH=$CLASSPATH:/usr/share/java/junit4-4.11.jar:$tempfolder

cd $tempfolder

javac MainTest.java 2> ./error.txt
