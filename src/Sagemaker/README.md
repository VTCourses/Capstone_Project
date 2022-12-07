## Running prediction file locally

to run the prediction file locally run:

### `python predict.py`

This will download the model and image from the S3 bucket, run the model, and upload the output onto another S3 bucket, as well as download the outputs.

## Building image with Dockerfile 

To build the image run:

### `docker build -t medical-imaging .`

## Chalice

to deploy the chalice, go into the chalice/predict directory and run:

### `chalice deploy`

Currently this is getting stuck and is not working. 
