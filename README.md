### Serve expert backend
Refactored and reworked code archive of abandoned project, uses as template for future. 
This is backend side of Serve expert project, based on NodeJS and typescript, written using Clean architecture with support for auto-scaling and cloud deployment.

#### About project
Serve expert is an B2B and B2C platform for IT service providers and customers, that allows you to find and provide hardware repair or software support.
Supports detailed overview of repair process, including chat,price list, repair status, estimations, etc.


#### Tech stack
* NodeJS, Typescript
* Docker, Docker compose
* Envoy proxy
* Fastify
* MongoDB, Mongoose
* Postgres, Prisma
* Redis, IoRedis
* S3, MinIO
* Prometheus, Grafana



#### Main features
* Clean architecture
* Attribute based access control.
* JWT authentication, OppenID Connect via Google. 
* Multi-stage registration using transactional auth flow. 
* Strong request/response validation with Fastify build-in tools.
* Realtime updates via SSE or Long pooling, internally using Redis or EventEmitter implementation (depends on configuration).
* Caching using Redis or in-memory implementation (depends on configuration).
* D-Lock using Redis or in-memory implementation (depends on configuration).
* Data layer has a MongoDB implementation via Mongoose or Postgres via Prisma.
* Transport-agostic api (means controllers can't depends on transport protocol or framework and uses as another layer of abstraction).
* Auto-scaling support via Docker swarm or Kubernetes.
* Subdomain based routing via Envoy proxy and HTTP/2 support.
* Prometheus metrics and Grafana dashboards for monitoring.




#### Building cluster
```
docker compose build
```
#### Start cluster
```
docker compose up
```





