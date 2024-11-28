

docker build -t offerly-react-app .

docker rm -f offerly-react-app-c


docker run --network=offerly-network \
  -d \
  --hostname offerly-react-app \
  -p 3000:3000 \
  --name offerly-react-app-c \
  offerly-react-app
