import json
from heatmappy import Heatmapper
from PIL import Image
import boto3
import botocore
import PIL
import json
import os
from boto3.dynamodb.conditions import Key, Attr
from io import BytesIO

s3 = boto3.resource('s3')

def is_image_exists(bucket_name, key):
    try:
        s3.Object(bucket_name=bucket_name, key='{key}'.format(key=key)).load()
    except botocore.exceptions.ClientError:
        return None


def drawing_heatmap(bucket_name, destination_key, key, point_list) :
    try:
        s3.Object(bucket_name=bucket_name, key=key).load()
        is_image_exists(bucket_name, key)
    except botocore.exceptions.ClientError:
        return None
    obj = s3.Object(bucket_name=bucket_name, key=key)
    obj_body = obj.get()['Body'].read()
    #이미지 등록
    img = Image.open(BytesIO(obj_body))
    heatmapper = Heatmapper()
    heatmap = heatmapper.heatmap_on_img(point_list, img)
    buffer = BytesIO()
    heatmap.save(buffer, 'PNG')
    buffer.seek(0)
    obj = s3.Object(bucket_name=bucket_name, key=destination_key)
    obj.put(Body=buffer, ContentType='image/png')

    return "https://{bucket}.s3.amazonaws.com/{destination_key}".format(bucket=bucket_name, destination_key=destination_key)

def lambda_handler(event, context):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table("eyetracking_points")
    
    name = event["name"]
    index = event["index"]
    response = table.scan(
        FilterExpression=Attr('name').eq('shim') & Attr('index').eq('2')
        )
    
    items = response['Items']
    points = []

    for item in items :
        points.append((float(item['X']),float(item['Y'])))
        
    try:
            bucket = "portfoliosrc"
            key = "portfolio_png/{portfolio_name}/{index}.png".format(portfolio_name=name, index=index)
            destination_key = "heatmap/{portfolio_name}/{index}.png".format(portfolio_name=name,index=index)
            
            image_s3_url = drawing_heatmap(bucket, destination_key, key, points)
    
    except Exception as e:

        print("error::::",e)
        return {
            'body': json.dumps('Error world')
        }
        
    finally:
        return {
          "key":destination_key
          #"destination_key":destination_key
        }
        
    