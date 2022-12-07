FROM tensorflow/tensorflow:2.9.2

LABEL description="Capstone project"
# Set a docker label to advertise multi-model support on the container
LABEL com.amazonaws.sagemaker.capabilities.multi-models=true
# Set a docker label to enable container to use SAGEMAKER_BIND_TO_PORT environment variable if present
LABEL com.amazonaws.sagemaker.capabilities.accept-bind-to-port=true

# Upgrade installed packages
RUN apt-get update && apt-get upgrade -y && apt-get clean

# Install necessary dependencies for MMS and SageMaker Inference Toolkit
RUN apt-get -y install --no-install-recommends \
    build-essential \
    ca-certificates \
    openjdk-8-jdk-headless \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/* \
    && python --version \
    && curl -O https://bootstrap.pypa.io/get-pip.py \
    && python get-pip.py

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1
RUN update-alternatives --install /usr/local/bin/pip pip /usr/local/bin/pip3 1

# Install MXNet, MMS, and SageMaker Inference Toolkit to set up MMS
RUN pip3 --no-cache-dir install mxnet \
    multi-model-server \
    sagemaker-inference \
    retrying

# Install pacakges from requirements
RUN pip3 --no-cache-dir install scikit-image \
    classification-models-3D \
	efficientnet-3D \
	segmentation-models-3D \
    patchify \
    scikit-learn \
	scipy \
	matplotlib


# Copy the default custom service file to handle incoming data and inference requests
COPY predict.py /usr/local/bin/predict.py

ENTRYPOINT ["python", "/usr/local/bin/predict.py"]