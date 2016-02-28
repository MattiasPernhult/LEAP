export CLASSPATH=$CLASSPATH:/usr/share/java/junit4-4.11.jar:$tempfolder

cd $tempfolder
#for javafile in $(echo $files | "," "\n") do
javac $testrunner $testfile
# done
java $go > $output
