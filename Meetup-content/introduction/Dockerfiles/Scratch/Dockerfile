# Build stage
FROM golang:1.18 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o helloworld main.go

# Final stage
FROM scratch
COPY --from=builder /app/helloworld /
EXPOSE 8080
CMD ["/helloworld"]