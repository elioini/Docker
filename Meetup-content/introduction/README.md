
# Introudction

## Objective
- Introduce Docker and its core concepts
- Hands-on experience
    - Starting and using containers
    - Building and running custom Docker containers

## Preparation

1. Docker Desktop installed ([Docker Installation](https://docs.docker.com/engine/install/))
2. Your favorite command-line terminal (Iterm2, Warp...)
3. GitHub to access the examples
3. Register account with [Docker Hub](https://hub.docker.com/)

## Slides

Check the [prentation.md](./presentation.md)

## Session 1: Working with Docker Containers


### Part 1: Using Containers
Let's play with these containers:
- ```Hello world``` container.
- ```Ubuntu``` container (feel free to choose a different disto).
- ```Multiple ubuntu``` containers.
- ```NGINX```  container.

#### <ins>1.1 Hello world container</ins>

The goal is to check that everything is working. You may refer to the [Hello-world github](https://github.com/docker-library/hello-world/blob/master) for more details.
```
$ docker run hello-world
hello-world
```

#### <ins>1.2 Ubuntu container</ins>
The goal here is to interact with a running container

1- First let's download the image (ubuntu is the image name, latest is a tag used for versioning)
```
$ docker pull ubuntu:latest
```

2- start the container in interactive mode
```
$ docker run -it ubuntu bash
```

3- install new packages
```
$ apt-get update
$ apt-get install -y curl vim

```

4- Access a running container
From a different terminal window try this.
```
$ docker exec -it <container_id/container_name> bash

```

5- Stop container

```
$ docker stop <container_id/container_name>
```
6- Start the container again
when you start the container it will maintain its state. If you use ```run``` instead, it will spin a new container.
```
$ docker start <container_id/container_name>
```

#### <ins>1.3 Mutilple Ubuntu containers</ins>

The goal is to spin two ubuntu containers and connect them using a virtual network. Many testing scenarios can use this setup.

Start by creating a virtual network
```
$ docker network create --driver bridge bridge_network
```
Then we start two ubuntu containers using the same network interface

```
$ docker run -itd --name=container1 --network=bridge_network ubuntu /bin/bash
$ docker run -itd --name=container2 --network=bridge_network ubuntu /bin/bash
```
Note: we are using the ```-d``` to detach from the process. To access the containers later we can use
```
$ docker exec -it <container_id/container_name> /bin/bash
```
If we want to check the container IP address we can use:

1- Option 1: using docker command
```
$ docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container1
```

2- Option 2: from the container itself
```
$ docker exec -it <container_id/container_name> bash
# apt-get update
# apt-get install net-tools iputils-ping
# ifconfig
```
We can check the connection using the ```ping``` command
```
# ping <container-IP>
```


#### <ins>1.4 NGINX container</ins>

Goal:
- Verify that our containers are running (hence *index.html* and *hello.html* get served)
- Mount volume from your host machine, to serve your own *index.html* and *hello.html*

Commands to run
```
docker pull nginx:latest            # pull the nginx image (tagged with 'latest') from docker hub
docker images                       # show the list of images available on your machine
docker run -p 80:80 nginx:latest    # run the nginx image your just pulled, port forward 80 to 80. 
```

Now check localost on your browser http://localhost/ and http://localhost/hello.html
s

Then open another tab and try out some of the following commands:
```
docker ps                                # (-a) check the running/exited containers
docker stop {container_id}               # stop running container
docker restart {container_id}            # restart running container
docker exec -it {container_id} /bin/sh   # grab a shell to execute commands in a container
docker rm {container_id}                 # remove running container
```

Now that you have familiarized with some commands related to *containers*, we will proceed to serve our own static files with nginx.

First, stop your running container, either by `ctrl+c` in the terminal running you nginx or execute `docker stop {container_id}` in another tab.

Then create your own index.html and 50x.html files

```
cd Meetup-content/introdcution/nginx
cat index.html
cat hello.html
```

Run your docker again, but this time mount the files from your host's filesystem onto your container (`-v` option)
```
docker run -p 80:80 -v $(pwd):/usr/share/nginx/html nginx:latest
# run your nginx:latest image, port forward 80 on host to 80 in container
# $(pwd) prints the current working directory
```
Now check the changes on http://localhost/ and http://localhost/hello.html 

Commonly used options for **`docker run`**
```
-p          # port forward from container to host
-v          # mount volume from host onto container
--name      # option to assign a name, which would appear in `docker ps` instead of a randomly generated name
--rm        # remove container on exit
-it         # interactive mode and grab TTY. Useful for interactions, not useful for running web-apps or daemons
-d          # daemon mode
```

So to wrap up, we have pulled the nginx *image* and based on that image, we ran a nginx *container*.

The main takeaway is to think Image vs Containers as Classes vs Objects! (like OO-programming)


### Mini Challenge
Try to run two instances of NGINX: one on localhost:8001 and another on localhost:8002. This time, also make sure that they run in the backgroud (daemon).

Verify that they are two separate instances by serving different static pages.

<details>
  <summary>Possible solution:</summary>
  <p>

<pre>
mkdir ~/tmp && cd ~/tmp

mkdir nginx1 nginx2
echo "Welcome to Nginx 1" > nginx1/index.html
echo "Welcome to Nginx 2" > nginx2/index.html
echo "Hello World on Nginx 1" > nginx1/50x.html
echo "Hello World on Nginx 2" > nginx2/50x.html
docker run -d  -v $(pwd)/nginx1:/usr/share/nginx/html -p 8001:80 nginx:latest
docker run -d  -v $(pwd)/nginx2:/usr/share/nginx/html -p 8002:80 nginx:latest
</pre>

</p></details>
<br/>

Once you have verified that both NGINX containers serve the correct static pages, find the container-ids and subsequently stop and remove those containers
```
docker ps                            # get the container ids of your nginx containers
docker stop {container-ids}          # stop your containers
docker rm {container-ids}            # remove your containers
```

If you want, you can now remove your nginx image with:

```
docker rmi {image-name}
```

### What we have learned in this section
1. A bunch of image commands:
```
docker pull {image-name}
docker images (try the filter option!)
docker rmi {image-name}
```

2. A bunch of container commands:
```
docker run (with various options)
docker ps
docker stop
docker rm
```

3. Difference between Image and Container

### Extra

Scenario: I am working on project and I want my client to try a feature I am working on. What options do I have to accomplish this?


<details>
  <summary>Possible solution:</summary>
  
1- Use a test server to deploy the nightly build (might be expensive)
2- Share screen and test together
3- convert my environment into a test server (using [ngrok](https://ngrok.com/))

<pre>
// forward the requests
$ ngrok http 80

Session Status                online
Account                       Nabil (Plan: Free)
Update                        update available (version 3.6.0, Ctrl-U to update)
Version                       3.4.0
Region                        Asia Pacific (ap)
Latency                       40ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://908c-2001-d08-1400-646c-10ab-c2f8-e994-2bd3.ngrok-free.app -> http://localhost:80
</pre>

</details>

- - - -
 
## Part 2: Create our own image
For this part, we will create our own image, containing our own application.

Goals:
- Understand Dockerfile
- Build our own image
- Basic understanding of the Layered File System
- Run our own image as a container. Run bash within your container.

### 1. Get an app
You can choose your own app or you can use the python app we have here.

### 2. Web app
We are going to build a simple python Flask API that uses ```openweathermap``` and return weather information for a given city.
- Create a folder and create an app.py with the following code
```
$ mkdir webapp
$ cd webapp
$ touch app.py
```
- This is the content of app.py
```python
from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

API_KEY = 'API_KEY'  

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city', '')
    if not city:
        return jsonify({'error': 'Missing city parameter'}), 400

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        weather = {
            'city': city,
            'temperature': f"{data['main']['temp']} °C",
            'description': data['weather'][0]['description']
        }
        return jsonify(weather)
    else:
        return jsonify({'error': 'City not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```
- Create a requirements.txt
```
$ touch requirements.txt
```
- Add the application dependencies
```python
Flask>=2.0.1
requests
```
- You can test the application locally to verify if it is working properly.


### 2. Dockerfile
In this repo, go to Dockerfiles/webapp and  `Dockerfile`. Pay attention to the capital `D`

`FROM`

`Dockerfile` always starts with a `FROM` command, indicating the base image for our own image. 
Be specific about the version of the image. When not specified, the `latest` tag will be used.
Since we are building an image for our Python application, have a look at https://hub.docker.com/_/python 

*Good to know: Pay attention to the various versions and their sizes under the **tags** tab. The ones end with **alpine** and **slim** are much smaller in size. It is strongly advise you to look at their own Dockerfiles to figure out why that is the case.*

`RUN` 

`RUN` instructions are used to run commands against the images that we are building. Typically, one of the first things you would do is to perform a `apt-get` or `yum` update.

This would also result in new layers in the image (LFS => Layered File System). This can be demonstrated that by installing additional software packages later.

`WORKDIR` 

Once the working directory has been specified, commands such as `RUN`, `ADD`, `COPY`, `ENTRYPOINT` and `CMD` will be run from that directory. 
For a web-application, this is typically the root directory your app.

`ADD` or `COPY` 

These commands puts files from your filesystem into the image's filesystem. These commands would also create a layer in the LFS. `ADD` can take URL's as arguments.

`EXPOSE` 

Allows the container to expose a port to your host. At runtime, the `-p` option is still necessary to perform port-forwarding.

`ENTRYPOINT` and `CMD` 

NOTE: If you want to keep it simple, stick to `CMD`

Both can be used to set the default command (such as `npm run development`) and there are no hard rules regarding which one is best.


When both are specified, `CMD` will be used as arguments to `ENTRYPOINT`. Example:
```
ENTRYPOINT ["npm", "run"]
CMD ["development"]
```

In the case above, if you run `docker run {image-name} production`, the argument that you passed in ("production") will override "development" as specified in CMD. 

The main difference between them is that `ENTRYPOINT` will always be run unless `--entrypoint` option is provided to `docker run`. `CMD` on the other hand, can be overridden by providing arguments to the `docker run` command.


In this case, you could provide anything to the `docker run` command... whether it is `/bin/bash` to `ls /etc`.

Also, for inspiration, check the Dockerfiles used to create the official [NGINX](https://hub.docker.com/_/nginx/) 

By now, you should be abe to create your own Dockerfile!


### 3. Build your image
`docker build -t {username/image-name:version} .`

The `.` (current location) implies that there is a `Dockerfile` in your current directory. Else you would have to provide another directory.
`-t` allows you to tag your image

While building the image, pay attention to the layers being created, as well as the time it takes. (This has to do with the Layered File System)

```
$ docker build -t weather-app .
```

<details>
  <summary>Possible solution:</summary>


### Dockerfile

```docker
FROM python:3.8-slim

#working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0"]
```



</details>

### Challenge
Create a custom version of your favorite linux distribution


### Create an Image from a container
If we have arunning container and we have some some changes, once the container is removed we loose all changes. One way to address this issue is creating a new image out of a running container.

```
$ docker commit <CONTAINER_ID/name> new-image
```
How can we distribute our image?

1- Option 1:

Create an archive file
```
$ docker save new-image > new-image.tar
```
Load the tar file
```
$ docker load < new-image.tar
```

2- Option 2: Use DockerHub

```
$ docker login
$ docker tag new-image username/myimage:v1.0
$ docker push username/myimage:v1.0
```
Then if anyone wants to use it
```
$ docker pull username/myimage:v1.0
```