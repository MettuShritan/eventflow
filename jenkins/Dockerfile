FROM jenkins/jenkins:lts-jdk21

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git python3 python3-pip docker.io \
    && pip3 install --break-system-packages ansible \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 for the EventFlow build and Selenium test runner.
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm --version \
    && node --version \
    && rm -rf /var/lib/apt/lists/*

USER jenkins
