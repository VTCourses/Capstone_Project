# Install dependency foremost before running the code

### `npm install`

## Initialize the Amplify profile and follow the steps using AWS credentials
## Required : Access key ID, Secret access key

### `amplify init`

## Start the website locally using following command after installing the required dependencies

### `npm start`

This project has some remaining tasks that we were unable to complete, such as connecting the lambda function to the sagemaker endpoint to enable to image segmenting.

The remaining tasks are: Lambda upload trigger, Lambda download trigger.

For the upload trigger, once the user upload to the s3 bucket from the website. It should trigger a lambda function to notify that there has been a upload, then that upload will be processed and send into the sagemaker. Which then sagemaker will handle the nessesary information and send back a segmented image.

It will then be the task of the Lambda download trigger, which will be triggered once the sagemaker is completed. It'll trigger back into a different s3 bucket which could be grabbed and display onto the website so the user can see/download it.


Current website link: https://master.dv725n76m23zx.amplifyapp.com/
We have not implemented a custom domain name for the server yet, therefore the server name is still based off the amplify hosting.
