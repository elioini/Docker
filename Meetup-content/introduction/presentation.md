https://stackoverflow.com/questions/19585028/i-lose-my-data-when-the-container-exits

## What is Docker?
- Docker is a platform for developing, shipping, and running applications.
- Simplifies the process of managing applications in isolated containers.
- Ensures consistency across multiple development and deployment environments.

---

## Docker Vs VM

- Shared OS Vs Full Isolation
    - Cannot run .NET container on Linux natively
    - Linux containers need Hyper-V (Windows-native hypervisor)
- Less Overhead Vs High overhead (full copy of the OS)
- Portability:
    - Containers: Docker Engine
    - VM: Hypervisor
---

## When to use Docker

- Utilies: no need to configure and install additional libraries
- Microservice Architecture
- CI/CD pipelines: consistency across development
- Testing
- App isolation
- Legacy Applications

---

## Docker Architecture

Four main components
- Docker Daemon
- Docker Client
- Docker Registries (Docker Hub)
- Docker Objects: Images and Containers

---

## Docker Images

- Immutable templates used to create containers.
- Stored in Docker Registries (like Docker Hub).
- Built from a series of layers defined by a Dockerfile.

---

## Docker Containers

- Isolated environments for running applications.
- Created from Docker images.
- Can be run, started, stopped, and deleted.

---

## Docker Hub

- A registry to find and share Docker images.
- Hosts both public and private repositories.
- Integral for sharing images and automating workflows.

---

## Dockerfile

- A text document that contains all the commands to build an image.
- Specifies base images, software installations, environment variables, and more.
