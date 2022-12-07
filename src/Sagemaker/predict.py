import argparse
import numpy as np
import segmentation_models_3D as sm
import sys
import tensorflow as tf

from keras.models import load_model
from patchify import patchify, unpatchify
from skimage import io
from tifffile import imwrite

import tensorflow
from tensorflow.python.saved_model import builder
from keras.models import model_from_json
from tensorflow.python.saved_model.signature_def_utils import predict_signature_def
from tensorflow.python.saved_model import tag_constants
import sagemaker
import tarfile
from sagemaker import get_execution_role
from sagemaker.tensorflow.serving import Model
from matplotlib import pyplot as plt
import boto3
from keras import backend as K
from boto3.session import Session
if tensorflow.executing_eagerly():
    tensorflow.compat.v1.disable_eager_execution()
    

def predict(arguments):
    
    ###pull the file from the S3 bucket
    sagemaker_session = sagemaker.Session()
    
    print("Bucket name is:")
    sagemaker_session.default_bucket()
    sagemaker_session.download_data("./",sagemaker_session.default_bucket(),'image.tif') 
    sagemaker_session.download_data("./",sagemaker_session.default_bucket(),'model.h5')

    ###input the model weight from the model.h5
    MODEL_LOCATION ='model.h5'
    JSON_LOCATION = ''
    WEIGHTS_LOCATION = ''
    if MODEL_LOCATION!='': 
        model = load_model(MODEL_LOCATION,compile=False) #load the model
        print("loaded model from MODEL_LOCATION")
        
    elif JSON_LOCATION!='': # you have your model saved as a JSON file AND weights
    #adapted from https://machinelearningmastery.com/save-load-keras-deep-learning-models/
        json_file = open(JSON_LOCATION, 'r')
        loaded_model_json = json_file.read()
        json_file.close()

        model = model_from_json(loaded_model_json)
        # load weights into new model
        model.load_weights(WEIGHTS_LOCATION)
        print("loaded model from JSON_LOCATION and WEIGHTS_LOCATION")
    
    model_version = '1'
    export_dir = 'export\\Servo\\' + model_version
   # export/Servo/1\variables\variables_temp
    
    build = builder.SavedModelBuilder(export_dir)
    signature = predict_signature_def(
        inputs={"inputs": model.input}, outputs={"score": model.output})
    build.add_meta_graph_and_variables(
        sess=K.get_session(), tags=[tag_constants.SERVING], signature_def_map={"serving_default": signature})
    build.save()
    
       ### Compile the model to tar.gz file and store the model in s3 bucket
    sess= sagemaker.Session()
    model_archive = 'model.tar.gz'
    with tarfile.open(model_archive, mode='w:gz') as archive:
        archive.add('export', recursive=True) 
    model_data = sess.upload_data(path=model_archive, key_prefix='model')
    
    ### create endpoint
    #role = get_execution_role()
    iam_client = boto3.client('iam')
    role = iam_client.get_role(RoleName='SuhaDewan_SageMakerRole')['Role']['Arn']
    print(role)
    print(model_data)
    instance_type = 'ml.c5.xlarge' 
    sm_model = Model(model_data=model_data, 
                     framework_version='2.7',
                     role='SuhaDewan_SageMakerRole')
    uncompiled_predictor = sm_model.deploy(initial_instance_count=1, instance_type=instance_type) 


    ###start predict the unseen image use endpoint 
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)

    parser.add_argument(
        'modelfile',
        help="Model filename",
        type=str)

    parser.add_argument(
        'inputfile',
        help="Input filename",
        type=str)

    parser.add_argument(
        'outputfile',
        help="Output filename",
        type=str)

    args = parser.parse_args(arguments)

    modelfile = args.modelfile
    inputfile = args.inputfile
    outputfile = args.outputfile

    inputimage = io.imread(inputfile)
    model = load_model(MODEL_LOCATION,compile=False) #load the model

    patches = patchify(inputimage, (64, 64, 64), step=64)
    BACKBONE = 'vgg16'  # Try vgg16, efficientnetb7, inceptionv3, resnet50
    preprocess_input = sm.get_preprocessing(BACKBONE)

    predicted_patches = []
    for i in range(patches.shape[0]):
        for j in range(patches.shape[1]):
            for k in range(patches.shape[2]):
                single_patch = patches[i, j, k, :, :, :]
                single_patch_3ch = np.stack((single_patch,)*3, axis=-1)
                single_patch_3ch_input = preprocess_input(
                    np.expand_dims(single_patch_3ch, axis=0))
                single_patch_prediction = model.predict(single_patch_3ch_input)
                single_patch_prediction_result = np.squeeze(
                    single_patch_prediction)
                predicted_patches.append(single_patch_prediction_result)

    predicted_patches = np.array(predicted_patches)

    predicted_patches_reshaped = np.reshape(predicted_patches,
                                            (patches.shape[0], patches.shape[1], patches.shape[2],
                                             patches.shape[3], patches.shape[4], patches.shape[5]))

    reconstructed_image = unpatchify(
        predicted_patches_reshaped, inputimage.shape)

    #imwrite(outputfile, reconstructed_image)
    return  inputimage, reconstructed_image

    
def run_predict():

    argv = [" ",
                'model.h5',
                'image.tif',
                'output'
    ]

    print("Predicting...")
    input_image, reconstructed_image=predict(argv[1:])
    print("Done.")
###saves the output to another S3 bucket
    for i in range(reconstructed_image.shape[0]):
        plt.imsave(f'my_picture_{i}.png', reconstructed_image[i])
        sagemaker_session = sagemaker.Session()
        s3 = boto3.resource('s3')
        s3.Bucket(sagemaker_session.default_bucket()).upload_file(f'my_picture_{i}.png', f'output/my_picture_{i}.png')
