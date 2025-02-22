FROM node

RUN mkdir /mesh

# api spec 소스 복사
COPY ./api_spec /api_spec
# component 소스 복사
COPY ./web_component /web_component
COPY ./tspec-with-joi-to-json /tspec-with-joi-to-json 

# 서버 소스 복사
COPY ./web_input_test /mesh

WORKDIR /mesh

RUN npm update --force
RUN npm install --include prod
 
# 실행 명령어
CMD ["npm", "run", "build"]
