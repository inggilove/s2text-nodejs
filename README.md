# s2text-nodejs
Simple Speech-to-Text by google Speech API
 inggilove @ 2018.02.21


# Jenkins 'Execute Shell'
docker build -f Dockerfile.my-app -t inggilove/my-app .
docker stop my-app && docker rm my-app
docker run --name my-app -p 3000:3000 -d inggilove/my-app 
