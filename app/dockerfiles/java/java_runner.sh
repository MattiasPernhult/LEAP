javac $testfile

for javafile in $(echo $files | "," "\n") do
  javac $javafile
done

java $testrunner 
